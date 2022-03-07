import { tjmsPath } from '@config/upload';
import { ICSVProvider } from '@modules/files/providers/models/ICSVProvider';
import { IProcessFilesRepository } from '@modules/files/repositories/IProcessFilesRepository';
import path from 'path';
import { ITjmsProvider } from '../providers/TjmsProvider/models/ITjmsProvider';

export class TjmsListService {
  constructor(
    private processFilesRepository: IProcessFilesRepository,
    private tjmsProvider: ITjmsProvider,
    private csvProvider: ICSVProvider,
  ) {}

  async execute(): Promise<void> {
    await this.tjmsProvider.searchByChronologicalList();
  }
}
