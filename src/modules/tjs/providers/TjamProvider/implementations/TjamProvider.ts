import querystring from 'querystring';
import { curly, CurlyFunction } from 'node-libcurl';
import path from 'path';
import { tjamPath } from '@config/upload';
// import { formatChronologicalList } from '@modules/tjs/utils/formatTJRSProcess';
// import { headerListRS } from '@modules/tjs/utils/csvHeadersTJMG';
import { createObjectCsvWriter } from 'csv-writer';
// import fs from 'fs';
// import { ITJAPList } from '@modules/tjs/dtos/ITJAPProcess';
// import { headerListAP } from '@modules/tjs/utils/csvHeadersTJAP';
import fs from 'fs';
import { ITjamProvider } from '../models/ITjamProvider';

export class TjamProvider implements ITjamProvider {
  private curl: CurlyFunction;

  private cookiesPath: string;

  constructor() {
    this.cookiesPath = path.resolve(tjamPath, 'cookies', 'cookiefile_tjam_pje');

    this.curl =
      process.env.NODE_ENV === 'prod'
        ? curly.create()
        : curly.create({ SSL_VERIFYPEER: false });
  }

  // Lista cronologica

  async searchByChronologicalList(): Promise<void> {
    const data = await this.curl.get(
      'https://www.tjam.jus.br/index.php/precatorio-principal',
      {
        COOKIEJAR: this.cookiesPath,
        COOKIEFILE: this.cookiesPath,
      },
    );

    console.log(data);

    /*
        await fs.promises.writeFile(
      path.resolve(tjapPath, 'paginaPDFs.html'),
      pageInitial.data,
      {
        encoding: 'utf8',
      },
    );
    const csvWriter =
      index > 0
        ? createObjectCsvWriter({
            path: path.resolve(
              tjroPath,
              'uploads',
              `08-02-22-${nameCSV}`,
            ),
            header: headerListRO,
            fieldDelimiter: ';',
            encoding: 'latin1',
            append: true,
          })
        : createObjectCsvWriter({
            path: path.resolve(
              tjroPath,
              'uploads',
              `08-02-22-${nameCSV}`,
            ),
            header: headerListRO,
            fieldDelimiter: ';',
            encoding: 'latin1',
          });

    await csvWriter.writeRecords([processData]);
    */
  }
}
