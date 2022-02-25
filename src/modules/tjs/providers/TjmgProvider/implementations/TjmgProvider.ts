import querystring from 'querystring';
import { curly, CurlyFunction } from 'node-libcurl';
import path from 'path';
import iconv from 'iconv-lite';
import { tjmgPath } from '@config/upload';
import { ISearchMG, ITJMGList } from '@modules/tjs/dtos/ITJMGProcess';
import {
  formatChronologicalList,
  formatChronologicalList2,
} from '@modules/tjs/utils/formatTJMGProcess';
import { headerListMG } from '@modules/tjs/utils/csvHeadersTJMG';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import { ITjmgProvider } from '../models/ITjmgProvider';

export class TjmgProvider implements ITjmgProvider {
  private curl: CurlyFunction;

  private cookiesPath: string;

  constructor() {
    this.cookiesPath = path.resolve(tjmgPath, 'cookies', 'cookiefile_tjmg_pje');

    this.curl =
      process.env.NODE_ENV === 'prod'
        ? curly.create()
        : curly.create({ SSL_VERIFYPEER: false });
  }

  async searchByChronologicalListEntity(): Promise<void> {
    const pageInitial = await this.curl.get(
      'http://www8.tjmg.jus.br/juridico/pe/consultaPorEntidadeDevedora.jsf',
      {
        COOKIEJAR: this.cookiesPath,
        COOKIEFILE: this.cookiesPath,
      },
    );

    const [, getViewState] = iconv
      .decode(pageInitial.data, 'ISO-8859-1')
      .split('name="javax.faces.ViewState" id="javax.faces.ViewState" value="');
    const [viewState] = getViewState.split('"');

    const pageInput = await this.curl.post(
      'http://www8.tjmg.jus.br/juridico/pe/consultaPorEntidadeDevedora.jsf',
      {
        POSTFIELDS: querystring.stringify({
          'javax.faces.partial.ajax': 'true',
          'javax.faces.source': 'entidade_devedora',
          'javax.faces.partial.execute': 'entidade_devedora',
          'javax.faces.partial.render': 'entidade_devedora',
          entidade_devedora: 'entidade_devedora',
          entidade_devedora_query: '',
          frm_pesquisa: 'frm_pesquisa',
          'javax.faces.ViewState': viewState,
          entidade_devedora_input: '',
          entidade_devedora_hinput: '',
          ocultaFechados_input: '1',
          ocultaFechados_focus: '',
          numero_precatorio: '',
          tipo_precatorio_input: '-1',
          tipo_precatorio_focus: '',
          anoInicio: '',
          anoFim: '',
          numeroProcessoExecucao: '',
          numeroSEI: '',
          nomeBeneficiario: '',
        }),
        COOKIEJAR: this.cookiesPath,
        COOKIEFILE: this.cookiesPath,
      },
    );

    const pagePDFFormatted = iconv.decode(pageInput.data, 'ISO-8859-1');

    const debtors = pagePDFFormatted.split(
      '<li class="ui-autocomplete-item ui-autocomplete-list-item ui-corner-all" ',
    );

    const searchs: Array<ISearchMG> = [];

    if (debtors !== null) {
      for (const debtor of debtors) {
        if (debtor.includes('data-item-value')) {
          const [, getHinput] = debtor.split('data-item-value="');
          const [hinput] = getHinput.split('"');

          const [, getInput] = debtor.split('data-item-label="');
          let [input] = getInput.split('"');
          input = input.replace(/ /g, '+');

          searchs.push({ input, hinput });
        }
      }
    }

    let init = 0;
    for (const search of searchs) {
      console.log(search.input);
      const pageChronologicalList = await this.curl.post(
        'http://www8.tjmg.jus.br/juridico/pe/consultaPorEntidadeDevedora.jsf',
        {
          POSTFIELDS: querystring.stringify({
            'javax.faces.partial.ajax': 'true',
            'javax.faces.source': 'consulta2',
            'javax.faces.partial.execute': '@all',
            'javax.faces.partial.render': 'frm_pesquisa',
            consulta2: 'consulta2',
            frm_pesquisa: 'frm_pesquisa',
            'javax.faces.ViewState': viewState,
            entidade_devedora_input: search.input,
            entidade_devedora_hinput: search.hinput,
            ocultaFechados_input: '1',
            ocultaFechados_focus: '',
            numero_precatorio: '',
            tipo_precatorio_input: '-1',
            tipo_precatorio_focus: '',
            anoInicio: '',
            anoFim: '',
            numeroProcessoExecucao: '',
            numeroSEI: '',
            nomeBeneficiario: '',
          }),
          COOKIEJAR: this.cookiesPath,
          COOKIEFILE: this.cookiesPath,
        },
      );

      const page = iconv.decode(pageChronologicalList.data, 'ISO-8859-1');

      let totalCourtOrders = '0';
      if (page.includes(`Total de `)) {
        const [, getTotalCourtOrders] = page.split(`Total de `);
        [totalCourtOrders] = getTotalCourtOrders.split(' precatórios.');
      }

      let pageIndex = 0;
      for (let id = 0; id < Number(totalCourtOrders); id++) {
        // Mudar de pagina
        if (id / 15 === pageIndex || id === 0) {
          const pageI = pageIndex * 15;
          await this.curl.post(
            'http://www8.tjmg.jus.br/juridico/pe/consultaPorEntidadeDevedora.jsf',
            {
              POSTFIELDS: querystring.stringify({
                'javax.faces.partial.ajax': 'true',
                'javax.faces.source': 'resultado',
                'javax.faces.partial.execute': 'resultado',
                'javax.faces.partial.render': 'resultado',
                resultado: 'resultado',
                resultado_pagination: 'true',
                resultado_first: `${pageI}`,
                resultado_rows: '15',
                resultado_encodeFeature: 'true',
                frm_pesquisa: 'frm_pesquisa',
                entidade_devedora_input: search.input,
                entidade_devedora_hinput: search.hinput,
                ocultaFechados_input: '1',
                ocultaFechados_focus: '',
                numero_precatorio: '',
                tipo_precatorio_input: '-1',
                tipo_precatorio_focus: '',
                anoInicio: '',
                anoFim: '',
                numeroProcessoExecucao: '',
                numeroSEI: '',
                nomeBeneficiario: '',
                'javax.faces.ViewState': viewState,
              }),
              COOKIEJAR: this.cookiesPath,
              COOKIEFILE: this.cookiesPath,
            },
          );
          pageIndex++;
        }

        const pageInformation = await this.curl.post(
          'http://www8.tjmg.jus.br/juridico/pe/consultaPorEntidadeDevedora.jsf',
          {
            POSTFIELDS: querystring.stringify({
              'javax.faces.partial.ajax': 'true',
              'javax.faces.source': 'resultado',
              'javax.faces.partial.execute': 'resultado',
              'javax.faces.partial.render': 'resultado',
              resultado: 'resultado',
              resultado_rowExpansion: 'true',
              resultado_expandedRowIndex: `${id}`,
              resultado_encodeFeature: 'true',
              resultado_skipChildren: 'true',
              frm_pesquisa: 'frm_pesquisa',
              entidade_devedora_input: search.input,
              entidade_devedora_hinput: search.hinput,
              ocultaFechados_input: '1',
              ocultaFechados_focus: '',
              numero_precatorio: '',
              tipo_precatorio_input: '-1',
              tipo_precatorio_focus: '',
              anoInicio: '',
              anoFim: '',
              numeroProcessoExecucao: '',
              numeroSEI: '',
              nomeBeneficiario: '',
              'javax.faces.ViewState': viewState,
            }),
            COOKIEJAR: this.cookiesPath,
            COOKIEFILE: this.cookiesPath,
          },
        );

        const pagePDF = iconv.decode(pageInformation.data, 'ISO-8859-1');

        const pageInformation2 = await this.curl.post(
          'http://www8.tjmg.jus.br/juridico/pe/consultaPorEntidadeDevedora.jsf',
          {
            POSTFIELDS: querystring.stringify({
              'javax.faces.partial.ajax': 'true',
              'javax.faces.source': `resultado:${id}:nprecatorio`,
              'javax.faces.partial.execute': '@all',
              'javax.faces.partial.render': 'frm_detalhe',
              [`resultado:${id}:nprecatorio`]: `resultado:${id}:nprecatorio`,
              frm_pesquisa: 'frm_pesquisa',
              entidade_devedora_input: search.input,
              entidade_devedora_hinput: search.hinput,
              ocultaFechados_input: '1',
              ocultaFechados_focus: '',
              numero_precatorio: '',
              tipo_precatorio_input: '-1',
              tipo_precatorio_focus: '',
              anoInicio: '',
              anoFim: '',
              numeroProcessoExecucao: '',
              numeroSEI: '',
              nomeBeneficiario: '',
              'javax.faces.ViewState': viewState,
            }),
            COOKIEJAR: this.cookiesPath,
            COOKIEFILE: this.cookiesPath,
          },
        );

        const pagePDF2 = iconv.decode(pageInformation2.data, 'ISO-8859-1');

        const process = formatChronologicalList(
          pagePDF,
          pagePDF2,
          id.toString(),
        );

        const today = new Date();
        const currentDate = `${today.getDate()}-${
          today.getMonth() + 1
        }-${today.getFullYear()}-`;
        const nameCSV = `${currentDate}${search.input.replace('/', '-')}.csv`;

        for (const acronyms of process.acronyms) {
          const processSave: ITJMGList = {
            chronologicalOrder: process.chronologicalOrder,
            openSuspended: process.openSuspended,
            value: process.value,
            NProcess: process.NProcess,
            NSEI: process.NSEI,
            origin: process.origin,
            action: process.action,
            saleOff: process.saleOff,
            protocolDateTime: process.protocolDateTime,
            protocolNumberYear: process.protocolNumberYear,
            acronyms: [acronyms],
          };
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
        }

        if (init === 0) {
          init++;
        }
      }
    }
  }

