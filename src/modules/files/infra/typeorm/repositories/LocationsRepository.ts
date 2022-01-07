import { getRepository, Repository } from 'typeorm';
import { ICreateLocationDTO } from '@modules/files/dtos/ICreateLocationDTO';
import { ILocationsRepository } from '@modules/files/repositories/ILocationsRepository';
import { Location } from '../entities/Location';

export class LocationsRepository implements ILocationsRepository {
  private ormRepository: Repository<Location>;

  constructor() {
    this.ormRepository = getRepository(Location);
  }

  async create(locations: ICreateLocationDTO[]): Promise<Location[]> {
    const newLocations = locations.map(location =>
      this.ormRepository.create(location),
    );

    await this.ormRepository.save(newLocations);

    return newLocations;
  }

  async findAll(): Promise<Location[]> {
    return this.ormRepository.find();
  }
}
