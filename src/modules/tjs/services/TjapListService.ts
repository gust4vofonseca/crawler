import { ICSVProvider } from '@modules/files/providers/models/ICSVProvider';
import { IProcessFilesRepository } from '@modules/files/repositories/IProcessFilesRepository';
import { ITjapProvider } from '../providers/TjapProvider/models/ITjapProvider';

export class TjapListService {
  constructor(
    private processFilesRepository: IProcessFilesRepository,
    private tjapProvider: ITjapProvider,
    private csvProvider: ICSVProvider,
  ) {}

  async execute(): Promise<void> {
    await this.tjapProvider.searchByChronologicalList();
  }
}
