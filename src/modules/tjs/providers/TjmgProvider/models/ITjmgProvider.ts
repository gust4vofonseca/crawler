export interface ITjmgProvider {
  searchByChronologicalListEntity(): Promise<void>;
  searchByChronologicalListPayment(): Promise<void>;
}
