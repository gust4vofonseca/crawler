import { ICreateLocationDTO } from '../dtos/ICreateLocationDTO';
import { Location } from '../infra/typeorm/entities/Location';

export interface ILocationsRepository {
  create(data: ICreateLocationDTO[]): Promise<Location[]>;
  findAll(): Promise<Location[]>;
}
