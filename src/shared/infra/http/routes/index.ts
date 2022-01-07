import { Router } from 'express';
import { filesRouter } from '@modules/files/infra/http/routes/files.routes.ts';
import { tjsRouter } from '@modules/tjs/infra/http/routes/tjs.routes';

const router = Router();

router.use('/files', filesRouter);
router.use('/tjs', tjsRouter);

export default router;
