import { Request, Response } from 'express';
import { convertHourToMinites } from '../helpers';
import db from '../database';

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

export const create = async (req: Request, res: Response) => {
  const {
    name, avatar, whatsapp, bio, subject, price, schedule = [],
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
};

export const index = async (req: Request, res: Response) => {
  const filters = req.query;

  const week_day = filters.week_day as string;
  const subject = filters.subject as string;
  const time = filters.time as string;

  if (!week_day || !subject || !time) {
    return res.status(400).json({ error: 'Missing filters to search classes' });
  }

  const timeInMinutes = convertHourToMinites(time);

  const classes = await db('classes')
    .whereExists(function query() {
      this.select('class_schedules.*')
        .from('class_schedules')
        .whereRaw('`class_schedules`.`class_id` = `classes`.`id`')
        .whereRaw('`class_schedules`.`week_day` = ??', [Number(week_day)])
        .whereRaw('`class_schedules`.`from` <= ??', [timeInMinutes])
        .whereRaw('`class_schedules`.`to` > ??', [timeInMinutes]);
    })
    .where('classes.subject', '=', subject)
    .join('users', 'classes.user_id', '=', 'users.id')
    .select(['classes.*', 'users.*']);

  return res.json(classes);
};
