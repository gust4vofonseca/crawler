import fs from 'fs';
import path from 'path';
import { IProcessFilesRepository } from '@modules/files/repositories/IProcessFilesRepository';
import { tjscPath } from '@config/upload';
import csvParser from 'csv-parser';
import { ICSVProvider } from '@modules/files/providers/models/ICSVProvider';
import { removeSpecialCharecters } from '@shared/utils/removeSpecialCharecters';
import { writeApplicationLogError } from '@shared/utils/writeApplicationLogError';
import { IZipFileProvider } from '../providers/models/IZipFileProvider';

export class ZipFilesService {
  constructor(
    private processFilesRepository: IProcessFilesRepository,
    private csvProvider: ICSVProvider,
    private zipFileProvider: IZipFileProvider,
  ) {}

  async execute(id: number, state: string): Promise<void> {
    const processFile = await this.processFilesRepository.findById(id);
    const separator = ';';
    const processNames: string[] = [];
    const processPdfs: string[] = [];
    let filePath: string;
    let filePathState: string;

    if (state === 'TJSC') {
      filePathState = tjscPath;
      filePath = path.resolve(filePathState, 'uploads', processFile.name);

      const csvData = fs
        .createReadStream(filePath, 'utf-8')
        .pipe(csvParser({ separator }));

      for await (const record of csvData) {
        processNames.push(record['Parte ativa']);
      }
    }

    const processNumbers = await this.csvProvider.read(filePath, 'utf8', ';');

    for (let i = 0; i < processNumbers.length; i++) {
      if (processNames[i] !== '') {
        const filename = `${removeSpecialCharecters(processNames[i])}_${
          processNumbers[i]
        }.pdf`;

        const processPdfPathRename = path.resolve(
          filePathState,
          'pdfs',
          filename,
        );

        const processPdfPath = path.resolve(
          filePathState,
          'pdfs',
          `${processNumbers[i]}.pdf`,
        );

        if (fs.existsSync(processPdfPathRename)) {
          processPdfs.push(processPdfPathRename);
        } else {
          try {
            fs.renameSync(processPdfPath, processPdfPathRename);
            processPdfs.push(processPdfPathRename);
          } catch (error) {
            writeApplicationLogError(error.message, 400, 'Zip file');
          }
        }
      }
    }

    await this.zipFileProvider.zipPdfs(
      processPdfs,
      path.resolve(filePathState, 'pdfs'),
      `${processFile.id} - ${state}`,
      path.resolve(filePathState, 'zips'),
    );
  }
}
