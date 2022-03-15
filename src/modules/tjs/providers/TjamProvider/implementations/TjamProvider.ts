import querystring from 'querystring';
import { curly, CurlyFunction } from 'node-libcurl';
import path from 'path';
import { tjamPath } from '@config/upload';
// import { formatChronologicalList } from '@modules/tjs/utils/formatTJRSProcess';
// import { headerListRS } from '@modules/tjs/utils/csvHeadersTJMG';
import { createObjectCsvWriter } from 'csv-writer';
// import fs from 'fs';
// import { ITJAPList } from '@modules/tjs/dtos/ITJAPProcess';
import { headerListAM } from '@modules/tjs/utils/csvHeadersTJAM';
import fs from 'fs';
import PDFParser from 'pdf2json';
import LeadsAppError from '@shared/errors/LeadsAppError';
import Tesseract from 'tesseract.js';
import { replaceStringForHTMLaccentuation } from '@modules/tjs/utils/replaceStringForHTMLaccentuation';
import iconv from 'iconv-lite';
import ocr from 'ocr';
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
    /*     const data = await this.curl.get(
      'https://www.tjam.jus.br/index.php/precatorio-principal',
      {
        COOKIEJAR: this.cookiesPath,
        COOKIEFILE: this.cookiesPath,
      },
    );

    const [, getHtml] = data.data
      .toString()
      .split(`Listagem em ordem cronológica`);

    const getHref = getHtml.split(``).reverse().join('');
    const [getHref2] = getHref.split(`"=ferh`);
    const [href] = getHref2.split('').reverse().join('').split('"');

    const pdf = await this.curl.get(`https://www.tjam.jus.br${href}/file`, {
      COOKIEJAR: this.cookiesPath,
      COOKIEFILE: this.cookiesPath,
    });

    await fs.promises.writeFile(
      path.resolve(tjamPath, 'paginaPDFs.pdf'),
      pdf.data,
      {
        encoding: 'utf8',
      },
    ); */
    // await this.readImage('etste');
    /*
    const dataPdf = await this.readPdf(path.resolve(tjamPath, 'pdfAM.pdf'));

    const lines = dataPdf.split(`\n`);

    let index = 0;
    let name = '';
    for (let i = 0; i < 300; i++) {
      console.log(lines[i]);
      if (lines[i].includes(`cronológica`)) {
        [, name] = lines[i].split(`cronológica`);
        name = name.replace(/ /, '');
        name = name.replace(/\\/, '');
        console.log(name);
        // index = 0;
      }

      if (lines[i].match(/\d{7}-\d{2}.\d{4}.\d{1}.\d{2}.\d{4}/)) {
        const [NCnj] = lines[i].match(/\d{7}-\d{2}.\d{4}.\d{1}.\d{2}.\d{4}/);

        const [order] = lines[i].split(NCnj);

        let date = '';
        if (lines[i].match(/\d{2}\/\d{2}\/\d{2}/)) {
          [date] = lines[i].match(/\d{2}\/\d{2}\/\d{2}/);
        }

        let nature = '';
        if (lines[i].match(/Alimentícia|Comum/g)) {
          [nature] = lines[i].match(/Alimentícia|Comum/g);
        }

        const [, situation] = lines[i].split(nature);

        let value = '';
        if (lines[i].includes('R$')) {
          [, value] = lines[i].split(`R$`);
          [value] = value.split(nature);
        }

        const process = {
          NCnj,
          order,
          date,
          value,
          nature,
          situation,
        };

        // const nameCSV = `${name}.csv`;

        const csvWriter =
          index > 0
            ? createObjectCsvWriter({
                path: path.resolve(tjamPath, 'uploads', `teste.csv`),
                header: headerListAM,
                fieldDelimiter: ';',
                encoding: 'latin1',
                append: true,
              })
            : createObjectCsvWriter({
                path: path.resolve(tjamPath, 'uploads', `teste.csv`),
                header: headerListAM,
                fieldDelimiter: ';',
                encoding: 'latin1',
              });

        await csvWriter.writeRecords([process]);

        index++;
      }
    } */
    await this.readImageOcrWeb();
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
      throw new LeadsAppError(`Não foi possível ler o pdf.`, 400, 'TJAM');
    }

    return pdfData;
  }

  async readImage(image: string): Promise<string> {
    try {
      Tesseract.recognize(
        path.resolve(
          tjamPath,
          'uploads',
          'images2',
          'paginaPDFs_page-0001.jpg',
        ),
        'eng',
        {
          logger: m => console.log(m),
        },
      ).then(({ data: { text } }) => {
        console.log(text);
      });

      return 'ljksdfahn';
    } catch (error) {
      throw new LeadsAppError(`ReadImage - Msg: ${error.message}`, 400, 'TJAM');
    }
  }

  async readImageOcrWeb(): Promise<void> {
    try {
      /* const siteOcr = await this.curl.get(`https://www.onlineocr.net/pt/`, {
        COOKIEJAR: this.cookiesPath,
        COOKIEFILE: this.cookiesPath,
      });

      const image = fs.readFileSync(
        path.resolve(
          tjamPath,
          'uploads',
          'images2',
          'paginaPDFs_page-0001.jpg',
        ),
      ); */
      const Ocr = await this.curl.get(
        `http(s)://www.ocrwebservice.com/restservices/processDocument`,
        {
          postFields: querystring.stringify({
            'Content-Type': 'application/json',
            'Content-Length': 'nnn',
            OCRErrorMessage: 'Recognition result has not been specified',
            AvailablePages: 287848,
            ProcessedPages: 0,
            OCRText: [],
            OutputFileUrl: '',
            TaskDescription: '',
            Reserved: [],
          }),
          COOKIEJAR: this.cookiesPath,
          COOKIEFILE: this.cookiesPath,
        },
      );

      ocr.recognize();
    } catch (error) {
      throw new LeadsAppError(
        `readImageOcrWeb - Msg: ${error.message}`,
        400,
        'TJAM',
      );
    }
  }
}
