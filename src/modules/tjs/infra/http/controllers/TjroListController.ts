import { Request, Response } from 'express';
import { ProcessFilesRepository } from '@modules/files/infra/typeorm/repositories/ProcessFilesRepository';
import { TjroProvider } from '@modules/tjs/providers/TjroProvider/implementations/TjroProvider';
import { TjroListService } from '@modules/tjs/services/TjroListService';
import { ResponseJSON } from '@shared/utils/response';
import { CSVProvider } from '@modules/files/providers/implementations/CSVProvider';

export class TjroListController {
  async handle(request: Request, response: Response): Promise<void> {
    await ResponseJSON(request, response);

    const csvProvider = new CSVProvider();

    const tjroProvider = new TjroProvider();

    const processFilesRepository = new ProcessFilesRepository();

    const tjroListService = new TjroListService(
      processFilesRepository,
      tjroProvider,
      csvProvider,
    );

    await tjroListService.execute();
  }
}
