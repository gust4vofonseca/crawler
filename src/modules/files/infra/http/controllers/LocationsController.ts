import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateLocationsService } from '@modules/files/services/CreateLocationsService';
import { ListLocationsService } from '@modules/files/services/ListLocationsService';

export class LocationsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const createLocationsService = container.resolve(CreateLocationsService);

    const locations = await createLocationsService.execute();

    return response.status(201).json(locations);
  }

  async index(request: Request, response: Response): Promise<Response> {
    const listLocationsService = container.resolve(ListLocationsService);

    const locations = await listLocationsService.execute();

    return response.status(200).json(locations);
  }
}
