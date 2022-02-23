import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

interface tjUploadConfig {
  storage: multer.StorageEngine;
}

export const tjmgPath = path.resolve(__dirname, '..', '..', 'tjs', 'mg');

export const tjmsPath = path.resolve(__dirname, '..', '..', 'tjs', 'ms');

export const tjrsPath = path.resolve(__dirname, '..', '..', 'tjs', 'rs');

export const tjroPath = path.resolve(__dirname, '..', '..', 'tjs', 'ro');

export const tjapPath = path.resolve(__dirname, '..', '..', 'tjs', 'ap');

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

export function tjmsUploadConfig(): tjUploadConfig {
  const uploadConfig = {
    storage: multer.diskStorage({
      destination: path.resolve(tjmsPath, 'uploads'),
      filename: (request, file, callback) => {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash} - ${file.originalname}`;
        return callback(null, fileName);
      },
    }),
  };
  return uploadConfig;
}
