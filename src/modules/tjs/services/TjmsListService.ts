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
    // const filePath = path.resolve(tjmsPath, 'uploads', filename);

    await this.tjmsProvider.searchByChronologicalList();

    /* const processNumbers = await this.csvProvider.read(filePath, 'utf8', ';');
    const data = [];
    let id = 0;
    for (let number of processNumbers) {
      [number] = number.split(' ');
      if (data.indexOf(number) === -1) {
        data.push(number);
        await this.tjmsProvider.search(number, id);
        id++;
      }
    } */
  }
}