  async searchByChronologicalListPayment(): Promise<void> {
    const pageInitial = await this.curl.get(
      'http://www8.tjmg.jus.br/juridico/pe/listaCronologia.jsf',
      {
        COOKIEJAR: this.cookiesPath,
        COOKIEFILE: this.cookiesPath,
      },
    );

    const [, getViewState] = iconv
      .decode(pageInitial.data, 'ISO-8859-1')
      .split('name="javax.faces.ViewState" id="javax.faces.ViewState" value="');
    const [viewState] = getViewState.split('"');

    const pageInput = await this.curl.post(
      'http://www8.tjmg.jus.br/juridico/pe/listaCronologia.jsf',
      {
        POSTFIELDS: querystring.stringify({
          'javax.faces.partial.ajax': 'true',
          'javax.faces.source': 'entidade_devedora',
          'javax.faces.partial.execute': 'entidade_devedora',
          'javax.faces.partial.render': 'entidade_devedora',
          entidade_devedora: 'entidade_devedora',
          entidade_devedora_query: '',
          frm_pesquisa: 'frm_pesquisa',
          'javax.faces.ViewState': viewState,
          entidade_devedora_input: '',
          entidade_devedora_hinput: '',
          ocultaFechados_input: '1',
          ocultaFechados_focus: '',
        }),
        COOKIEJAR: this.cookiesPath,
        COOKIEFILE: this.cookiesPath,
      },
    );

    const pagePDFFormatted = iconv.decode(pageInput.data, 'ISO-8859-1');

    const debtors = pagePDFFormatted.split(
      '<li class="ui-autocomplete-item ui-autocomplete-list-item ui-corner-all" ',
    );

    const searchs: Array<ISearchMG> = [];

    if (debtors !== null) {
      for (const debtor of debtors) {
        if (debtor.includes('data-item-value')) {
          const [, getHinput] = debtor.split('data-item-value="');
          const [hinput] = getHinput.split('"');

          const [, getInput] = debtor.split('data-item-label="');
          let [input] = getInput.split('"');
          input = input.replace(/ /g, '+');

          searchs.push({ input, hinput });
        }
      }
    }

    for (const search of searchs) {
      console.log(search.input);
      const pageChronologicalList = await this.curl.post(
        'http://www8.tjmg.jus.br/juridico/pe/listaCronologia.jsf',
        {
          POSTFIELDS: querystring.stringify({
            'javax.faces.partial.ajax': 'true',
            'javax.faces.source': 'consulta2',
            'javax.faces.partial.execute': '@all',
            'javax.faces.partial.render': 'frm_pesquisa',
            consulta2: 'consulta2',
            frm_pesquisa: 'frm_pesquisa',
            'javax.faces.ViewState': viewState,
            entidade_devedora_input: `${search.input}`,
            entidade_devedora_hinput: `${search.hinput}`,
            ocultaFechados_input: '1',
            ocultaFechados_focus: '',
          }),
          COOKIEJAR: this.cookiesPath,
          COOKIEFILE: this.cookiesPath,
        },
      );

      const page = iconv.decode(pageChronologicalList.data, 'ISO-8859-1');

      let totalCourtOrders = '0';
      if (page.includes(`Total de `)) {
        const [, getTotalCourtOrders] = page.split(`Total de `);
        [totalCourtOrders] = getTotalCourtOrders.split(' precatórios.');
      }

      let pageIndex = 0;
      for (let id = 0; id < Number(totalCourtOrders); id++) {
        // Mudar de pagina
        if (id / 15 === pageIndex || id === 0) {
          const pageI = pageIndex * 15;
          await this.curl.post(
            'http://www8.tjmg.jus.br/juridico/pe/listaCronologia.jsf',
            {
              POSTFIELDS: querystring.stringify({
                'javax.faces.partial.ajax': 'true',
                'javax.faces.source': 'resultado',
                'javax.faces.partial.execute': 'resultado',
                'javax.faces.partial.render': 'resultado',
                resultado: 'resultado',
                resultado_pagination: 'true',
                resultado_first: `${pageI}`,
                resultado_rows: '15',
                resultado_encodeFeature: 'true',
                frm_pesquisa: 'frm_pesquisa',
                entidade_devedora_input: `${search.input}`,
                entidade_devedora_hinput: `${search.hinput}`,
                ocultaFechados_input: '1',
                ocultaFechados_focus: '',
                'javax.faces.ViewState': viewState,
              }),
              COOKIEJAR: this.cookiesPath,
              COOKIEFILE: this.cookiesPath,
            },
          );
          pageIndex++;
        }

        const pageInformation = await this.curl.post(
          'http://www8.tjmg.jus.br/juridico/pe/listaCronologia.jsf',
          {
            POSTFIELDS: querystring.stringify({
              'javax.faces.partial.ajax': 'true',
              'javax.faces.source': 'resultado',
              'javax.faces.partial.execute': 'resultado',
              'javax.faces.partial.render': 'resultado',
              resultado: 'resultado',
              resultado_rowExpansion: 'true',
              resultado_expandedRowIndex: `${id}`,
              resultado_encodeFeature: 'true',
              resultado_skipChildren: 'true',
              frm_pesquisa: 'frm_pesquisa',
              entidade_devedora_input: `${search.input}`,
              entidade_devedora_hinput: `${search.hinput}`,
              ocultaFechados_input: '1',
              ocultaFechados_focus: '',
              'javax.faces.ViewState': viewState,
            }),
            COOKIEJAR: this.cookiesPath,
            COOKIEFILE: this.cookiesPath,
          },
        );

        const pagePDF = iconv.decode(pageInformation.data, 'ISO-8859-1');

        const pageInformation2 = await this.curl.post(
          'http://www8.tjmg.jus.br/juridico/pe/listaCronologia.jsf',
          {
            POSTFIELDS: querystring.stringify({
              'javax.faces.partial.ajax': 'true',
              'javax.faces.source': `resultado:${id}:nprecatorio`,
              'javax.faces.partial.execute': '@all',
              'javax.faces.partial.render': 'frm_detalhe',
              [`resultado:${id}:nprecatorio`]: `resultado:${id}:nprecatorio`,
              frm_pesquisa: 'frm_pesquisa',
              entidade_devedora_input: search.input,
              entidade_devedora_hinput: search.hinput,
              ocultaFechados_input: '1',
              ocultaFechados_focus: '',
              'javax.faces.ViewState': viewState,
            }),
            COOKIEJAR: this.cookiesPath,
            COOKIEFILE: this.cookiesPath,
          },
        );

        const pagePDF2 = iconv.decode(pageInformation2.data, 'ISO-8859-1');

        await fs.promises.writeFile(
          path.resolve(tjmgPath, 'paginaPDFs.html'),
          pagePDF2,
          {
            encoding: 'utf8',
          },
        );

        const process = formatChronologicalList2(
          pagePDF,
          pagePDF2,
          id.toString(),
        );

        console.log(process);

        const today = new Date();
        const currentDate = `${today.getDate()}-${
          today.getMonth() + 1
        }-${today.getFullYear()}-`;
        const nameCSV = `${currentDate}${search.input.replace('/', '-')}.csv`;

        for (const acronyms of process.acronyms) {
          const processSave: ITJMGList = {
            chronologicalOrder: process.chronologicalOrder,
            openSuspended: process.openSuspended,
            value: process.value,
            NProcess: process.NProcess,
            NSEI: process.NSEI,
            origin: process.origin,
            action: process.action,
            saleOff: process.saleOff,
            protocolDateTime: process.protocolDateTime,
            protocolNumberYear: process.protocolNumberYear,
            acronyms: [acronyms],
          };
          const csvWriter =
            id > 0
              ? createObjectCsvWriter({
                  path: path.resolve(tjmgPath, 'payment', `${nameCSV}`),
                  header: headerListMG,
                  fieldDelimiter: ';',
                  encoding: 'latin1',
                  append: true,
                })
              : createObjectCsvWriter({
                  path: path.resolve(tjmgPath, 'payment', `${nameCSV}`),
                  header: headerListMG,
                  fieldDelimiter: ';',
                  encoding: 'latin1',
                });

          await csvWriter.writeRecords([processSave]);
        }
      }
    }
  }
}
