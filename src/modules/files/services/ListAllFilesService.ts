import { inject, injectable } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';
import { format } from 'date-fns';
import { IProcessFilesRepository } from '../repositories/IProcessFilesRepository';

interface IResponse {
  id: number;
  name: string;
  court: string;
  lines: number;
  processed: number;
  zip_name: string;
  created_at: string;
}

@injectable()
export class ListAllFilesService {
  constructor(
    @inject('ProcessFilesRepository')
    private processFilesRepository: IProcessFilesRepository,
  ) {}

  async execute(court: string): Promise<IResponse[]> {
    const processFiles =
      await this.processFilesRepository.findAllOrderByCreatedAt(court);

    const files = processFiles.map(file => {
      const name = file.name;

      return {
        ...instanceToInstance(file),
        name: name.trim(),
        created_at: format(new Date(file.created_at), 'dd/MM/yyyy HH:mm'),
      };
    });

    return files;
  }
}
