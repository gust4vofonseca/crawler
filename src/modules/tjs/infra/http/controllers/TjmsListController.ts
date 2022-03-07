import { Request, Response } from 'express';
import { ProcessFilesRepository } from '@modules/files/infra/typeorm/repositories/ProcessFilesRepository';
import { TjmsProvider } from '@modules/tjs/providers/TjmsProvider/implementations/TjmsProvider';
import { TjmsListService } from '@modules/tjs/services/TjmsListService';
import { ResponseJSON } from '@shared/utils/response';
import { CSVProvider } from '@modules/files/providers/implementations/CSVProvider';

export class TjmsListController {
  async handle(request: Request, response: Response): Promise<void> {
    // const { filename } = request.file;

    await ResponseJSON(request, response);

    const tjmsProvider = new TjmsProvider();

    const csvProvider = new CSVProvider();

    const processFilesRepository = new ProcessFilesRepository();

    const tjmsService = new TjmsListService(
      processFilesRepository,
      tjmsProvider,
      csvProvider,
    );

    await tjmsService.execute();
  }
}
