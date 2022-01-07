import { ICreateProcessFileDTO } from '@modules/files/dtos/ICreateProcessFileDTO';
import { ProcessFile } from '../infra/typeorm/entities/ProcessFile';

export interface IProcessFilesRepository {
  create(process_file: ICreateProcessFileDTO): Promise<ProcessFile>;
  update(process_file: ProcessFile): Promise<ProcessFile>;
  findById(id: number): Promise<ProcessFile | undefined>;
  findAllOrderByCreatedAt(trf: string): Promise<ProcessFile[]>;
}
