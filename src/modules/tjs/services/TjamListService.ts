import { ICSVProvider } from '@modules/files/providers/models/ICSVProvider';
import { IProcessFilesRepository } from '@modules/files/repositories/IProcessFilesRepository';
import { ITjamProvider } from '../providers/TjamProvider/models/ITjamProvider';

export class TjamListService {
  constructor(
    private processFilesRepository: IProcessFilesRepository,
    private tjamProvider: ITjamProvider,
    private csvProvider: ICSVProvider,
  ) {}

  async execute(): Promise<void> {
    await this.tjamProvider.searchByChronologicalList();
  }
}
