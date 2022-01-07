import { ICreateFileTemplateDTO } from '@modules/files/dtos/ICreateFileTemplateDTO';
import { IFileTemplatesRepository } from '@modules/files/repositories/IFileTemplatesRepository';
import { getRepository, Repository } from 'typeorm';
import { FileTemplate } from '../entities/FileTemplate';

export class FileTemplatesRepository implements IFileTemplatesRepository {
  private ormRepository: Repository<FileTemplate>;

  constructor() {
    this.ormRepository = getRepository(FileTemplate);
  }

  async create(
    file_template: ICreateFileTemplateDTO[],
  ): Promise<FileTemplate[]> {
    const fileTemplate = this.ormRepository.create(file_template);

    await this.ormRepository.save(fileTemplate);

    return fileTemplate;
  }

  async findAll(): Promise<FileTemplate[]> {
    return this.ormRepository.find();
  }
}
