import axios from 'axios';
import { ILocationsRepository } from '@modules/files/repositories/ILocationsRepository';
import { Location } from '@modules/files/infra/typeorm/entities/Location';
import { inject, injectable } from 'tsyringe';

interface Region {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGEStates {
  id: number;
  sigla: string;
  nome: string;
  regiao: Region;
}

@injectable()
export class CreateLocationsService {
  constructor(
    @inject('LocationsRepository')
    private locationsRepository: ILocationsRepository,
  ) {}

  async execute(): Promise<Location[]> {
    const response = await axios.get<IBGEStates[]>(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
    );

    const locations = response.data.map(state => {
      return {
        id: state.id,
        name: state.nome,
        initials: state.sigla,
        region: state.regiao.nome,
      };
    });

    await this.locationsRepository.create(locations);

    return locations;
  }
}
