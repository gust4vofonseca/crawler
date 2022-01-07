const correctionIndexDict = [
  'INPC',
  'IGP-M',
  'IGMP',
  'Taxa Referencial',
  'TR',
  'IPCA',
  'IPCA-e',
  'IGP-DI',
  'IGPDI',
  'INPC',
];

export function doesProcessHaveCorrectionIndex(indexString: string): boolean {
  let doesItHave = false;
  try {
    for (const index of correctionIndexDict) {
      if (indexString.includes(index)) {
        doesItHave = indexString.includes(index);
      }
    }
  } catch (error) {
    console.log(error);
  }
  return doesItHave;
}
