import { db_run, db_get, db_all } from "../utils/dbAsync.js";

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
  const request = `SELECT 
                notes.id, lessonid, date, note, img,
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

//delete note by id
export const deleteNote = async (id) => {
  const request = `DELETE FROM notes  WHERE id=?`;
  const params = [id];
  return await db_run(request, params);
};
//update note by id
export const updateNote = async (id, set) => {
  const request = `UPDATE notes SET
                  lessonid=COALESCE(?,lessonid),
                  date=COALESCE(?,date),
                  note=COALESCE(?,note),                
                  img=COALESCE(?,img)
                  WHERE id=?`;
  const params = [set.lessonid, set.date, set.note, set.img, id];
  return await db_run(request, params);
};
