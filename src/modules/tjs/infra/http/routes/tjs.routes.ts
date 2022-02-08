import { Router } from 'express';

import { tjmsUploadConfig } from '@config/upload';

import multer from 'multer';
import { TjmgListController } from '../controllers/TjmgListController';
import { TjrsListController } from '../controllers/TjrsListController';
import { TjmsListController } from '../controllers/TjmsListController';
import { TjroListController } from '../controllers/TjroListController';

const tjsRouter = Router();

const uploadTjms = multer(tjmsUploadConfig());

const tjmgListController = new TjmgListController();
const tjrsListController = new TjrsListController();
const tjroListController = new TjroListController();
const tjmsListController = new TjmsListController();

tjsRouter.get('/minas_gerais', tjmgListController.handle);

tjsRouter.get('/rio_grande_do_sul', tjrsListController.handle);

tjsRouter.post('/ms', uploadTjms.single('file'), tjmsListController.handle);

tjsRouter.get('/ro', tjroListController.handle);

export { tjsRouter };
