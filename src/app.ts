import express, { Express } from 'express';
import cors from 'cors';
import routes from './routes';
import { requestLogger } from './middleware/request-logger.middleware';
import { errorHandler } from './middleware/error-handler.middleware';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use(routes);

app.use(errorHandler);

export default app;
