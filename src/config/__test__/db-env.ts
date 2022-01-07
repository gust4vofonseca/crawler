import { ConnectionOptions, createConnections, getConnection } from 'typeorm';
import { ormConfig } from './ormConfig';

beforeAll(async () => {
  await createConnections(ormConfig as ConnectionOptions[]);
});

afterAll(async () => {
  await getConnection().close();
});
