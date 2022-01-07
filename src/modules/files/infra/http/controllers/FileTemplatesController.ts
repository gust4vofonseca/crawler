import { Request, Response } from 'express';
import { CreateFileTemplatesService } from '@modules/files/services/CreateFileTemplateService';
import { ListFileTemplatesService } from '@modules/files/services/ListFileTemplatesService';
import { container } from 'tsyringe';

export class FileTemplatesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const templates = request.body;

    const createFileTemplatesService = container.resolve(
      CreateFileTemplatesService,
    );

    const fileTemplates = await createFileTemplatesService.execute(templates);

    return response.status(201).json(fileTemplates);
  }

  async index(request: Request, response: Response): Promise<Response> {
    const listFileTemplatesService = container.resolve(
      ListFileTemplatesService,
    );

    const fileTemplates = await listFileTemplatesService.execute();

    return response.status(200).json(fileTemplates);
  }
}
