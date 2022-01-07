import { writeApplicationLogError } from '@shared/utils/writeApplicationLogError';

export function getText2Split(
  text: string,
  beforeText: string,
  afterText: string,
): string {
  try {
    const [, getResult] = text.split(beforeText);
    const [result] = getResult.split(afterText);
    return result;
  } catch (error) {
    writeApplicationLogError(error.message, 400, 'TJMG');
    return '';
  }
}
