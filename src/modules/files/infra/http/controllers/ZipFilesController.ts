import { Request, Response } from 'express';
import { ZipFilesService } from '@modules/files/services/ZipFilesService';
import { CSVProvider } from '@modules/files/providers/implementations/CSVProvider';
import { ZipFileProvider } from '@modules/files/providers/implementations/ZipFileProvider';
import { ProcessFilesRepository } from '../../typeorm/repositories/ProcessFilesRepository';

export class ZipFilesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const csvProvider = new CSVProvider();
    const processFilesRepository = new ProcessFilesRepository();
    const zipFileProvider = new ZipFileProvider();
    const zipFilesService = new ZipFilesService(
      processFilesRepository,
      csvProvider,
      zipFileProvider,
    );

    const { id } = request.params;
    const { state } = request.body;

    const zipPdfs = await zipFilesService.execute(Number(id), state);

    return response.status(200).json(zipPdfs);
  }
}
