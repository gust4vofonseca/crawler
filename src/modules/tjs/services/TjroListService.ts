import { ICSVProvider } from '@modules/files/providers/models/ICSVProvider';
import { IProcessFilesRepository } from '@modules/files/repositories/IProcessFilesRepository';
import { ITjroProvider } from '../providers/TjroProvider/models/ITjroProvider';

export class TjroListService {
  constructor(
    private processFilesRepository: IProcessFilesRepository,
    private tjroProvider: ITjroProvider,
    private csvProvider: ICSVProvider,
  ) {}

  async execute(): Promise<void> {
    await this.tjroProvider.searchByChronologicalList();
  }
}
