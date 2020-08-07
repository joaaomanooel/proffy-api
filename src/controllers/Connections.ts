import { Request, Response } from 'express';
import db from '../database';

export const index = async (req: Request, res: Response) => {
  const [{ total }] = await db('connections').count('* as total');
  return res.json({ total });
};

export const create = async (req: Request, res: Response) => {
  const { user_id } = req.body;
  await db('connections').insert({ user_id });

  return res.status(201).send();
};
