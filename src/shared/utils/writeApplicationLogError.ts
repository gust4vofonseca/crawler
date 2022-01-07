import fs from 'fs';

export function writeApplicationLogError(
  message: string,
  status: number,
  module: string,
): void {
  const date = new Date(new Date().getTime() - 10800000).toISOString();

  fs.appendFile(
    `logs/${module}-${date.slice(0, 10)}.txt`,
    `time: ${date.slice(
      11,
    )}\nstatus: ${status}\nmodule: ${module}\nmessage: ${message}\n\n`,
    error => {
      if (error) throw error;
    },
  );
}
