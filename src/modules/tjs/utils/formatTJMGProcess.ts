import { ITJMGList } from '../dtos/ITJMGProcess';

export function formatChronologicalList(data: string, id: string): ITJMGList {
  /* let chronologicalOrder = '';
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
  } */

  let NProcess = '';
  if (data.includes('Nº Processo')) {
    const [, getNProcess] = data.split(
      `id="resultado:${id}:j_idt58:processo">\n`,
    );
    [NProcess] = getNProcess.split('<');
  }

  /*
  let NSEI = '';
  if (data.includes('Nº SEI')) {
    const [, getNSEI] = data.split(
      `id="resultado:${id}:j_idt58:protocoloSEI">\n`,
    );
    [NSEI] = getNSEI.split('<');
  }

  let origin = '';
  if (data.includes('Origem')) {
    const [, getOrigin] = data.split(`id="resultado:${id}:j_idt58:origem">\n`);
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
  } */

  const process: ITJMGList = {
    // chronologicalOrder,
    // openSuspended,
    // value,
    NProcess,
    // NSEI,
    // origin,
    // action,
    // saleOff,
    // protocolDateTime,
    // protocolNumberYear,
  };

  return process;
}

export function formatChronologicalList2(data: string, id: string): ITJMGList {
  /* let chronologicalOrder = '';
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
  } */

  let NProcess = '';
  if (data.includes('Nº Processo')) {
    const [, getNProcess] = data.split(
      `id="resultado:${id}:j_idt46:processo">\n`,
    );
    [NProcess] = getNProcess.split('<');
  }

  /*
  let NSEI = '';
  if (data.includes('Nº SEI')) {
    const [, getNSEI] = data.split(
      `id="resultado:${id}:j_idt46:protocoloSEI">\n`,
    );
    [NSEI] = getNSEI.split('<');
  }

  let origin = '';
  if (data.includes('Origem')) {
    const [, getOrigin] = data.split(`id="resultado:${id}:j_idt46:origem">\n`);
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
  } */

  const process: ITJMGList = {
    // chronologicalOrder,
    // openSuspended,
    // value,
    NProcess,
    // NSEI,
    // origin,
    // action,
    // saleOff,
    // protocolDateTime,
    // protocolNumberYear,
  };

  return process;
}
