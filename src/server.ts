import 'reflect-metadata';
import '@shared/infra/http/container';
import { app } from '@shared/infra/http/app';
import { createConnections } from 'typeorm';

createConnections().then(() => {
  app.listen(3003, () => {
    console.log('Server started on port 3003.');
  });
});
