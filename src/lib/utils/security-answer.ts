/** Alignement avec le backend : comparaison insensible à la casse et aux espaces superflus. */
export function normalizeSecurityAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}
