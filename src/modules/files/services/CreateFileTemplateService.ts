import { FileTemplate } from '@modules/files/infra/typeorm/entities/FileTemplate';
import { IFileTemplatesRepository } from '@modules/files/repositories/IFileTemplatesRepository';
import { inject, injectable } from 'tsyringe';

interface IRequest {
  court: string;
  example_process_number: string;
}

@injectable()
export class CreateFileTemplatesService {
  constructor(
    @inject('FileTemplatesRepository')
    private fileTemplatesRepository: IFileTemplatesRepository,
  ) {}

  async execute(file_templates: IRequest[]): Promise<FileTemplate[]> {
    const fileTemplates = await this.fileTemplatesRepository.create(
      file_templates,
    );

    return fileTemplates;
  }
}
