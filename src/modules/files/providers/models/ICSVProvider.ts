export interface CSVHeader {
  id: string;
  title: string;
}

export interface ICSVProvider {
  read(
    file_path: string,
    enconding: BufferEncoding,
    separator: string,
  ): Promise<string[]>;
  write(
    process_data: any,
    file_path: string,
    header: CSVHeader[],
    enconding: BufferEncoding,
    count: number,
  ): Promise<void>;
}
