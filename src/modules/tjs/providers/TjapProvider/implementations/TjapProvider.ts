import querystring from 'querystring';
import { curly, CurlyFunction } from 'node-libcurl';
import path from 'path';
import { tjapPath } from '@config/upload';
// import { formatChronologicalList } from '@modules/tjs/utils/formatTJRSProcess';
// import { headerListRS } from '@modules/tjs/utils/csvHeadersTJMG';
import { createObjectCsvWriter } from 'csv-writer';
// import fs from 'fs';
// import { ITJAPList } from '@modules/tjs/dtos/ITJAPProcess';
// import { headerListAP } from '@modules/tjs/utils/csvHeadersTJAP';
import fs from 'fs';
import { ITjapProvider } from '../models/ITjapProvider';

export class TjapProvider implements ITjapProvider {
  private curl: CurlyFunction;

  private cookiesPath: string;

  constructor() {
    this.cookiesPath = path.resolve(tjapPath, 'cookies', 'cookiefile_tjap_pje');

    this.curl =
      process.env.NODE_ENV === 'prod'
        ? curly.create()
        : curly.create({ SSL_VERIFYPEER: false });
  }

  // Lista cronologica

  async searchByChronologicalList(): Promise<void> {
    const data = await this.curl.get(
      'https://sig.tjap.jus.br/sgpe_control_lista_precatorios/',
      {
        HTTPHEADER: [
          querystring.stringify({
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0',
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Connection: 'keep-alive',
          }),
        ],
        COOKIEJAR: this.cookiesPath,
        COOKIEFILE: this.cookiesPath,
      },
    );
    await this.curl.get(
      'https://sig.tjap.jus.br/_lib/prod/third/jquery_plugin/thickbox/thickbox-compressed.js',
      {
        HTTPHEADER: [
          querystring.stringify({
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0',
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Connection: 'keep-alive',
          }),
        ],
        COOKIEJAR: this.cookiesPath,
        COOKIEFILE: this.cookiesPath,
      },
    );

    const [, getSession] = data.data
      .toString()
      .split(`"script_case_session" value="`);
    const [session] = getSession.split(`"`);

    const [, getCase] = data.data
      .toString()
      .split(`"script_case_init" value="`);
    const [caseInit] = getCase.split(`"`);

    for (let i = 1; i <= 6; i++) {
      const data3 = await this.curl.post(
        'https://sig.tjap.jus.br/sgpe_grid_lista_precatorios/sgpe_grid_lista_precatorios.php',
        {
          POSTFIELDS: querystring.stringify({
            nmgp_parms:
              'var_consulta?#?1=1+and+fk_pessoas_precatorio_devedor+=+&#039;1&#039;?@?',
            nmgp_url_saida:
              '/sgpe_control_lista_precatorios/sgpe_control_lista_precatorios.php',
            script_case_init: caseInit,
            script_case_session: session,
          }),
          HTTPHEADER: [
            querystring.stringify({
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0',
              Accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
              'Accept-Language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
              'Accept-Encoding': 'gzip, deflate, br',
              'Content-Type':
                'application/x-www-form-urlencoded; charset=UTF-8',
              Connection: 'keep-alive',
            }),
          ],
          COOKIEJAR: this.cookiesPath,
          COOKIEFILE: this.cookiesPath,
        },
      );

      await fs.promises.writeFile(
        path.resolve(tjapPath, 'paginaPDFs.html'),
        data3.data,
        {
          encoding: 'utf8',
        },
      );

      console.log(data3);
      const teste = await this.curl.post(
        'https://sig.tjap.jus.br/sgpe_grid_lista_precatorios/sgpe_grid_lista_precatorios.php',
        {
          POSTFIELDS: querystring.stringify({
            nmgp_opcao: 'link_res',
            nmgp_parms_where:
              '@SC_par@9075@SC_par@sgpe_grid_lista_precatorios@SC_par@53096a6deeedc00a5a36a8955631c8fd',
            script_case_init: '9075',
            script_case_session: 'iu103u56m2jfbeiv079et7aea3',
          }),
          HTTPHEADER: [
            querystring.stringify({
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0',
              Accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
              'Accept-Language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
              'Accept-Encoding': 'gzip, deflate, br',
              'Content-Type':
                'application/x-www-form-urlencoded; charset=UTF-8',
              Connection: 'keep-alive',
            }),
          ],
          COOKIEJAR: this.cookiesPath,
          COOKIEFILE: this.cookiesPath,
        },
      );
      const teste2 = await this.curl.post(
        'https://sig.tjap.jus.br/sgpe_grid_lista_precatorios/sgpe_grid_lista_precatorios_export_ctrl.php',
        {
          POSTFIELDS: querystring.stringify({
            nmgp_opcao: 'xls',
            nmgp_tp_xls: 'xls',
            nmgp_tot_xls: 'N',
            SC_module_export: 'grid',
            nm_delim_line: '',
            nm_delim_col: '',
            nm_delim_dados: '',
            nm_label_csv: '',
            nm_xml_tag: '',
            nm_xml_label: '',
            nm_json_format: '',
            nm_json_label: '',
            nmgp_password: '',
            script_case_init: '9075',
            script_case_session: 'iu103u56m2jfbeiv079et7aea3',
          }),
          HTTPHEADER: [
            'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:94.0) Gecko/20100101 Firefox/94.0',
          ],
          COOKIEJAR: this.cookiesPath,
          COOKIEFILE: this.cookiesPath,
        },
      );

      await fs.promises.writeFile(
        path.resolve(tjapPath, `${i}paginaPDFs.html`),
        data3.data,
        {
          encoding: 'utf8',
        },
      );
    }

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
