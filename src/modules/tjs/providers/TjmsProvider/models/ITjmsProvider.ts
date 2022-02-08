export interface ITjmsProvider {
  searchByChronologicalList(): Promise<void>;
  search(filepath: string): Promise<void>;
}
