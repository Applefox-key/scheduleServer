import { db_run, db_get, db_all } from "../utils/dbAsync.js";
import md5 from "md5";
import * as dotenv from "dotenv";
import { User } from "../classes/User.js";
import { reqWrapper } from "./reqM.js";

//lessons
// scheduleid integer,
// subjectid integer,
// ordNum  integer,
// weekDay integer,
//weekNumber integer,

//create  one lesson to the schedule
export const createLesson = async (set) => {
  const request = `INSERT INTO lessons 
                     (scheduleid, subjectid, ordNum, weekDay, weekNumber)
                     VALUES (?,?,?,?,?) 
                     RETURNING id`;
  const params = [
    set.scheduleid,
    set.subjectid,
    set.ordNum,
    set.weekDay,
    set.weekNumber,
  ];
  return await db_get(request, params);
};
//get lessons by scheduleid
export const getLessons = async (scheduleid) => {
  const request = `SELECT lessons.scheduleid, subjectid, ordNum,weekDay, subjects.name AS subjectName color, weekNumber
                  FROM lessons LEFT JOIN subjects
                  ON lessons.subjectid = subjects.id
                  WHERE scheduleid=?`;

  const params = [scheduleid];
  return await db_all(request, params);
};

//get lessons by scheduleid and week number
export const getLessonsByWeek = async (scheduleid, weekNumber) => {
  const request = `SELECT *
                  FROM lessons 
                  WHERE scheduleid=? AND weekNumber=?`;

  const params = [scheduleid, weekNumber];
  return await db_all(request, params);
};

// `SELECT collections.id , collections.name AS name, categoryid, collections.note,
// categories.name AS category,
// content.note AS note_cont, content.id AS id_cont, question,answer
//    FROM collections  LEFT JOIN  content
//get lessons by scheduleid by days
export const getLessonsByDays = async (scheduleid) => {
  const request = `SELECT lessons.id, lessons.scheduleid, subjectid, ordNum, weekDay, weekNumber, subjects.name AS subjectName, color 
                  FROM lessons LEFT JOIN subjects
                  ON lessons.subjectid = subjects.id
                  WHERE lessons.scheduleid=?   
                  ORDER BY weekNumber ASC, weekDay ASC, ordNum ASC`;

  const params = [scheduleid];

  let arrLess = await db_all(request, params);

  let newArr = [[[]], [[]], [[]], [[]], [[]], [[]], [[]]];
  if (!arrLess) return newArr;
  arrLess.forEach((element) => {
    if (newArr[element.weekDay].length < element.weekNumber)
      newArr[element.weekDay].push([[]]);

    newArr[element.weekDay][element.weekNumber - 1][element.ordNum] = element;
    // newArr[element.weekDay].push(element);
  });
  return newArr;
  // return await db_all(request, params);
};
//get lessons by scheduleid  one week by days
export const getLessonsByWeeksByDays = async (scheduleid, weekNumber) => {
  const request = `SELECT lessons.id, lessons.scheduleid, subjectid, ordNum, weekDay, weekNumber, subjects.name AS subjectName, color 
                  FROM lessons LEFT JOIN subjects
                  ON lessons.subjectid = subjects.id
                  WHERE lessons.scheduleid=? AND weekNumber=?
                  ORDER BY weekDay ASC, ordNum ASC`;

  const params = [scheduleid, weekNumber];
  let arrLess = await db_all(request, params);

  let newArr = [[], [], [], [], [], [], []];
  if (!arrLess) return newArr;
  arrLess.forEach((element) => {
    newArr[element.weekDay][element.ordNum] = element;
    // newArr[element.weekDay].push(element);
  });
  return newArr;
  // return await db_all(request, params);
};
//delete all lessons by scheduleid
export const deleteAllLesson = async (scheduleid, weekNumber) => {
  let request = `DELETE FROM lessons  WHERE scheduleid=?`;
  if (weekNumber) request = request + "AND weekNumber=?";

  let params = [scheduleid];
  if (weekNumber) params.push(weekNumber);
  return await db_run(request, params);
};
//delete lessons by id
export const deleteLesson = async (id) => {
  const request = `DELETE FROM lessons  WHERE id=?`;
  const params = [id];
  return await db_run(request, params);
};
//update lesson by id
export const updateLesson = async (id, set) => {
  console.log("id " + id);
  console.log("set");
  console.log(set);

  const request = `UPDATE lessons SET
                    subjectid=COALESCE(?,subjectid),
                    ordNum=COALESCE(?,ordNum),  
                    weekDay=COALESCE(?,weekDay)
                    WHERE id=?`;
  const params = [set.subjectid, set.ordNum, set.weekDay, id];
  return await db_run(request, params);
};
