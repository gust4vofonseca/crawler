import { container } from 'tsyringe';
import { FileTemplatesRepository } from '@modules/files/infra/typeorm/repositories/FileTemplatesRepository';
import { LocationsRepository } from '@modules/files/infra/typeorm/repositories/LocationsRepository';
import { ProcessFilesRepository } from '@modules/files/infra/typeorm/repositories/ProcessFilesRepository';
import { IFileTemplatesRepository } from '@modules/files/repositories/IFileTemplatesRepository';
import { ILocationsRepository } from '@modules/files/repositories/ILocationsRepository';
import { IProcessFilesRepository } from '@modules/files/repositories/IProcessFilesRepository';

container.registerSingleton<IProcessFilesRepository>(
  'ProcessFilesRepository',
  ProcessFilesRepository,
);

container.registerSingleton<IFileTemplatesRepository>(
  'FileTemplatesRepository',
  FileTemplatesRepository,
);

container.registerSingleton<ILocationsRepository>(
  'LocationsRepository',
  LocationsRepository,
);
