import querystring from 'querystring';
import { curly, CurlyFunction } from 'node-libcurl';
import path from 'path';
import iconv from 'iconv-lite';
import { tjmaPath } from '@config/upload';
import { ITJMAList } from '@modules/tjs/dtos/ITJMAProcess';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import PDFParser from 'pdf2json';
import LeadsAppError from '@shared/errors/LeadsAppError';
import { headerListMA } from '@modules/tjs/utils/csvHeadersTJMA';
import { COPYFILE_FICLONE, COPYFILE_FICLONE_FORCE } from 'constants';
import { ITjmaProvider } from '../models/ITjmaProvider';

export class TjmaProvider implements ITjmaProvider {
  private curl: CurlyFunction;

  private cookiesPath: string;

  constructor() {
    this.cookiesPath = path.resolve(tjmaPath, 'cookies', 'cookiefile_tjma_pje');

    this.curl =
      process.env.NODE_ENV === 'prod'
        ? curly.create()
        : curly.create({ SSL_VERIFYPEER: false });
  }

  async searchByChronologicalListEntity(): Promise<void> {
    const linksSearch = [
      'http://www.tjma.jus.br/midia/prec/pagina/hotsite/500753',
      'http://www.tjma.jus.br/midia/prec/pagina/hotsite/500708',
      'http://www.tjma.jus.br/midia/prec/pagina/hotsite/500720',
    ];

    let index = 1;
    for (const link of linksSearch) {
      const pageInitial = await this.curl.get(link, {
        COOKIEJAR: this.cookiesPath,
        COOKIEFILE: this.cookiesPath,
      });

      const [, getLink] = pageInitial.data
        .toString()
        .split(`ATUALIZADAS: </strong>`);
      const [, getHref] = getLink.split(`href="`);
      const [linkPDF] = getHref.split(`"`);

      const pagepdf = await this.curl.get(linkPDF, {
        COOKIEJAR: this.cookiesPath,
        COOKIEFILE: this.cookiesPath,
      });

      await fs.promises.writeFile(
        path.resolve(tjmaPath, '2paginaPDFs.pdf'),
        pagepdf.data,
        {
          encoding: 'utf8',
        },
      );

      const data = await this.readPdf(
        path.resolve(tjmaPath, '2paginaPDFs.pdf'),
      );

      const lines = data.split(`\n`);

      let id = 0;
      for (const line of lines) {
        const today = new Date();
        const currentDate = `${today.getDate()}-${
          today.getMonth() + 1
        }-${today.getFullYear()}-`;
        let nameCSV = `${currentDate}${index}.csv`;
        if (index > 2) {
          if (
            line.includes('MUNICÍPIO') ||
            line.includes('ESTADO') ||
            line.includes('INSTITUTO') ||
            line.includes('Sistema')
          ) {
            let name = line.replace(/\r/, '');
            name = name.replace(/\\/, '');

            const nameCSV2 = `${currentDate}${name}.csv`;

            fs.copyFileSync(
              path.resolve(tjmaPath, 'uploadsIndex', `${nameCSV}`),
              path.resolve(tjmaPath, 'uploads', `${nameCSV2}`),
              COPYFILE_FICLONE,
            );
            id = 0;
            index++;
          }
        }

        if (line.match(/\d{7}-\d{2}\.\d{4}.\d.\d{2}\.\d{4}/)) {
          const [order] = line.match(/\d{5}/);
          const [nPrecatory] = line.match(/\d{7}-\d{2}\.\d{4}.\d.\d{2}\.\d{4}/);

          let nature = '';
          let budget = '';
          let receivement = '';
          let priority = '';
          let value = '';

          if (line.match(/\d{2}\/\d{2}\/\d{4}/)) {
            [receivement] = line.match(/\d{2}\/\d{2}\/\d{4}/);
            const [, getnature] = line.split(nPrecatory);
            const [natuOrça] = getnature.split(receivement);
            [nature] = natuOrça.match(/\D*/g);
            [budget] = natuOrça.match(/\d{4}/g);
            const [, , year] = receivement.split(`/`);
            [, value] = line.split(`/${year}`);
            [priority] = value.match(/\D*/g);
            if (priority) {
              [, value] = value.split(priority);
            }
            value = value.replace(/\r/, '');
          } else {
            const [, getnature] = line.split(nPrecatory);
            if (getnature.match(/\d/)) {
              [nature] = getnature.match(/[A-Za-z]*/g);
              const [, getBudget] = line.split(nature);
              [budget] = getnature.match(/\d{4}/);

              [, value] = line.split(budget);
            } else {
              nature = getnature;
            }
          }

          const process: ITJMAList = {
            order,
            nPrecatory,
            nature,
            budget,
            receivement,
            priority,
            value,
          };

          let dir = path.resolve(tjmaPath, 'uploadsIndex', `${nameCSV}`);
          if (index < 3) {
            nameCSV =
              index === 1
                ? `${currentDate}MunicipioDeSaoLuis.csv`
                : `${currentDate}EstadoDoMaranhao.csv`;
            dir = path.resolve(tjmaPath, 'uploads', `${nameCSV}`);
          }

          const csvWriter =
            id > 0
              ? createObjectCsvWriter({
                  path: dir,
                  header: headerListMA,
                  fieldDelimiter: ';',
                  encoding: 'latin1',
                  append: true,
                })
              : createObjectCsvWriter({
                  path: dir,
                  header: headerListMA,
                  fieldDelimiter: ';',
                  encoding: 'latin1',
                });

          await csvWriter.writeRecords([process]);
          id++;
        }
      }
      index++;
    }

    // const pagePDFFormatted = iconv.decode(pageInput.data, 'ISO-8859-1');

    /*
    const today = new Date();
    const currentDate = `${today.getDate()}-${
      today.getMonth() + 1
    }-${today.getFullYear()}-`;
    const nameCSV = `${currentDate}${search.input.replace('/', '-')}.csv`;

    const csvWriter =
      id > 0
        ? createObjectCsvWriter({
            path: path.resolve(tjmgPath, 'entity', `${nameCSV}`),
            header: headerListMG,
            fieldDelimiter: ';',
            encoding: 'latin1',
            append: true,
          })
        : createObjectCsvWriter({
            path: path.resolve(tjmgPath, 'entity', `${nameCSV}`),
            header: headerListMG,
            fieldDelimiter: ';',
            encoding: 'latin1',
          });

    await csvWriter.writeRecords([processSave]);

    */
  }

  async readPdf(pdf_path: string): Promise<string> {
    const pdfParser = new PDFParser(this, 1);

    let pdfData = '';

    await new Promise((resolve, reject) => {
      pdfParser.loadPDF(pdf_path);

      pdfParser.on('pdfParser_dataError', errData =>
        reject(errData.parserError),
      );

      pdfParser.on('pdfParser_dataReady', () => {
        pdfData = pdfParser.getRawTextContent();

        resolve(pdfData);
      });
    });

    if (!pdfData) {
      throw new LeadsAppError(`Não foi possível ler o pdf.`, 400, 'TJMA');
    }

    return pdfData;
  }
}
