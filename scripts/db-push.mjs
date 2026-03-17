import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { sql } from "drizzle-orm";
import { pushSQLiteSchema } from "drizzle-kit/api";
import * as schema from "../src/lib/db/schema.ts";

const dbUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
const dryRun = process.argv.includes("--dry-run");

if (!dbUrl) {
  console.error("Missing TURSO_DATABASE_URL");
  process.exit(1);
}

const client = createClient({
  url: dbUrl,
  authToken,
});

const db = drizzle(client, { schema });

const FTS_DROP_TABLES = new Set([
  "emails_fts",
  "emails_fts_data",
  "emails_fts_idx",
  "emails_fts_docsize",
  "emails_fts_config",
]);

function isIgnoredFtsStatement(statement) {
  const match = statement.match(/DROP TABLE `([^`]+)`;/);
  if (!match) return false;
  return FTS_DROP_TABLES.has(match[1]);
}

function isIgnoredFtsWarning(warning) {
  return /emails_fts(_data|_idx|_docsize|_config)? table/i.test(warning);
}

async function ensureSqliteSearchStructures() {
  const statements = [
    `CREATE VIRTUAL TABLE IF NOT EXISTS emails_fts USING fts5(
      subject,
      sender,
      snippet,
      content='emails',
      content_rowid='rowid',
      tokenize='unicode61 remove_diacritics 2'
    );`,
    `CREATE TRIGGER IF NOT EXISTS emails_ai_fts AFTER INSERT ON emails BEGIN
      INSERT INTO emails_fts(rowid, subject, sender, snippet)
      VALUES (new.rowid, coalesce(new.subject, ''), coalesce(new.sender, ''), coalesce(new.snippet, ''));
    END;`,
    `CREATE TRIGGER IF NOT EXISTS emails_ad_fts AFTER DELETE ON emails BEGIN
      INSERT INTO emails_fts(emails_fts, rowid, subject, sender, snippet)
      VALUES ('delete', old.rowid, coalesce(old.subject, ''), coalesce(old.sender, ''), coalesce(old.snippet, ''));
    END;`,
    `CREATE TRIGGER IF NOT EXISTS emails_au_fts AFTER UPDATE ON emails BEGIN
      INSERT INTO emails_fts(emails_fts, rowid, subject, sender, snippet)
      VALUES ('delete', old.rowid, coalesce(old.subject, ''), coalesce(old.sender, ''), coalesce(old.snippet, ''));
      INSERT INTO emails_fts(rowid, subject, sender, snippet)
      VALUES (new.rowid, coalesce(new.subject, ''), coalesce(new.sender, ''), coalesce(new.snippet, ''));
    END;`,
    `INSERT INTO emails_fts(rowid, subject, sender, snippet)
      SELECT rowid, coalesce(subject, ''), coalesce(sender, ''), coalesce(snippet, '')
      FROM emails
      WHERE rowid NOT IN (SELECT rowid FROM emails_fts);`,
  ];

  for (const statement of statements) {
    await client.execute(statement);
  }
}

async function applyStatements(statements) {
  for (const statement of statements) {
    await db.run(sql.raw(statement));
  }
}

async function main() {
  const result = await pushSQLiteSchema(schema, db);

  const ignoredStatements = result.statementsToExecute.filter(isIgnoredFtsStatement);
  const remainingStatements = result.statementsToExecute.filter((statement) => !isIgnoredFtsStatement(statement));
  const remainingWarnings = result.warnings.filter((warning) => !isIgnoredFtsWarning(warning));

  if (remainingWarnings.length > 0) {
    console.error("Drizzle push has remaining warnings:");
    for (const warning of remainingWarnings) {
      console.error(warning);
    }
    process.exit(1);
  }

  if (dryRun) {
    console.log(JSON.stringify({
      ignoredFtsStatements: ignoredStatements,
      statementsToExecute: remainingStatements,
      ensuredFts: true,
    }, null, 2));
    return;
  }

  if (remainingStatements.length > 0) {
    await applyStatements(remainingStatements);
    console.log(`Applied ${remainingStatements.length} schema statement(s).`);
  } else {
    console.log("No schema changes to apply.");
  }

  await ensureSqliteSearchStructures();

  if (ignoredStatements.length > 0) {
    console.log(`Ignored ${ignoredStatements.length} SQLite FTS internal statement(s).`);
  }

  console.log("Ensured SQLite FTS search structures.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
