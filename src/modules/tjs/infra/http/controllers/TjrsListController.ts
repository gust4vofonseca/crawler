import { Request, Response } from 'express';
import { ProcessFilesRepository } from '@modules/files/infra/typeorm/repositories/ProcessFilesRepository';
import { TjrsProvider } from '@modules/tjs/providers/TjrsProvider/implementations/TjrsProvider';
import { TjrsListService } from '@modules/tjs/services/TjrsListService';
import { ResponseJSON } from '@shared/utils/response';
import { CSVProvider } from '@modules/files/providers/implementations/CSVProvider';

export class TjrsListController {
  async handle(request: Request, response: Response): Promise<void> {
    await ResponseJSON(request, response);

    const csvProvider = new CSVProvider();

    const tjrsProvider = new TjrsProvider();

    const processFilesRepository = new ProcessFilesRepository();

    const tjmgListService = new TjrsListService(
      processFilesRepository,
      tjrsProvider,
      csvProvider,
    );

    await tjmgListService.execute();
  }
}
