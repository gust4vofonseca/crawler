import { Router } from 'express';

import { tjmsUploadConfig } from '@config/upload';

import multer from 'multer';
import { TjmgListController } from '../controllers/TjmgListController';
import { TjmaListController } from '../controllers/TjmaListController';
import { TjrsListController } from '../controllers/TjrsListController';
import { TjrrListController } from '../controllers/TjrrListController';
import { TjmsListController } from '../controllers/TjmsListController';
import { TjroListController } from '../controllers/TjroListController';
import { TjapListController } from '../controllers/TjapListController';

const tjsRouter = Router();

const uploadTjms = multer(tjmsUploadConfig());

const tjmgListController = new TjmgListController();
const tjmaListController = new TjmaListController();
const tjrsListController = new TjrsListController();
const tjrrListController = new TjrrListController();
const tjroListController = new TjroListController();
const tjapListController = new TjapListController();
const tjmsListController = new TjmsListController();

tjsRouter.get('/mg', tjmgListController.handle);

tjsRouter.get('/ma', tjmaListController.handle);

tjsRouter.get('/rs', tjrsListController.handle);

tjsRouter.get('/rr', tjrrListController.handle);

tjsRouter.get('/ms', tjmsListController.handle);

tjsRouter.get('/ro', tjroListController.handle);

tjsRouter.get('/ap', tjapListController.handle);

export { tjsRouter };
