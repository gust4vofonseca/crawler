import { Request, Response } from 'express';
import { ProcessFilesRepository } from '@modules/files/infra/typeorm/repositories/ProcessFilesRepository';
import { TjapProvider } from '@modules/tjs/providers/TjapProvider/implementations/TjapProvider';
import { TjapListService } from '@modules/tjs/services/TjapListService';
import { ResponseJSON } from '@shared/utils/response';
import { CSVProvider } from '@modules/files/providers/implementations/CSVProvider';

export class TjapListController {
  async handle(request: Request, response: Response): Promise<void> {
    await ResponseJSON(request, response);

    const csvProvider = new CSVProvider();

    const tjapProvider = new TjapProvider();

    const processFilesRepository = new ProcessFilesRepository();

    const tjapListService = new TjapListService(
      processFilesRepository,
      tjapProvider,
      csvProvider,
    );

    await tjapListService.execute();
  }
}
