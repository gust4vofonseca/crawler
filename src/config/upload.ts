import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

interface tjUploadConfig {
  storage: multer.StorageEngine;
}

export const tjmgPath = path.resolve(__dirname, '..', '..', 'tjs', 'mg');

export const tjrsPath = path.resolve(__dirname, '..', '..', 'tjs', 'rs');

export function tjmgUploadConfig(): tjUploadConfig {
  const uploadConfig = {
    storage: multer.diskStorage({
      destination: `${tjmgPath}/uploads`,
      filename: (request, file, callback) => {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash} - ${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  };
  return uploadConfig;
}
