import { FileTemplate } from '@modules/files/infra/typeorm/entities/FileTemplate';
import { IFileTemplatesRepository } from '@modules/files/repositories/IFileTemplatesRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ListFileTemplatesService {
  constructor(
    @inject('FileTemplatesRepository')
    private fileTemplatesRepository: IFileTemplatesRepository,
  ) {}

  async execute(): Promise<FileTemplate[]> {
    const fileTemplates = await this.fileTemplatesRepository.findAll();

    return fileTemplates;
  }
}
