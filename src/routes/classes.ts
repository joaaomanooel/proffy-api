import { Router } from 'express';
import db from '../database';

const baseUrl = '/classes';

export default Router()
  .post(baseUrl, async (req, res) => {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      price,
      // schedule,
    } = req.body;

    const [user_id] = await db('users').insert({ name, avatar, whatsapp, bio });
    await db('classes').insert({ subject, price, user_id });

    return res.send({ user_id });
  });
