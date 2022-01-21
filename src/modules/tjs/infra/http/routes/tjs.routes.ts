import { Router } from 'express';

import { TjmgListController } from '../controllers/TjmgListController';
import { TjrsListController } from '../controllers/TjrsListController';

const tjsRouter = Router();

const tjmgListController = new TjmgListController();
const tjrsListController = new TjrsListController();

tjsRouter.get('/minas_gerais', tjmgListController.handle);

tjsRouter.get('/rio_grande_do_sul', tjrsListController.handle);

export { tjsRouter };
