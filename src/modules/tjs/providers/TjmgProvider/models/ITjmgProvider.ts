import { ITJMGList } from '@modules/tjs/dtos/ITJMGProcess';

export interface ITjmgProvider {
  // Lista cronologica
  searchByChronologicalList(): Promise<void>;
  // formatChronologicalList(data: string, id: string): Promise<ITJMGList>;
  searchByChronologicalList2(): Promise<void>;
  // formatChronologicalList2(data: string, id: string): Promise<ITJMGList>;
}
