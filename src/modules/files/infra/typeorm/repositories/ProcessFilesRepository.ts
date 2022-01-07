import { ICreateProcessFileDTO } from '@modules/files/dtos/ICreateProcessFileDTO';
import { getRepository, Repository } from 'typeorm';
import { ProcessFile } from '@modules/files/infra/typeorm/entities/ProcessFile';
import { IProcessFilesRepository } from '@modules/files/repositories/IProcessFilesRepository';

export class ProcessFilesRepository implements IProcessFilesRepository {
  private ormRepository: Repository<ProcessFile>;

  constructor() {
    this.ormRepository = getRepository(ProcessFile);
  }

  async create({
    lines,
    name,
    court,
  }: ICreateProcessFileDTO): Promise<ProcessFile> {
    const file = this.ormRepository.create({ lines, name, court });

    await this.ormRepository.save(file);

    return file;
  }

  async update(process_file: ProcessFile): Promise<ProcessFile> {
    return this.ormRepository.save(process_file);
  }

  async findById(id: number): Promise<ProcessFile | undefined> {
    return this.ormRepository.findOne(id);
  }

  async findAllOrderByCreatedAt(court: string): Promise<ProcessFile[]> {
    return this.ormRepository.find({
      where: { court },
      order: { created_at: 'DESC' },
    });
  }
}
