import querystring from 'querystring';
import { curly, CurlyFunction } from 'node-libcurl';
import path from 'path';
import { tjrsPath } from '@config/upload';
// import { formatChronologicalList } from '@modules/tjs/utils/formatTJRSProcess';
// import { headerListRS } from '@modules/tjs/utils/csvHeadersTJMG';
import { createObjectCsvWriter } from 'csv-writer';
// import fs from 'fs';
import { replaceStringForHTMLaccentuation } from '@modules/tjs/utils/replaceStringForHTMLaccentuation';
import { ITJRSList } from '@modules/tjs/dtos/ITJRSProcess';
import { headerListRS } from '@modules/tjs/utils/csvHeadersTjRS';
import { ITjrsProvider } from '../models/ITjrsProvider';

export class TjrsProvider implements ITjrsProvider {
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
    await this.curl.get(
      'https://www.tjrs.jus.br/novo/processos-e-servicos/precatorios-e-rpv/pesquisa-de-precatorios/',
      {
        COOKIEJAR: this.cookiesPath,
        COOKIEFILE: this.cookiesPath,
      },
    );

    const searchName = await this.curl.get(
      'https://www.tjrs.jus.br/site_php/precatorios/index.php',
      {
        COOKIEJAR: this.cookiesPath,
        COOKIEFILE: this.cookiesPath,
      },
    );

    const [, data] = replaceStringForHTMLaccentuation(
      searchName.data.toString(),
    ).split(`<select id="selectDevedor">`);

    const options = data.split(`<option value="`);

    const namesDebtor = [];
    let i = 0;
    for (const option of options) {
      if (i > 2 && option.includes(`">`)) {
        const [dataEntity, dataName] = option.split(`">`);
        const [entity] = dataEntity.split(`-`);
        const [name] = dataName.split(`<`);
        namesDebtor.push({ name: name.replace(/ /g, '+'), entity });
      }
      i++;
    }

