import querystring from 'querystring';
import { curly, CurlyFunction } from 'node-libcurl';
import path from 'path';
import { tjmsPath } from '@config/upload';
// import { formatChronologicalList } from '@modules/tjs/utils/formatTJRSProcess';
// import { headerListRS } from '@modules/tjs/utils/csvHeadersTJMG';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import { replaceStringForHTMLaccentuation } from '@modules/tjs/utils/replaceStringForHTMLaccentuation';
import { ITJMSList } from '@modules/tjs/dtos/ITJMSProcess';
// import { headerListMS } from '@modules/tjs/utils/csvHeadersTjMS';
import PDFParser from 'pdf2json';
import { writeApplicationLogError } from '@shared/utils/writeApplicationLogError';
import { headerListMS } from '@modules/tjs/utils/csvHeadersTJMS';
import { ITjmsProvider } from '../models/ITjmsProvider';

export class TjmsProvider implements ITjmsProvider {
  private curl: CurlyFunction;

  private cookiesPath: string;

  constructor() {
    this.cookiesPath = path.resolve(tjmsPath, 'cookies', 'cookiefile_tjmg_pje');

    this.curl =
      process.env.NODE_ENV === 'prod'
        ? curly.create()
        : curly.create({ SSL_VERIFYPEER: false });
  }

  // Lista cronologica

  async searchByChronologicalList(): Promise<void> {
    const page = await this.curl.get(
      'https://www.tjms.jus.br/sapre/publico/classificacao.xhtml',
      {
        HTTPHEADER: [
          'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:94.0) Gecko/20100101 Firefox/94.0',
        ],
        COOKIEJAR: this.cookiesPath,
        COOKIEFILE: this.cookiesPath,
      },
    );

    const [, getViewstate] = page.data
      .toString()
      .split(`j_id1:javax.faces.ViewState:0" value="`);
    const [viewState] = getViewstate.split(`"`);
    const [, getLink] = page.data.toString().split(`id="formPesquisa"`);
    const [link] = getLink.split(`"`);

    console.log(link);

    const processPage = await this.curl.post(
      'https://www.tjms.jus.br/sapre/publico/classificacao.xhtml;jsessionid=dW9D8HLlyuqYKr-2xqa-m7HTBnzsnqbvMjW4bzNX.srv-jee-slave05',
      {
        POSTFIELDS: querystring.stringify({
          'javax.faces.partial.ajax': 'true',
          'javax.faces.source': 'formPesquisa:j_idt21',
          'javax.faces.partial.execute': '@all',
          'javax.faces.partial.render': 'formPesquisa:itens+messages',
          'formPesquisa:j_idt21': 'formPesquisa:j_idt21',
          formPesquisa: 'formPesquisa',
          'formPesquisa:j_idt17_focus': '',
          'formPesquisa:j_idt17_input': 1,
          'formPesquisa:listaResultadoPesquisa:j_idt40:filter': '',
          'formPesquisa:listaResultadoPesquisa:j_idt44:filter': '',
          'formPesquisa:listaResultadoPesquisa:j_idt46:filter': '',
          'formPesquisa:listaResultadoPesquisa:j_idt48:filter': '',
          'formPesquisa:listaResultadoPesquisa:j_idt50:filter': '',
          'formPesquisa:listaResultadoPesquisa:j_idt54:filter': '',
          'formPesquisa:listaResultadoPesquisa:j_idt62:filter': '',
          'javax.faces.ViewState': viewState,
        }),
        HTTPHEADER: [
          'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:94.0) Gecko/20100101 Firefox/94.0',
        ],
        COOKIEFILE: this.cookiesPath,
        COOKIEJAR: this.cookiesPath,
      },
    );

    await fs.promises.writeFile(
      path.resolve(tjmsPath, 'paginaPDFs.html'),
      page.data,
      {
        encoding: 'utf8',
      },
    );
  }

