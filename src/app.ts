import 'express-async-errors';

import cookieSession from 'cookie-session';
import type { Application } from 'express';
import express, { json } from 'express';
import helmet from 'helmet';

import { AuthRouter } from './functions/auth.function';
import { EventRouter } from './functions/event.function';
import { UserRouter } from './functions/user.function';

const app: Application = express();

app.use(json());

app.use(helmet());

app.use(
  cookieSession({
    name: 'session',
    secure: false,
    signed: false,
  }),
);

app.use('/users', UserRouter);
app.use('/event', EventRouter);
app.use('/auth', AuthRouter);

app.all('*', async (_, res) => {
  res.status(404).send('route not found');
});

export { app };
