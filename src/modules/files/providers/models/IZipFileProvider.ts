export interface IZipFileProvider {
  zipPdfs(
    processPdfs: string[],
    module_path: string,
    zip_file_name: string,
    result_path: string,
  ): Promise<void>;
}
