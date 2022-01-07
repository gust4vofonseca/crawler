import querystring from 'querystring';
import { curly, CurlyFunction } from 'node-libcurl';
import path from 'path';
import iconv from 'iconv-lite';
import { tjmgPath } from '@config/upload';
import { ISearchMG } from '@modules/tjs/dtos/ITJMGProcess';
import fs from 'fs';
import {
  formatChronologicalList,
  formatChronologicalList2,
} from '@modules/tjs/utils/formatTJMGProcess';
import { headerListMG } from '@modules/tjs/utils/csvHeadersTJMG';
import { createObjectCsvWriter } from 'csv-writer';
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

  // Lista cronologica

  async searchByChronologicalList(): Promise<void> {
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

        // Formatar Informações
        const process = formatChronologicalList(pagePDF, id.toString());

        const nameCSV = `${search.input.replace('/', '-')}.csv`;

        // Criar e salvar CSV
        const csvWriter =
          init > 0
            ? createObjectCsvWriter({
                path: path.resolve(tjmgPath, 'uploads', nameCSV),
                header: headerListMG,
                fieldDelimiter: ';',
                encoding: 'latin1',
                append: true,
              })
            : createObjectCsvWriter({
                path: path.resolve(tjmgPath, 'uploads', nameCSV),
                header: headerListMG,
                fieldDelimiter: ';',
                encoding: 'latin1',
              });

        await csvWriter.writeRecords([process]);

        init++;

        const csvWriter2 =
          init > 0
            ? createObjectCsvWriter({
                path: path.resolve(tjmgPath, 'lista.csv'),
                header: headerListMG,
                fieldDelimiter: ';',
                encoding: 'latin1',
                append: true,
              })
            : createObjectCsvWriter({
                path: path.resolve(tjmgPath, 'lista.csv'),
                header: headerListMG,
                fieldDelimiter: ';',
                encoding: 'latin1',
              });

        await csvWriter2.writeRecords([process]);
      }
    }
  }

  async searchByChronologicalList2(): Promise<void> {
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

    let init = 0;
    for (const search of searchs) {
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

        // Formatar Informações
        const process = formatChronologicalList2(pagePDF, id.toString());

        // Criar e salvar CSV
        const nameCSV = `${search.input.replace('/', '-')}.csv`;

        // Criar e salvar CSV
        const csvWriter =
          init > 0
            ? createObjectCsvWriter({
                path: path.resolve(tjmgPath, 'uploads2', nameCSV),
                header: headerListMG,
                fieldDelimiter: ';',
                encoding: 'latin1',
                append: true,
              })
            : createObjectCsvWriter({
                path: path.resolve(tjmgPath, 'uploads2', nameCSV),
                header: headerListMG,
                fieldDelimiter: ';',
                encoding: 'latin1',
              });

        await csvWriter.writeRecords([process]);

        init++;
      }
    }
  }

  /* async formatChronologicalList(data: string, id: string): Promise<ITJMGList> {
    let chronologicalOrder = '';
    if (data.includes('Ordem Cronológica')) {
      const [, getChronologicalOrder] = data.split(`Ordem Cronológica`);
      const [, getChronologicalOrder2] = getChronologicalOrder.split(
        'class="ui-outputlabel">',
      );
      [chronologicalOrder] = getChronologicalOrder2.split('</label>');
    }

    let openSuspended = '';
    if (data.includes('Ordem Aberto/Suspenso')) {
      const [, getOpenSuspended] = data.split(`Ordem Aberto/Suspenso`);
      const [, getOpenSuspended2] = getOpenSuspended.split(
        'class="ui-outputlabel">',
      );
      [openSuspended] = getOpenSuspended2.split('</label>');
    }

    let value = '';
    if (data.includes('Valor de formação do Precatório')) {
      const [, getValue] = data.split(
        `id="resultado:${id}:j_idt58:valorFace">\n`,
      );
      [value] = getValue.split('<');
    }

    let NProcess = '';
    if (data.includes('Nº Processo')) {
      const [, getNProcess] = data.split(
        `id="resultado:${id}:j_idt58:processo">\n`,
      );
      [NProcess] = getNProcess.split('<');
    }

    let NSEI = '';
    if (data.includes('Nº SEI')) {
      const [, getNSEI] = data.split(
        `id="resultado:${id}:j_idt58:protocoloSEI">\n`,
      );
      [NSEI] = getNSEI.split('<');
    }

    let origin = '';
    if (data.includes('Origem')) {
      const [, getOrigin] = data.split(
        `id="resultado:${id}:j_idt58:origem">\n`,
      );
      [origin] = getOrigin.split('<');
    }

    let action = '';
    if (data.includes('Ação')) {
      const [, getAction] = data.split(`id="resultado:${id}:j_idt58:acao">\n`);
      [action] = getAction.split('<');
    }

    let saleOff = '';
    if (data.includes('Liquidação')) {
      const [, getSaleOff] = data.split(
        `id="resultado:${id}:j_idt58:liquidacao">\n`,
      );
      [saleOff] = getSaleOff.split('<');
    }

    let protocolDateTime = '';
    if (data.includes('Protocolo (Data/Hora)')) {
      const [, getProtocolDateTime] = data.split(
        `id="resultado:${id}:j_idt58:protocolo">\n`,
      );
      [protocolDateTime] = getProtocolDateTime.split('<');
    }

    let protocolNumberYear = '';
    if (data.includes('Protocolo (Número/Ano)')) {
      const [, getProtocolNumberYear] = data.split(
        `id="resultado:${id}:j_idt58:protocoloNumero">\n`,
      );
      [protocolNumberYear] = getProtocolNumberYear.split('<');
    }

    const process: ITJMGList = {
      chronologicalOrder,
      openSuspended,
      value,
      NProcess,
      NSEI,
      origin,
      action,
      saleOff,
      protocolDateTime,
      protocolNumberYear,
    };

    return process;
  }

  async formatChronologicalList2(data: string, id: string): Promise<ITJMGList> {
    let chronologicalOrder = '';
    if (data.includes('Ordem Cronológica')) {
      const [, getChronologicalOrder] = data.split(`Ordem Cronológica`);
      const [, getChronologicalOrder2] = getChronologicalOrder.split(
        'class="ui-outputlabel">',
      );
      [chronologicalOrder] = getChronologicalOrder2.split('</label>');
    }

    let openSuspended = '';
    if (data.includes('Ordem Aberto/Suspenso')) {
      const [, getOpenSuspended] = data.split(`Ordem Aberto/Suspenso`);
      const [, getOpenSuspended2] = getOpenSuspended.split(
        'class="ui-outputlabel">',
      );
      [openSuspended] = getOpenSuspended2.split('</label>');
    }

    let value = '';
    if (data.includes('Valor de formação do Precatório')) {
      const [, getValue] = data.split(
        `id="resultado:${id}:j_idt46:valorFace">\n`,
      );
      [value] = getValue.split('<');
    }

    let NProcess = '';
    if (data.includes('Nº Processo')) {
      const [, getNProcess] = data.split(
        `id="resultado:${id}:j_idt46:processo">\n`,
      );
      [NProcess] = getNProcess.split('<');
    }

    let NSEI = '';
    if (data.includes('Nº SEI')) {
      const [, getNSEI] = data.split(
        `id="resultado:${id}:j_idt46:protocoloSEI">\n`,
      );
      [NSEI] = getNSEI.split('<');
    }

    let origin = '';
    if (data.includes('Origem')) {
      const [, getOrigin] = data.split(
        `id="resultado:${id}:j_idt46:origem">\n`,
      );
      [origin] = getOrigin.split('<');
    }

    let action = '';
    if (data.includes('Ação')) {
      const [, getAction] = data.split(`id="resultado:${id}:j_idt46:acao">\n`);
      [action] = getAction.split('<');
    }

    let saleOff = '';
    if (data.includes('Liquidação')) {
      const [, getSaleOff] = data.split(
        `id="resultado:${id}:j_idt46:liquidacao">\n`,
      );
      [saleOff] = getSaleOff.split('<');
    }

    let protocolDateTime = '';
    if (data.includes('Protocolo (Data/Hora)')) {
      const [, getProtocolDateTime] = data.split(
        `id="resultado:${id}:j_idt46:protocolo">\n`,
      );
      [protocolDateTime] = getProtocolDateTime.split('<');
    }

    let protocolNumberYear = '';
    if (data.includes('Protocolo (Número/Ano)')) {
      const [, getProtocolNumberYear] = data.split(
        `id="resultado:${id}:j_idt46:protocoloNumero">\n`,
      );
      [protocolNumberYear] = getProtocolNumberYear.split('<');
    }

    const process: ITJMGList = {
      chronologicalOrder,
      openSuspended,
      value,
      NProcess,
      NSEI,
      origin,
      action,
      saleOff,
      protocolDateTime,
      protocolNumberYear,
    };

    return process;
  } */
}
