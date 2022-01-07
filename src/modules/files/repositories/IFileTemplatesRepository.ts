import { ICreateFileTemplateDTO } from '../dtos/ICreateFileTemplateDTO';
import { FileTemplate } from '../infra/typeorm/entities/FileTemplate';

export interface IFileTemplatesRepository {
  create(data: ICreateFileTemplateDTO[]): Promise<FileTemplate[]>;
  findAll(): Promise<FileTemplate[]>;
}
