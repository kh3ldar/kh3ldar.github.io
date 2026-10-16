/** Replaces {key} placeholders. Unknown keys become empty strings; blank lines left behind collapse. */
export function fillTemplate(template: string, values: Record<string, string | undefined>): string {
  return template
    .replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\n+$/, '')
}
