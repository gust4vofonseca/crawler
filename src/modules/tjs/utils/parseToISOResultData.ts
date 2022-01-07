import { CurlyResult } from 'node-libcurl';
import iconv from 'iconv-lite';

export function parseToISOresultData(
  iso: string,
  curlyObject: CurlyResult<any>,
): CurlyResult<any> {
  const redirectPageISOTreated = curlyObject;
  redirectPageISOTreated.data = iconv.decode(curlyObject.data, iso);
  return redirectPageISOTreated;
}
