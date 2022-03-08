import { Request, Response } from 'express';
import { ProcessFilesRepository } from '@modules/files/infra/typeorm/repositories/ProcessFilesRepository';
import { TjamProvider } from '@modules/tjs/providers/TjamProvider/implementations/TjamProvider';
import { TjamListService } from '@modules/tjs/services/TjamListService';
import { ResponseJSON } from '@shared/utils/response';
import { CSVProvider } from '@modules/files/providers/implementations/CSVProvider';

export class TjamListController {
  async handle(request: Request, response: Response): Promise<void> {
    await ResponseJSON(request, response);

    const csvProvider = new CSVProvider();

    const tjamProvider = new TjamProvider();

    const processFilesRepository = new ProcessFilesRepository();

    const tjamListService = new TjamListService(
      processFilesRepository,
      tjamProvider,
      csvProvider,
    );

    await tjamListService.execute();
  }
}
