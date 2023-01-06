import { db_run, db_get, db_all } from "../utils/dbAsync.js";
import md5 from "md5";
import * as dotenv from "dotenv";
import { User } from "../classes/User.js";
import { reqWrapper } from "./reqM.js";
//notes
// scheduleid integer,
// lessonid integer,
// date  text,
// note text,
// img text,

//create  one note
export const createNote = async (set) => {
  const request = `INSERT INTO notes 
                       (scheduleid, lessonid, date, note,img)
                       VALUES (?,?,?,?,?) 
                       RETURNING id`;
  const params = [set.scheduleid, set.lessonid, set.date, set.note, set.img];
  return await db_get(request, params);
};
//get notes by dates
export const getNotes = async (set) => {
  //   console.log(set);
  //   const request_ = `SELECT  *,
  //    lessons.id as lessid, subjects.name as subjname
  //   FROM notes
  //   LEFT JOIN lessons
  //   ON notes.lessonid = lessons.id
  //   LEFT JOIN subjects
  //   ON lessons.subjectid = subjects.id
  //   WHERE notes.scheduleid=?
  //   `;
  //   //AND date((date)/1000,'unixepoch') BETWEEN  date(?/1000,'unixepoch') AND  date(?/1000,'unixepoch')
  //   //   const params = [set.scheduleid];
  //   const params_ = [set.scheduleid];
  //   console.log(await db_all(request_, params_));

  const request = `SELECT 
                lessonid, date, note, img,
                subjects.name as subjectName,
                color,
                date((date)/1000,'unixepoch') as day,  
                date(?/1000,'unixepoch') as start, 
                date(?/1000,'unixepoch') as end
                FROM notes  
                LEFT JOIN lessons 
                ON notes.lessonid = lessons.id
                LEFT JOIN subjects 
                ON lessons.subjectid = subjects.id
                WHERE notes.scheduleid=?
                AND date((date)/1000,'unixepoch') BETWEEN  date(?/1000,'unixepoch') AND  date(?/1000,'unixepoch')       
                `;
  //   const params = [set.scheduleid];
  const params = [set.start, set.end, set.scheduleid, set.start, set.end];
  return await db_all(request, params);
};
//  AND date((date)/1000,'unixepoch') >= date(?,'unixepoch')
//                     AND date((date)/1000,'unixepoch') <= date(?,'unixepoch')
