import { ICSVProvider } from '@modules/files/providers/models/ICSVProvider';
import { IProcessFilesRepository } from '@modules/files/repositories/IProcessFilesRepository';
import { ITjmaProvider } from '../providers/TjmaProvider/models/ITjmaProvider';

export class TjmaListService {
  constructor(
    private processFilesRepository: IProcessFilesRepository,
    private tjmaProvider: ITjmaProvider,
    private csvProvider: ICSVProvider,
  ) {}

  async execute(): Promise<void> {
    await this.tjmaProvider.searchByChronologicalListEntity();
  }
}
