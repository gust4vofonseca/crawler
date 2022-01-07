import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListAllFilesService } from '@modules/files/services/ListAllFilesService';

export class ProcessFilesController {
  async index(request: Request, response: Response): Promise<Response> {
    const { court } = request.query;

    const listAllFilesService = container.resolve(ListAllFilesService);

    const files = await listAllFilesService.execute(String(court));

    return response.status(200).json(files);
  }
}