  async search2(filepath: string): Promise<void> {
    try {
      let pdfData = '';
      const pdf_path = path.resolve(filepath);
      const pdfParser = new PDFParser(this, 1);

      if (fs.existsSync(pdf_path)) {
        await new Promise((resolve, reject) => {
          pdfParser.loadPDF(pdf_path);

          pdfParser.on('pdfParser_dataError', errData => reject(errData));

          pdfParser.on('pdfParser_dataReady', () => {
            pdfData = pdfParser.getRawTextContent();

            resolve(pdfData);
          });
        });
      }

      const getData = pdfData.split('\r\n');

      let index = 0;
      for (const data of getData) {
        const process: ITJMSList = {
          NKnowledge1: '',
          NKnowledge2: '',
          NProcess: '',
          county: '',
          year: '',
        };

        console.log(data);

        if (data.match(/\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}/)) {
          const numbers = data.match(
            /\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}/g,
          );

          console.log({ numbers });

          if (numbers.length === 3) {
            process.NKnowledge1 = numbers[0];
            process.NKnowledge2 = numbers[1];
            process.NProcess = numbers[2];
          } else if (numbers.length === 2) {
            const Nprocess = data.match(/\d{4}\.\d{6}-\d{1}/g);
            console.log({ Nprocess });
            process.NKnowledge1 = numbers[0];
            process.NKnowledge2 = numbers[1];
            if (Nprocess !== null) {
              process.NProcess = Nprocess[0];
            }
          } else {
            const Nprocess = data.match(/\d{4}\.\d{6}-\d{1}/g);
            process.NKnowledge1 = numbers[0];
            if (Nprocess !== null) {
              process.NKnowledge2 = Nprocess[0];
              process.NProcess = Nprocess[1];
            } else {
              process.NProcess = numbers[0];
            }
            console.log({ Nprocess });
          }

          if (process.NProcess !== '') {
            const getCountyYear = data.split(process.NProcess);
            const countyYear = getCountyYear[getCountyYear.length - 1];
            const county = countyYear.replace(/\d|\//g, '');
            const [year] = countyYear.match(/\d{4}/);

            process.county = county;
            process.year = year;
          }
          const csvWriter =
            index > 0
              ? createObjectCsvWriter({
                  path: path.resolve(tjmsPath, 'uploads', 'lista.csv'),
                  header: headerListMS,
                  fieldDelimiter: ';',
                  encoding: 'latin1',
                  append: true,
                })
              : createObjectCsvWriter({
                  path: path.resolve(tjmsPath, 'uploads', 'lista.csv'),
                  header: headerListMS,
                  fieldDelimiter: ';',
                  encoding: 'latin1',
                });

          await csvWriter.writeRecords([process]);
          index++;
        } else if (data.match(/\d{3}\.\d{2}\.\d{6}-\d{1}/)) {
          const numbers = data.match(/\d{3}\.\d{2}\.\d{6}-\d{1}/g);

          const Nprocess = data.match(/\d{4}\.\d{6}-\d{1}/g);

          console.log({ numbers, Nprocess });

          if (Nprocess !== null) {
            process.NKnowledge1 = numbers[0];
            if (numbers[1] && Nprocess !== null) {
              process.NKnowledge2 = numbers[1];
              process.NProcess = Nprocess[0];
            } else if (Nprocess.length === 2 && Nprocess !== null) {
              process.NKnowledge2 = Nprocess[0];
              process.NProcess = Nprocess[1];
            } else if (Nprocess.length === 1 && Nprocess !== null) {
              process.NProcess = Nprocess[0];
            }
          }

          if (process.NProcess !== '') {
            const getCountyYear = data.split(process.NProcess);
            const countyYear = getCountyYear[getCountyYear.length - 1];
            const county = countyYear.replace(/\d|\//g, '');
            const [year] = countyYear.match(/\d{4}/);

            process.county = county;
            process.year = year;
          }
          const csvWriter =
            index > 0
              ? createObjectCsvWriter({
                  path: path.resolve(tjmsPath, 'uploads', 'lista.csv'),
                  header: headerListMS,
                  fieldDelimiter: ';',
                  encoding: 'latin1',
                  append: true,
                })
              : createObjectCsvWriter({
                  path: path.resolve(tjmsPath, 'uploads', 'lista.csv'),
                  header: headerListMS,
                  fieldDelimiter: ';',
                  encoding: 'latin1',
                });

          await csvWriter.writeRecords([process]);
          index++;
        }
      }
    } catch (error) {
      writeApplicationLogError(
        `readingPDF - Unable to process case number ${error.message}`,
        error.statusCode,
        'TJMS',
      );
    }
  }

  async search(filepath: string): Promise<void> {
    console.log(filepath);
  }
}
