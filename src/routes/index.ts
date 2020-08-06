/* eslint-disable global-require, @typescript-eslint/no-var-requires */
import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();
const basename = path.basename(module.filename);

fs
  .readdirSync(__dirname)
  .filter(file => ((file.indexOf('.')) !== 0 && (file !== basename)))
  .forEach(file => router.use(require(path.resolve(__dirname, file)).default));

export default router;
