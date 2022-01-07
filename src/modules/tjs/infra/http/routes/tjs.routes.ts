import { Router } from 'express';

import { TjmgListController } from '../controllers/TjmgListController';

const tjsRouter = Router();

const tjmgListController = new TjmgListController();

tjsRouter.get('/minas_gerais', tjmgListController.handle);

export { tjsRouter };
