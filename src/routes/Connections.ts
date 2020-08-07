import { Router } from 'express';
import { ConnectionsController } from '../controllers';

const baseUrl = '/connections';

export default Router()
  .post(baseUrl, ConnectionsController.create)
  .get(baseUrl, ConnectionsController.index);
