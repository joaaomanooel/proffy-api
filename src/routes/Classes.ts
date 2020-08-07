import { Router } from 'express';
import { ClassesController } from '../controllers';

const baseUrl = '/classes';

export default Router()
  .post(baseUrl, ClassesController.create)
  .get(baseUrl, ClassesController.index);
