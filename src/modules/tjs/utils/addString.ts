export function add(str: string, index: number, value: string): string {
  return str.substr(0, index) + value + str.substr(index);
}
