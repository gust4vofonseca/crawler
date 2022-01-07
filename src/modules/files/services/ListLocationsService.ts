import { ILocationsRepository } from '@modules/files/repositories/ILocationsRepository';
import { Location } from '@modules/files/infra/typeorm/entities/Location';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ListLocationsService {
  constructor(
    @inject('LocationsRepository')
    private locationsRepository: ILocationsRepository,
  ) {}

  async execute(): Promise<Location[]> {
    const locations = await this.locationsRepository.findAll();

    return locations;
  }
}
