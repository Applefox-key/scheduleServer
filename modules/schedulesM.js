import { db_run, db_get, db_all } from "../utils/dbAsync.js";
import md5 from "md5";
import * as dotenv from "dotenv";
import { User } from "../classes/User.js";

// name text,
// note text,
// lessonDuration integer,
// weeksNumber integer,
// workDays text, []
// timeTable text, []
// maxLessons integer,
// startDay integer,
// userid integer,

//create users one schedule     `INSERT INTO collections (name, note, userid, categoryid) VALUES (?,?,?,?) RETURNING id`,
export const createSchedule = async (set) => {
  const userid = User.getInstance().user.id;
  const request = `INSERT INTO schedules 
                   (name, note, lessonDuration, weeksNumber, workDays, timeTable, maxLessons, startDay, userid)
                   VALUES (?,?,?,?,?,?,?,?,?) 
                   RETURNING id`;
  const params = [
    set.name,
    set.note,
    set.lessonDuration,
    JSON.stringify(set.weeksNumber),
    JSON.stringify(set.workDays),
    JSON.stringify(set.timeTable),
    set.maxLessons,
    set.startDay,
    userid,
  ];
  return await db_get(request, params);
};
//get users all schedule
export const getSchedules = async () => {
  const userid = User.getInstance().user.id;
  const request = `SELECT * FROM schedules  WHERE userid=?`;
  const params = [userid];
  return await db_all(request, params);
};
//get users one schedule by id
export const getScheduleById = async (id) => {
  const userid = User.getInstance().user.id;
  const request = `SELECT * FROM schedules  WHERE userid=? AND id = ?`;
  const params = [userid, id];
  return await db_get(request, params);
};
//update users one schedule by id
export const updateSchedule = async (id, set) => {
  console.log(set.startDay);

  const userid = User.getInstance().user.id;
  const request = `UPDATE schedules set
                    name =COALESCE(?,name), 
                    note=COALESCE(?,note), 
                    lessonDuration=COALESCE(?,lessonDuration),
                    weeksNumber=COALESCE(?,weeksNumber),
                    workDays=COALESCE(?,workDays),
                    timeTable=COALESCE(?,timeTable),
                    maxLessons=COALESCE(?,maxLessons),
                    startDay=COALESCE(?,startDay)
                    WHERE userid=? AND id = ?`;

  const params = [
    set.name,
    set.note,
    set.lessonDuration,
    JSON.stringify(set.weeksNumber),
    JSON.stringify(set.workDays),
    JSON.stringify(set.timeTable),
    set.maxLessons,
    set.startDay,
    userid,
    id,
  ];
  return await db_run(request, params);
};
//delete users one schedule by id
export const deleteSchedule = async (id) => {
  const userid = User.getInstance().user.id;
  const request = `DELETE FROM schedules  WHERE userid=? AND id = ?`;
  const params = [userid, id];
  return await db_run(request, params);
};
