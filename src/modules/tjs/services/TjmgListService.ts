import { ICSVProvider } from '@modules/files/providers/models/ICSVProvider';
import { IProcessFilesRepository } from '@modules/files/repositories/IProcessFilesRepository';
import { ITjmgProvider } from '../providers/TjmgProvider/models/ITjmgProvider';

export class TjmgListService {
  constructor(
    private processFilesRepository: IProcessFilesRepository,
    private tjmgProvider: ITjmgProvider,
    private csvProvider: ICSVProvider,
  ) {}

  async execute(): Promise<void> {
    this.tjmgProvider.searchByChronologicalList();
    this.tjmgProvider.searchByChronologicalList2();
  }
}
