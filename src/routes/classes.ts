import { Router } from 'express';
import db from '../database';
import { convertHourToMinites } from '../helpers';

const baseUrl = '/classes';

interface ScheduleItem {
  week_day: number,
  from: string,
  to: string,
}

const handleSchedule = (class_id: number) => (scheduleItem: ScheduleItem) => ({
  from: convertHourToMinites(scheduleItem.from),
  to: convertHourToMinites(scheduleItem.to),
  week_day: scheduleItem.week_day,
  class_id,
});

export default Router()
  .post(baseUrl, async (req, res) => {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      price,
      schedule = [],
    } = req.body;

    const trx = await db.transaction();

    try {
      const [user_id] = await trx('users').insert({ name, avatar, whatsapp, bio });
      const [classId] = await trx('classes').insert({ subject, price, user_id });

      const classSchedule = schedule.map(handleSchedule(classId));
      await trx('class_schedules').insert(classSchedule);

      await trx.commit();
      return res.status(201).send();
    } catch (error) {
      await trx.rollback();
      return res.status(400).json({ error: 'Unexpected error while creating new class' });
    }
  });
