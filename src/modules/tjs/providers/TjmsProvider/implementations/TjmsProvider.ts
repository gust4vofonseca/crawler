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
        COOKIEJAR: this.cookiesPath,
        COOKIEFILE: this.cookiesPath,
      },
    );

    const [, getViewstate] = page.data
      .toString()
      .split(`j_id1:javax.faces.ViewState:0" value="`);
    const [viewState] = getViewstate.split(`"`);

    const processPage = await this.curl.post(
      'https://www.tjms.jus.br/sapre/publico/classificacao.xhtml',
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
        COOKIEFILE: this.cookiesPath,
        COOKIEJAR: this.cookiesPath,
      },
    );

    await fs.promises.writeFile(
      path.resolve(tjmsPath, 'paginaPDFs.html'),
      processPage.data,
      {
        encoding: 'utf8',
      },
    );
  }

  async search2(): Promise<void> {
    try {
      let pdfData = '';
      const pdf_path = path.resolve(tjmsPath, 'teste.txt');
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

      console.log(pdfData);
    } catch (error) {
      writeApplicationLogError(
        `readingPDF - Unable to process case number ${error.message}`,
        error.statusCode,
        'TJMS',
      );
    }
  }

  async search(number: string, id: number): Promise<void> {
    const [process] = number.split('/');

    const verificate = process.replace(/\D/g, '');

    if (verificate.length > 10 && !isNaN(Number(verificate))) {
      const NProcess = { process };

      const csvWriter =
        id > 0
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

      await csvWriter.writeRecords([NProcess]);
    }
  }
}
