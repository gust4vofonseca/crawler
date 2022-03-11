import querystring from 'querystring';
import { curly, CurlyFunction } from 'node-libcurl';
import path from 'path';
import { tjrrPath } from '@config/upload';
// import { formatChronologicalList } from '@modules/tjs/utils/formatTJRSProcess';
// import { headerListRS } from '@modules/tjs/utils/csvHeadersTJMG';
import { createObjectCsvWriter } from 'csv-writer';
// import fs from 'fs';
import { replaceStringForHTMLaccentuation } from '@modules/tjs/utils/replaceStringForHTMLaccentuation';
import { ITJRRList } from '@modules/tjs/dtos/ITJRRProcess';
import { headerListRR } from '@modules/tjs/utils/csvHeadersTjRR';
import fs from 'fs';
import PDFParser from 'pdf2json';
import LeadsAppError from '@shared/errors/LeadsAppError';
import { ITjrrProvider } from '../models/ITjrrProvider';

export class TjrrProvider implements ITjrrProvider {
  private curl: CurlyFunction;

  private cookiesPath: string;

  constructor() {
    this.cookiesPath = path.resolve(tjrrPath, 'cookies', 'cookiefile_tjrr_pje');

    this.curl =
      process.env.NODE_ENV === 'prod'
        ? curly.create()
        : curly.create({ SSL_VERIFYPEER: false });
  }

  // Lista cronologica

  async searchByChronologicalList(): Promise<void> {
    const teste = await this.curl.get(
      'https://transparencia.tjrr.jus.br/index.php?option=com_dropfiles&format=&task=frontfile.download&catid=6237&id=1RXPlBcI-LOYtxJl3QyUfsJSdJE322sMR&Itemid=1000000000000',
      {
        COOKIEJAR: this.cookiesPath,
        COOKIEFILE: this.cookiesPath,
      },
    );

    await fs.promises.writeFile(
      path.resolve(tjrrPath, 'paginaPDFs.pdf'),
      teste.data,
      {
        encoding: 'utf8',
      },
    );

    const dataPdf = await this.readPdf(
      path.resolve(tjrrPath, 'paginaPDFs.pdf'),
    );

    const lines = dataPdf.split(`\n`);

    let id = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(`º`)) {
        let data = '';
        if (lines[i].match(/\d{7}-\d{2}.\d{4}.\d{1}.\d{2}.\d{4}/)) {
          data = lines[i];
        } else if (lines[i + 1].match(/\d{7}-\d{2}.\d{4}.\d{1}.\d{2}.\d{4}/)) {
          data = `${lines[i]} ${lines[i + 1]}`;
        }

        if (data !== '') {
          console.log(data);
          const [order, getData] = data.split(`º`);

          const [year] = getData.match(/\d{4}/);

          const [date] = data.match(/\d{2}\/\d{2}\/\d{4}/);

          const [Ncnj1] = data.match(/\d{7}-\d{2}.\d{4}.\d{1}.\d{2}.\d{4}/);

          const [, getNCnj2] = data.split(Ncnj1);

          let [Ncnj2] = '';
          if (getNCnj2.match(/\d{7}-\d{2}.\d{4}.\d{1}.\d{2}.\d{4}/)) {
            [Ncnj2] = getNCnj2.match(/\d{7}-\d{2}.\d{4}.\d{1}.\d{2}.\d{4}/);
          } else if (getNCnj2.includes(`R$`)) {
            [Ncnj2] = getNCnj2.split(`R$`);
          } else if (getNCnj2) {
            Ncnj2 = getNCnj2;
          } else {
            Ncnj2 = Ncnj1;
          }

          const [nature] = data.match(
            /Alimentar|Comum|preferencial|Alterado para comum/,
          );

          let [, value] = data.split(Ncnj2);
          if (Ncnj2.match(/QUITADO/)) {
            [value] = Ncnj2.match(/QUITADO/);
            Ncnj2.replace('QUITADO', '');
          }

          value = value.replace(/\r/, '');

          let nPrecatory = '';

          const [getNumber] = data.split(Ncnj1);

          if (getNumber.match(/\d{4}\/\d{6}/)) {
            [nPrecatory] = getNumber.match(/\d{4}\/\d{6}/);
          } else if (getNumber.match(/\d{3}\/\d{4}/)) {
            if (getNumber.match(/\d{2}:\d{2}:\d{2}/)) {
              const [li] = getNumber.match(/\d{2}:\d{2}:\d{2}/);
              [, nPrecatory] = getNumber.split(li);
            } else {
              [, nPrecatory] = getNumber.split(date);
            }
          } else if (getNumber.match(/\d{4}\/\d{3}/)) {
            [nPrecatory] = getNumber.match(/\d{4}\/\d{3}/);
          }

          const process: ITJRRList = {
            order,
            year,
            date,
            Ncnj1,
            Ncnj2,
            nature,
            value,
            nPrecatory,
          };

          const dir = path.resolve(tjrrPath, 'uploads', 'listaRR.csv');

          const csvWriter =
            id > 0
              ? createObjectCsvWriter({
                  path: dir,
                  header: headerListRR,
                  fieldDelimiter: ';',
                  encoding: 'latin1',
                  append: true,
                })
              : createObjectCsvWriter({
                  path: dir,
                  header: headerListRR,
                  fieldDelimiter: ';',
                  encoding: 'latin1',
                });

          await csvWriter.writeRecords([process]);
          id++;
        }
      }
    }
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
