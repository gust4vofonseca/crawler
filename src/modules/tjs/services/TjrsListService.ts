import { ICSVProvider } from '@modules/files/providers/models/ICSVProvider';
import { IProcessFilesRepository } from '@modules/files/repositories/IProcessFilesRepository';
import { ITjrsProvider } from '../providers/TjrsProvider/models/ITjrsProvider';

export class TjrsListService {
  constructor(
    private processFilesRepository: IProcessFilesRepository,
    private tjmgProvider: ITjrsProvider,
    private csvProvider: ICSVProvider,
  ) {}

  async execute(): Promise<void> {
    await this.tjmgProvider.searchByChronologicalList();
  }
}
