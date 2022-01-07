import fs from 'fs';
import csvParser from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import { CSVHeader, ICSVProvider } from '../models/ICSVProvider';

export class CSVProvider implements ICSVProvider {
  async read(
    file_path: string,
    encoding: BufferEncoding,
    separator: string,
  ): Promise<string[]> {
    const csvData = fs
      .createReadStream(file_path, { encoding })
      .pipe(csvParser({ separator }));

    const processNumbers: string[] = [];
    for await (const record of csvData) {
      processNumbers.push(record['Numero do processo']);
    }

    return processNumbers;
  }

  async write(
    process_data: any,
    file_path: string,
    header: CSVHeader[],
    encoding: BufferEncoding,
    count: number,
  ): Promise<void> {
    const csvWriter =
      count > 0
        ? createObjectCsvWriter({
            path: file_path,
            header,
            fieldDelimiter: ';',
            encoding,
            append: true,
          })
        : createObjectCsvWriter({
            path: file_path,
            header,
            fieldDelimiter: ';',
            encoding,
          });

    await csvWriter.writeRecords([process_data]);
  }
}
