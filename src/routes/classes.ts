import { Router } from 'express';

const baseUrl = '/classes';

export default Router()
  .post(baseUrl, (req, res) => res.send(req.body));
