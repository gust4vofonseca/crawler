import { ZipFile } from '@modules/tjs/utils/zipFile';
import { IZipFileProvider } from '../models/IZipFileProvider';

export class ZipFileProvider implements IZipFileProvider {
  async zipPdfs(
    processPdfs: string[],
    module_path: string,
    zip_file_name: string,
    result_path: string,
  ): Promise<void> {
    const zipFile = new ZipFile(
      processPdfs,
      module_path,
      zip_file_name,
      result_path,
    );

    await zipFile.createZipFile();
  }
}
