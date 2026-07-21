/**
 * Language metadata and HTML escaping — deliberately free of any highlight.js
 * import so admin dropdowns and plain-text fallbacks stay out of the grammar
 * chunk (see `highlight.ts`, which is loaded on demand).
 */

/** Languages offered in the admin dropdowns — each value is a registered hljs id. */
export const CODE_LANGUAGES: { value: string; label: string }[] = [
  { value: "plaintext", label: "Plain text" },
  { value: "java", label: "Java" },
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "kotlin", label: "Kotlin" },
  { value: "swift", label: "Swift" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash / Shell" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "xml", label: "HTML / XML" },
  { value: "css", label: "CSS" },
];

/** Human label for a language id, falling back to the raw id. */
export function languageLabel(id?: string): string {
  if (!id) return "Code";
  const known = CODE_LANGUAGES.find((l) => l.value === id.toLowerCase());
  return known ? known.label : id;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
