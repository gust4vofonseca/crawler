export function replaceStringForHTMLaccentuation(text: string): string {
  const decodings = [
    { character: 'À', code: '&Agrave;' },
    { character: 'Á', code: '&Aacute;' },
    { character: 'Â', code: '&Acirc;' },
    { character: 'Ã', code: '&Atilde;' },
    { character: 'Ä', code: '&Auml;' },
    { character: 'Å', code: '&Aring;' },
    { character: 'à', code: '&agrave;' },
    { character: 'á', code: '&aacute;' },
    { character: 'â', code: '&acirc;' },
    { character: 'ã', code: '&atilde;' },
    { character: 'ä', code: '&auml;' },
    { character: 'å', code: '&aring;' },
    { character: 'Æ', code: '&AElig;' },
    { character: 'æ', code: '&aelig;' },
    { character: 'ß', code: '&szlig;' },
    { character: 'Ç', code: '&Ccedil;' },
    { character: 'ç', code: '&ccedil;' },
    { character: 'È', code: '&Egrave;' },
    { character: 'É', code: '&Eacute;' },
    { character: 'Ê', code: '&Ecirc;' },
    { character: 'Ë', code: '&Euml;' },
    { character: 'è', code: '&egrave;' },
    { character: 'é', code: '&eacute;' },
    { character: 'ê', code: '&ecirc;' },
    { character: 'ë', code: '&euml;' },
    { character: 'ƒ', code: '&#131;' },
    { character: 'Ì', code: '&Igrave;' },
    { character: 'Í', code: '&Iacute;' },
    { character: 'Î', code: '&Icirc;' },
    { character: 'Ï', code: '&Iuml;' },
    { character: 'ì', code: '&igrave;' },
    { character: 'í', code: '&iacute;' },
    { character: 'î', code: '&icirc;' },
    { character: 'ï', code: '&iuml;' },
    { character: 'Ñ', code: '&Ntilde;' },
    { character: 'ñ', code: '&ntilde;' },
    { character: 'Ò', code: '&Ograve;' },
    { character: 'Ó', code: '&Oacute;' },
    { character: 'Ô', code: '&Ocirc;' },
    { character: 'Õ', code: '&Otilde;' },
    { character: 'Ö', code: '&Ouml;' },
    { character: 'ò', code: '&ograve;' },
    { character: 'ó', code: '&oacute;' },
    { character: 'ô', code: '&ocirc;' },
    { character: 'õ', code: '&otilde;' },
    { character: 'ö', code: '&ouml;' },
    { character: 'Ø', code: '&Oslash;' },
    { character: 'ø', code: '&oslash;' },
    { character: 'Œ', code: '&#140;' },
    { character: 'œ', code: '&#156;' },
    { character: 'Š', code: '&#138;' },
    { character: 'š', code: '&#154;' },
    { character: 'Ù', code: '&Ugrave;' },
    { character: 'Ú', code: '&Uacute;' },
    { character: 'Û', code: '&Ucirc;' },
    { character: 'Ü', code: '&Uuml;' },
    { character: 'ù', code: '&ugrave;' },
    { character: 'ú', code: '&uacute;' },
    { character: 'û', code: '&ucirc;' },
    { character: 'ü', code: '&uuml;' },
    { character: 'µ', code: '&#181;' },
    { character: '×', code: '&#215;' },
    { character: 'Ý', code: '&Yacute;' },
    { character: 'Ÿ', code: '&#159;' },
    { character: 'ý', code: '&yacute;' },
    { character: 'ÿ', code: '&yuml;' },
    { character: '°', code: '&ordm;' },
    { character: '†', code: '&#134;' },
    { character: '‡', code: '&#135;' },
    { character: '<', code: '&lt;' },
    { character: '>', code: '&gt;' },
    { character: '±', code: '&#177;' },
    { character: '«', code: '&#171;' },
    { character: '»', code: '&raquo;' },
    { character: '»', code: '&#187;' },
    { character: '¿', code: '&#191;' },
    { character: '¡', code: '&#161;' },
    { character: '·', code: '&#183;' },
    { character: '•', code: '&#149;' },
    { character: '™', code: '&#153;' },
    { character: '©', code: '&copy;' },
    { character: '®', code: '&reg;' },
    { character: '§', code: '&#167;' },
    { character: '¶', code: '&#182;' },
    { character: 'ª', code: '&ordf;' },
    { character: ' ', code: '&nbsp;' },
    { character: '', code: '&nbsp;' },
  ];

  let result = text
    .replace(/\t/g, '')
    .replace(/\n/g, '')
    .replace(/\r/g, '')
    .replace(new RegExp('amp;', 'g'), '');

  for (const decoding of decodings) {
    result = result.replace(new RegExp(decoding.code, 'g'), decoding.character);
  }

  return result;
}