    let debtorIndex = 1;
    for (const nameDebtor of namesDebtor) {
      debtorIndex++;
      console.log(debtorIndex);
      if (debtorIndex > 109) {
        console.log(nameDebtor.name);
        await this.curl.get(
          'https://www.tjrs.jus.br/novo/processos-e-servicos/precatorios-e-rpv/pesquisa-de-precatorios/',
          {
            COOKIEJAR: this.cookiesPath,
            COOKIEFILE: this.cookiesPath,
          },
        );
        const pageInitial = await this.curl.post(
          'https://www.tjrs.jus.br/site_php/precatorios/lista_precatorios_entidades.php',
          {
            postFields: querystring.stringify({
              aba_opcao_consulta: 'entidades',
              entidade: nameDebtor.entity,
              nome_entidade: nameDebtor.name,
            }),
            COOKIEJAR: this.cookiesPath,
            COOKIEFILE: this.cookiesPath,
          },
        );

        let dataPage = replaceStringForHTMLaccentuation(
          pageInitial.data.toString(),
        );

        const numberPages = [];
        let numberPrecatories = '';
        if (
          dataPage.includes(
            `entidade=${nameDebtor.entity}&nome_entidade=${nameDebtor.name}&qtd_precatorios=`,
          )
        ) {
          const getPages = dataPage.split(
            `entidade=${nameDebtor.entity}&nome_entidade=${nameDebtor.name}&qtd_precatorios=`,
          );
          [numberPrecatories] = getPages[1].split(`">`);
          let cont = 0;
          for (const getPage of getPages) {
            if (cont > 0) {
              const [, getNumber] = getPage.split(`">`);
              const [number] = getNumber.split(`<`);
              numberPages.push(number);
            }
            cont++;
          }
        }

        if (
          !dataPage.includes(
            `entidade=${nameDebtor.entity}&nome_entidade=${nameDebtor.name}&qtd_precatorios=`,
          )
        ) {
          numberPages.push('1');
        }
        let pageId = 1;
        let index = 1;
        for (const numberPage of numberPages) {
          console.log(pageId);
          if (numberPage !== '1') {
            pageId += 100;
            const name = nameDebtor.name.replace(/\+/g, '');
            const dataPageChange = await this.curl.get(
              `https://www.tjrs.jus.br/site_php/precatorios/lista_precatorios_entidades.php?cod_devedor=${nameDebtor.entity}&seq=${pageId}&incremento_de_seq=100&entidade=${nameDebtor.entity}&nome_entidade=${name}&qtd_precatorios=${numberPrecatories}`,
              {
                COOKIEJAR: this.cookiesPath,
                COOKIEFILE: this.cookiesPath,
              },
            );
            dataPage = replaceStringForHTMLaccentuation(
              dataPageChange.data.toString(),
            );
          }

          let pageInformation = [];
          if (dataPage.includes(`<div align="center"><a href="`)) {
            pageInformation = dataPage.split(`<div align="center"><a href="`);
          }

          let id = 0;
          for (const info of pageInformation) {
            if (id !== 0 && id !== pageInformation.length) {
              const process: ITJRSList = {
                NProcess: '',
                plotType: '',
                court: '',
                situation: '',
                fileType: '',
                date: '',
                administrativeProcess: '',
                value: '',
                origin: '',
                payer: '',
                lawyers: '',
                object: '',
                correspondingBudget: '',
                localization: '',
                position: '',
                currentSituation: '',
              };

              const [getHref, getNumberProcess] = info.split(`">`);
              const [numberProcess] = getNumberProcess.split(`<`);
              const [, getInfos] = info.split(`${numberProcess}`);
              const infos = getInfos.split(`align="center">`);

              let plotType = '';
              let court = '';
              let situation = '';
              if (infos) {
                [plotType] = infos[1].split(`<`);
                [court] = infos[2].split(`<`);
                [situation] = infos[3].split(`<`);
              }

              const page = await this.curl.get(
                `https://www.tjrs.jus.br/site_php/precatorios/${getHref}`,
                {
                  COOKIEJAR: this.cookiesPath,
                  COOKIEFILE: this.cookiesPath,
                },
              );

              const dat = page.data.toString();

              let fileType = '';
              if (dat.includes(`Tipo de Expediente:`)) {
                const [, getdata] = dat.split(`Tipo de Expediente:`);
                const [, getData] = getdata.split(`<td>\n `);
                [fileType] = getData.split(`<`);
              }

              let date = '';
              if (dat.includes(`Data de Apresenta`)) {
                const [, getdata] = dat.split(`Data de Apresenta`);
                const [, getData] = getdata.split(`<td> `);
                [date] = getData.split(`<`);
              }

              let administrativeProcess = '';
              if (dat.includes(`Processo Administrativo`)) {
                const [, getdata] = dat.split(`Processo Administrativo`);
                const [, getData] = getdata.split(`<td width="50%">`);
                [administrativeProcess] = getData.split(`<`);
              }

              let value = '';
              if (dat.includes(`Valor do Precat`)) {
                const [, getdata] = dat.split(`Valor do Precat`);
                const [, getData] = getdata.split(
                  `<td width="50%" valign="top">`,
                );
                [value] = getData.split(`<`);
              }

              let origin = '';
              if (dat.includes(`Origem`)) {
                const [, getdata] = dat.split(`Origem`);
                const [, getData] = getdata.split(
                  `<td width="50%" valign="top">`,
                );
                [origin] = getData.split(`<`);
              }

              let payer = '';
              if (dat.includes(`Pagador`)) {
                const [, getdata] = dat.split(`Pagador`);
                const [, getData] = getdata.split(`<td width="50%">`);
                [payer] = getData.split(`<`);
              }

              let lawyers = '';
              if (dat.includes(`Advogado`)) {
                const [, getdata] = dat.split(`Advogado`);
                const [, getData] = getdata.split(`<td width="50%">`);
                [lawyers] = getData.split(`<`);
              }

              let object = '';
              if (dat.includes(`Objeto`)) {
                const [, getdata] = dat.split(`Objeto`);
                const [, getData] = getdata.split(`<td width="50%">`);
                [object] = getData.split(`<`);
              }

              let correspondingBudget = '';
              if (dat.includes(`Correspondente`)) {
                const [, getdata] = dat.split(`Correspondente`);
                const [, getData] = getdata.split(`<td width="50%">`);
                [correspondingBudget] = getData.split(`<`);
              }

              let currentSituation = '';
              if (dat.includes(`Atual:`)) {
                const [, getdata] = dat.split(`Atual:`);
                const [, getData] = getdata.split(`<td width="50%">`);
                [currentSituation] = getData.split(`<`);
              }

              let localization = '';
              if (dat.includes(`Localiza`)) {
                const [, getdata] = dat.split(`Localiza`);
                const [, getData] = getdata.split(`<td width="50%">`);
                [localization] = getData.split(`<`);
              }

              let position = '';
              if (dat.includes(`na Fila Ordem Crono`)) {
                const [, getdata] = dat.split(`na Fila Ordem Crono`);
                const [, getData] = getdata.split(`<td>`);
                [position] = getData.split(`<`);
              }

              process.NProcess =
                replaceStringForHTMLaccentuation(numberProcess);
              process.court = replaceStringForHTMLaccentuation(court);
              process.situation = replaceStringForHTMLaccentuation(situation);
              process.plotType = replaceStringForHTMLaccentuation(plotType);
              process.fileType = replaceStringForHTMLaccentuation(fileType);
              process.date = date.replace(/\n/g, '');
              process.administrativeProcess = replaceStringForHTMLaccentuation(
                administrativeProcess,
              );
              process.value = replaceStringForHTMLaccentuation(value);
              process.origin = replaceStringForHTMLaccentuation(origin);
              process.payer = replaceStringForHTMLaccentuation(payer);
              process.lawyers = replaceStringForHTMLaccentuation(lawyers);
              process.object = replaceStringForHTMLaccentuation(object);
              process.correspondingBudget =
                replaceStringForHTMLaccentuation(correspondingBudget);
              process.localization =
                replaceStringForHTMLaccentuation(localization);
              process.position = replaceStringForHTMLaccentuation(position);
              process.currentSituation =
                replaceStringForHTMLaccentuation(currentSituation);

              const today = new Date();
              const currentDate = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}-`;
              const nameCSV = `${currentDate}${nameDebtor.name.replace(
                '/',
                '-',
              )}.csv`;

              const csvWriter =
                index > 1
                  ? createObjectCsvWriter({
                      path: path.resolve(tjrsPath, 'uploads', `${nameCSV}`),
                      header: headerListRS,
                      fieldDelimiter: ';',
                      encoding: 'latin1',
                      append: true,
                    })
                  : createObjectCsvWriter({
                      path: path.resolve(tjrsPath, 'uploads', `${nameCSV}`),
                      header: headerListRS,
                      fieldDelimiter: ';',
                      encoding: 'latin1',
                    });

              await csvWriter.writeRecords([process]);
              index++;
            }
            id++;
          }
        }
      }
    }
  }
}
