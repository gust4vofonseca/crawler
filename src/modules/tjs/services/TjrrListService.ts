import { ICSVProvider } from '@modules/files/providers/models/ICSVProvider';
import { IProcessFilesRepository } from '@modules/files/repositories/IProcessFilesRepository';
import { ITjrrProvider } from '../providers/TjrrProvider/models/ITjrrProvider';

export class TjrrListService {
  constructor(
    private processFilesRepository: IProcessFilesRepository,
    private tjrrProvider: ITjrrProvider,
    private csvProvider: ICSVProvider,
  ) {}

  async execute(): Promise<void> {
    await this.tjrrProvider.searchByChronologicalList();
  }
}
