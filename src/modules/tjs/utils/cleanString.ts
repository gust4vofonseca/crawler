interface Mode {
  text: string;
  mode?: string;
}
export function cleanString(text: string): string {
  let init = 0;
  let end = 0;

  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== ' ' && text[index] !== '\t' && text[index] !== '\n') {
      init = index;

      break;
    }
  }

  for (let index = text.length - 1; index > 0; index -= 1) {
    if (text[index] !== ' ' && text[index] !== '\t' && text[index] !== '\n') {
      end = index + 1;

      break;
    }
  }

  const string = text.substring(init, end);

  return string;
}

export function cleanStringTJPR(text: string): string {
  return text ? text.replace(new RegExp(/(\r\n|\n|\r|\t)/g), '').trim() : '';
}

export function cleanLawyersHtml(text: string): string {
  return text
    .replace(new RegExp(/(\r\n|\n|\r|\t|)/g), '')
    .replace(new RegExp(/<ul>/g), '')
    .replace(new RegExp('</li>', 'g'), '')
    .replace(new RegExp('</ul>', 'g'), '')
    .trim();
}

export function cleanStringTJPR2({ text, mode = 'OAB' }: Mode): string {
  if (mode === 'OAB') {
    return text && text.indexOf('OAB') <= -1
      ? text
          .replace(new RegExp(/(\r\n|\n|\r|\t)/g), '')
          .replace(
            new RegExp('<b> <b><i>(cita��o online)</i></b></b>', 'g'),
            '',
          )
          .trim()
      : '';
  }
  return text
    ? text
        .replace(new RegExp(/(\r\n|\n|\r|\t)/g), '')
        .replace(new RegExp('<b> <b><i>(cita��o online)</i></b></b>', 'g'), '')
        .trim()
    : '';
}
