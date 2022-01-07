/* eslint-disable no-loop-func */
/* eslint-disable no-cond-assign */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export function getTextOccurrences(phrase: RegExp, text: string) {
  const regex = phrase;
  let m;
  let cont = 0;

  while ((m = regex.exec(text)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    m.forEach(() => {
      cont++;
    });
  }

  return cont;
}
