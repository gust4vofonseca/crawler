import { Router } from 'express';
import { ProcessFilesController } from '../controllers/ProcessFilesController';
import { LocationsController } from '../controllers/LocationsController';
import { FileTemplatesController } from '../controllers/FileTemplatesController';
import { ZipFilesController } from '../controllers/ZipFilesController';

const filesRouter = Router();

const processFilesController = new ProcessFilesController();
const locationsController = new LocationsController();
const fileTemplatesController = new FileTemplatesController();
const zipFilesController = new ZipFilesController();

filesRouter.get('/process_files', processFilesController.index);

filesRouter.get('/file_templates', fileTemplatesController.index);
filesRouter.post('/file_templates', fileTemplatesController.handle);

filesRouter.get('/locations', locationsController.index);
filesRouter.post('/locations', locationsController.handle);
filesRouter.post('/zip/:id', zipFilesController.handle);

export { filesRouter };
