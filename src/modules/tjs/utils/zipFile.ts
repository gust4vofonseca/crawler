import path from 'path';
import AdmZip from 'adm-zip';
import AppError from '@shared/errors/AppError';
import fs from 'fs';

export class ZipFile {
  constructor(
    private file_names: string[],
    private module_path: string,
    private zip_file_name: string,
    private result_path: string,
    private isFolder?: boolean,
  ) {}

  private zip = new AdmZip();

  private zipFiles(): Buffer {
    try {
      for (const singleFile of this.file_names) {
        const file_path = path.resolve(this.module_path, singleFile);

        if (this.isFolder) this.zip.addLocalFolder(file_path);
        else this.zip.addLocalFile(file_path);
      }
    } catch (error) {
      console.log(error);
      throw new AppError('Error while generating zip file', 500, 'zipFile');
    }
    return this.zip.toBuffer();
  }

  async createZipFile(): Promise<void> {
    try {
      await fs.promises.writeFile(
        path.resolve(this.result_path, `${this.zip_file_name}.zip`),
        this.zipFiles(),
      );
    } catch (error) {
      throw new AppError('Error while generating zip file', 500, 'zipFile');
    }
  }
}
