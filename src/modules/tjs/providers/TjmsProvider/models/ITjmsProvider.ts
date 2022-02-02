export interface ITjmsProvider {
  searchByChronologicalList(): Promise<void>;
  search(number: string, id: number): Promise<void>;
}
