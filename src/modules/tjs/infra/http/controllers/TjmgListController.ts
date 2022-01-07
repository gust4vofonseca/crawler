import { Request, Response } from 'express';
import { ProcessFilesRepository } from '@modules/files/infra/typeorm/repositories/ProcessFilesRepository';
import { TjmgProvider } from '@modules/tjs/providers/TjmgProvider/implementations/TjmgProvider';
import { TjmgListService } from '@modules/tjs/services/TjmgListService';
import { ResponseJSON } from '@shared/utils/response';
import { CSVProvider } from '@modules/files/providers/implementations/CSVProvider';

export class TjmgListController {
  async handle(request: Request, response: Response): Promise<void> {
    await ResponseJSON(request, response);

    const csvProvider = new CSVProvider();

    const tjmgProvider = new TjmgProvider();

    const processFilesRepository = new ProcessFilesRepository();

    const tjmgListService = new TjmgListService(
      processFilesRepository,
      tjmgProvider,
      csvProvider,
    );

    await tjmgListService.execute();
  }
}
