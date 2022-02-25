import { Request, Response } from 'express';
import { ProcessFilesRepository } from '@modules/files/infra/typeorm/repositories/ProcessFilesRepository';
import { TjmaProvider } from '@modules/tjs/providers/TjmaProvider/implementations/TjmaProvider';
import { TjmaListService } from '@modules/tjs/services/TjmaListService';
import { ResponseJSON } from '@shared/utils/response';
import { CSVProvider } from '@modules/files/providers/implementations/CSVProvider';

export class TjmaListController {
  async handle(request: Request, response: Response): Promise<void> {
    await ResponseJSON(request, response);

    const csvProvider = new CSVProvider();

    const tjmaProvider = new TjmaProvider();

    const processFilesRepository = new ProcessFilesRepository();

    const tjmsListService = new TjmaListService(
      processFilesRepository,
      tjmaProvider,
      csvProvider,
    );

    await tjmsListService.execute();
  }
}
