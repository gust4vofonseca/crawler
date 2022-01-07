import 'express-async-errors';
import path from 'path';
import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import cors from 'cors';
import routes from '@shared/infra/http/routes';
import AppError from '@shared/errors/AppError';
import { writeApplicationLogError } from '@shared/utils/writeApplicationLogError';

const app = express();

const url =
  process.env.NODE_ENV === 'dev'
    ? 'http://localhost:3000'
    : process.env.NODE_ENV === 'hom'
    ? 'https://app-hom.precato.com.br'
    : 'https://app.precato.com.br';

app.use(cors({ origin: url }));
app.use(express.json() as RequestHandler);

app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    writeApplicationLogError(err.message, err.statusCode, err.module);

    console.log(err);

    return response
      .status(err.statusCode)
      .json({ message: err.message, status: err.statusCode });
  }

  writeApplicationLogError(JSON.stringify(err), 500, 'default');

  console.log(err);

  return response
    .status(500)
    .json({ message: 'Internal server error', status: 500 });
});

export { app };
