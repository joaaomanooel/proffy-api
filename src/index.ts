import express from 'express';
import router from './routes';

const app = express();

app
  .use(express.json())
  .use(router)
  .listen(5000, () => console.log('API listening on port 5000'));
