ALTER TABLE `accounts` ADD `sync_read_back` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `accounts` ADD `sync_star_back` integer DEFAULT 0 NOT NULL;
