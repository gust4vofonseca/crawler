import querystring from 'querystring';
import { curly, CurlyFunction } from 'node-libcurl';
import path from 'path';
import { tjroPath, tjrsPath } from '@config/upload';
// import { formatChronologicalList } from '@modules/tjs/utils/formatTJRSProcess';
// import { headerListRS } from '@modules/tjs/utils/csvHeadersTJMG';
import { createObjectCsvWriter } from 'csv-writer';
// import fs from 'fs';
import { ITJROList } from '@modules/tjs/dtos/ITJROProcess';
import { headerListRO } from '@modules/tjs/utils/csvHeadersTJRO';
import fs from 'fs';
import { ITjroProvider } from '../models/ITjroProvider';

export class TjroProvider implements ITjroProvider {
  private curl: CurlyFunction;

  private cookiesPath: string;

  constructor() {
    this.cookiesPath = path.resolve(tjrsPath, 'cookies', 'cookiefile_tjmg_pje');

    this.curl =
      process.env.NODE_ENV === 'prod'
        ? curly.create()
        : curly.create({ SSL_VERIFYPEER: false });
  }

  // Lista cronologica

  async searchByChronologicalList(): Promise<void> {
    const pageInitial = await this.curl.get(
      'https://webapp.tjro.jus.br/apprec/pages/consultadevedor.xhtml',
      {
        HTTPHEADER: [
          'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:94.0) Gecko/20100101 Firefox/94.0',
        ],
        COOKIEJAR: this.cookiesPath,
        COOKIEFILE: this.cookiesPath,
      },
    );

    const [, getEntities] = pageInitial.data
      .toString()
      .split(`id="frmStatus:j_idt41_title"`);
    const [dataEntities] = getEntities.split(`</select>`);

    const getSearchEntities = dataEntities.split(`<option value="`);

    const dataSearchEntities = [];
    for (const searchEntities of getSearchEntities) {
      if (searchEntities.includes(`</option>`)) {
        const [numberSearch] = searchEntities.split(`"`);
        const [, getNameSearch] = searchEntities.split(`>`);
        const [nameSearch] = getNameSearch.split(`<`);
        dataSearchEntities.push({ numberSearch, nameSearch });
      }
    }
    let [, getViewState] = pageInitial.data
      .toString()
      .split(`id="j_id1:javax.faces.ViewState:2" value="`);
    let [viewSate] = getViewState.split(`"`);

    for (const searchEntities of dataSearchEntities) {
      if (searchEntities.numberSearch !== '0') {
        console.log(searchEntities.nameSearch);
        const nameCSV = `${searchEntities.nameSearch.replace('/', '-')}.csv`;
        const data = await this.curl.post(
          'https://webapp.tjro.jus.br/apprec/pages/consultadevedor.xhtml',
          {
            POSTFIELDS: querystring.stringify({
              frm: 'frm',
              'frm:idD_focus': '',
              'frm:idD_input': searchEntities.numberSearch,
              'frm:sRtipo': 3,
              'frm:idLstSituacao_focus': '',
              'frm:idLstSituacao_input': 'G',
              'javax.faces.ViewState': viewSate,
              'frm:btnconsultar': 'frm:btnconsultar',
            }),
            HTTPHEADER: [
              'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:94.0) Gecko/20100101 Firefox/94.0',
            ],
            COOKIEJAR: this.cookiesPath,
            COOKIEFILE: this.cookiesPath,
          },
        );

        [, getViewState] = data.data
          .toString()
          .split(`id="j_id1:javax.faces.ViewState:2" value="`);
        [viewSate] = getViewState.split(`"`);

        // 2000 de resultados
        const data2 = await this.curl.post(
          'https://webapp.tjro.jus.br/apprec/pages/consultadevedor.xhtml',
          {
            POSTFIELDS: querystring.stringify({
              'javax.faces.partial.ajax': 'true',
              'javax.faces.source': 'frm:dtbLista',
              'javax.faces.partial.execute': 'frm:dtbLista',
              'javax.faces.partial.render': 'frm:dtbLista',
              'frm:dtbLista': 'frm:dtbLista',
              'frm:dtbLista_pagination': 'true',
              'frm:dtbLista_first': 0,
              'frm:dtbLista_rows': 2000,
              'frm:dtbLista_skipChildren': 'true',
              'frm:dtbLista_encodeFeature': 'true',
              frm: 'frm',
              'frm:idD_focus': '',
              'frm:idD_input': searchEntities.numberSearch,
              'frm:sRtipo': 3,
              'frm:dtbLista:j_idt69:filter': '',
              'frm:dtbLista:j_idt71:filter': '',
              'frm:dtbLista:j_idt73:filter': '',
              'frm:dtbLista:j_idt75:filter': '',
              'frm:dtbLista:j_idt78_focus': '',
              'frm:dtbLista:j_idt87_focus': '',
              'frm:dtbLista:j_idt95_focus': '',
              'frm:dtbLista:j_idt106:filter': '',
              'frm:dtbLista_rppDD': 2000,
              'javax.faces.ViewState': viewSate,
            }),
            HTTPHEADER: [
              'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:94.0) Gecko/20100101 Firefox/94.0',
            ],
            COOKIEJAR: this.cookiesPath,
            COOKIEFILE: this.cookiesPath,
          },
        );

        [, getViewState] = data2.data
          .toString()
          .split(`id="j_id1:javax.faces.ViewState:0"><![CDATA[`);
        [viewSate] = getViewState.split(`]]`);

        // quantidade de paginas
        const data3 = await this.curl.post(
          'https://webapp.tjro.jus.br/apprec/pages/consultadevedor.xhtml',
          {
            POSTFIELDS: querystring.stringify({
              frm: 'frm',
              'frm:idD_focus': '',
              'frm:idD_input': searchEntities.numberSearch,
              'frm:sRtipo': 3,
              'frm:dtbLista:j_idt69:filter': '',
              'frm:dtbLista:j_idt71:filter': '',
              'frm:dtbLista:j_idt73:filter': '',
              'frm:dtbLista:j_idt75:filter': '',
              'frm:dtbLista:j_idt78_focus': '',
              'frm:dtbLista:j_idt87_focus': '',
              'frm:dtbLista:j_idt95_focus': '',
              'frm:dtbLista:j_idt106:filter': '',
              'frm:dtbLista_rppDD': 2000,
              'javax.faces.ViewState': viewSate,
              'frm:btnconsultar': 'frm:btnconsultar',
            }),
            HTTPHEADER: [
              'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:94.0) Gecko/20100101 Firefox/94.0',
            ],
            COOKIEJAR: this.cookiesPath,
            COOKIEFILE: this.cookiesPath,
          },
        );

        let getNumberPages = 0;
        if (data3.data.toString().includes(`"ui-paginator-current">(1 of`)) {
          const [, getPages] = data3.data
            .toString()
            .split(`"ui-paginator-current">(1 of`);
          [getNumberPages] = getPages.split(`)`);
        }
        const numberPages = Number(getNumberPages);

        [, getViewState] = data3.data
          .toString()
          .split(`id="j_id1:javax.faces.ViewState:2" value="`);
        [viewSate] = getViewState.split(`"`);

        let index = 0;
        for (let numberPage = 0; numberPage < numberPages; numberPage++) {
          const data4 = await this.curl.post(
            'https://webapp.tjro.jus.br/apprec/pages/consultadevedor.xhtml',
            {
              POSTFIELDS: querystring.stringify({
                'javax.faces.partial.ajax': 'true',
                'javax.faces.source': 'frm:dtbLista',
                'javax.faces.partial.execute': 'frm:dtbLista',
                'javax.faces.partial.render': 'frm:dtbLista',
                'frm:dtbLista': 'frm:dtbLista',
                'frm:dtbLista_pagination': 'true',
                'frm:dtbLista_first': numberPage * 2000,
                'frm:dtbLista_rows': 2000,
                'frm:dtbLista_skipChildren': 'true',
                'frm:dtbLista_encodeFeature': 'true',
                frm: 'frm',
                'frm:idD_focus': '',
                'frm:idD_input': searchEntities.numberSearch,
                'frm:sRtipo': 3,
                'frm:dtbLista:j_idt69:filter': '',
                'frm:dtbLista:j_idt71:filter': '',
                'frm:dtbLista:j_idt73:filter': '',
                'frm:dtbLista:j_idt75:filter': '',
                'frm:dtbLista:j_idt78_focus': '',
                'frm:dtbLista:j_idt87_focus': '',
                'frm:dtbLista:j_idt95_focus': '',
                'frm:dtbLista:j_idt106:filter': '',
                'frm:dtbLista_rppDD': 2000,
                'javax.faces.ViewState': viewSate,
              }),
              HTTPHEADER: [
                'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:94.0) Gecko/20100101 Firefox/94.0',
              ],
              COOKIEJAR: this.cookiesPath,
              COOKIEFILE: this.cookiesPath,
            },
          );

          [, getViewState] = data4.data
            .toString()
            .split(`id="j_id1:javax.faces.ViewState:0"><![CDATA[`);
          [viewSate] = getViewState.split(`]]`);

          const [, getDataLawSuit] = data4.data
            .toString()
            .split(`id="frm:dtbLista"><![CDATA[`);
          const [dataLawSuit] = getDataLawSuit.split(`]]`);

          const lawSuit = dataLawSuit.split(`role="row">`);

          for (const process of lawSuit) {
            if (process.includes(`role="gridcell">`)) {
              const pageData = process.split(`role="gridcell">`);
              const [position] = pageData[2].split(`<`);
              const [budget] = pageData[3].split(`<`);
              const [NProcess] = pageData[4].split(`<`);
              const [nature] = pageData[5].split(`<`);
              const [date] = pageData[6].split(`<`);
              const [priority] = pageData[7].split(`<`);
              const [situation] = pageData[8].split(`<`);
              const [payer] = pageData[9].split(`<`);
              const [value] = pageData[10].split(`<`);

              const processData: ITJROList = {
                position,
                budget,
                NProcess,
                nature,
                date,
                priority,
                situation,
                payer,
                value,
              };

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
              index++;
            }
          }
        }
      }
    }
  }
}

/* await fs.promises.writeFile(
      path.resolve(tjroPath, 'paginaPDFs.html'),
      page.data,
      {
        encoding: 'utf8',
      },
    ); */
