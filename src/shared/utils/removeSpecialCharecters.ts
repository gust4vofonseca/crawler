export function removeSpecialCharecters(value: string): string {
  return value.replace(/[\\&*:"!/|><%#?]/gm, ' ');
}
