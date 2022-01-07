import { ConnectionOptions, createConnections } from 'typeorm';
import { ormConfig } from './ormConfig';

require('ts-node/register');
require('tsconfig-paths/register');

export default async (): Promise<void> => {
  const startTime = new Date().getTime();

  const ormConnections = await createConnections(
    ormConfig as ConnectionOptions[],
  );

  const connectTime = new Date().getTime();

  await ormConnections[0].runMigrations();

  const migrationsTime = new Date().getTime();

  console.log(
    `\nConnected in ${connectTime - startTime}ms - Executed migrations in ${
      migrationsTime - connectTime
    }ms.\n`,
  );
};
