import sanitizeHtml, { type IOptions } from "sanitize-html";

const EMAIL_ALLOWED_TAGS = [
  "a",
  "abbr",
  "article",
  "aside",
  "b",
  "blockquote",
  "br",
  "caption",
  "code",
  "del",
  "div",
  "em",
  "figcaption",
  "figure",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "li",
  "main",
  "ol",
  "p",
  "pre",
  "section",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
];

const EMAIL_ALLOWED_ATTRIBUTES: IOptions["allowedAttributes"] = {
  "*": ["align", "dir", "style", "title"],
  a: ["href", "name", "target", "rel"],
  img: ["src", "alt", "title", "width", "height"],
  table: ["align", "border", "cellpadding", "cellspacing", "width"],
  td: ["align", "colspan", "height", "rowspan", "valign", "width"],
  th: ["align", "colspan", "height", "rowspan", "valign", "width"],
};

export function sanitizeEmailHtml(html: string): string {
  if (!html.trim()) return "";

  return sanitizeHtml(html, {
    allowedTags: EMAIL_ALLOWED_TAGS,
    allowedAttributes: EMAIL_ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      a: ["http", "https", "mailto"],
      img: ["http", "https", "data", "cid"],
    },
    allowedSchemesAppliedToAttributes: ["href", "src"],
    allowProtocolRelative: false,
    disallowedTagsMode: "discard",
    transformTags: {
      a: (tagName: string, attribs: Record<string, string>) => ({
        tagName,
        attribs: {
          ...attribs,
          target: "_blank",
          rel: "noopener noreferrer nofollow",
        },
      }),
    },
  });
}
