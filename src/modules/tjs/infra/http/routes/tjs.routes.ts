import { Router } from 'express';

import { tjmsUploadConfig } from '@config/upload';

import multer from 'multer';
import { TjmgListController } from '../controllers/TjmgListController';
import { TjrsListController } from '../controllers/TjrsListController';
import { TjmsListController } from '../controllers/TjmsListController';

const uploadTjms = multer(tjmsUploadConfig());

const tjsRouter = Router();

const tjmgListController = new TjmgListController();
const tjrsListController = new TjrsListController();
const tjmsListController = new TjmsListController();

tjsRouter.get('/minas_gerais', tjmgListController.handle);

tjsRouter.get('/rio_grande_do_sul', tjrsListController.handle);

tjsRouter.post('/ms', uploadTjms.single('file'), tjmsListController.handle);

export { tjsRouter };
