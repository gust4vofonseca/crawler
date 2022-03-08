import { Request, Response } from 'express';
import { ProcessFilesRepository } from '@modules/files/infra/typeorm/repositories/ProcessFilesRepository';
import { TjrrProvider } from '@modules/tjs/providers/TjrrProvider/implementations/TjrrProvider';
import { TjrrListService } from '@modules/tjs/services/TjrrListService';
import { ResponseJSON } from '@shared/utils/response';
import { CSVProvider } from '@modules/files/providers/implementations/CSVProvider';

export class TjrrListController {
  async handle(request: Request, response: Response): Promise<void> {
    await ResponseJSON(request, response);

    const csvProvider = new CSVProvider();

    const tjrrProvider = new TjrrProvider();

    const processFilesRepository = new ProcessFilesRepository();

    const tjrrListService = new TjrrListService(
      processFilesRepository,
      tjrrProvider,
      csvProvider,
    );

    await tjrrListService.execute();
  }
}
