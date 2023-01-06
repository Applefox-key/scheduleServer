import { db_run, db_get, db_all } from "../utils/dbAsync.js";
import md5 from "md5";
import * as dotenv from "dotenv";
import { User } from "../classes/User.js";
import { reqWrapper } from "./reqM.js";
//subjects
// name text,
// color text,
// userid integer,
// scheduleid integer,

//create  one subject to the schedule
export const createSubject = async (set) => {
  const userid = User.getInstance().user.id;
  const request = `INSERT INTO subjects 
                       (name, color, userid, scheduleid)
                       VALUES (?,?,?,?) 
                       RETURNING id`;
  const params = [set.name, set.color ? set.color : "", userid, set.scheduleid];
  return await db_get(request, params);
};

//get subjects by scheduleid
export const getSubjects = async (scheduleid) => {
  console.log("scheduleid");
  console.log(scheduleid);

  const request = `SELECT * FROM subjects  WHERE scheduleid=?`;
  const params = [scheduleid];
  return await db_all(request, params);
};

//get subjects by scheduleid and name
export const getSubjectsByName = async (scheduleid, subjectName) => {
  const request = `SELECT * FROM subjects  WHERE scheduleid=?  AND name = ?`;
  const params = [scheduleid, subjectName];
  return await db_get(request, params);
};

//update subject by id
export const updateSubject = async (id, set) => {
  const request = `UPDATE subjects SET
                    name =COALESCE(?,name), 
                    color=COALESCE(?,color)
                    WHERE id=?`;
  const params = [set.name, set.color, id];
  return await db_run(request, params);
};

//delete subject by id
export const deleteSubject = async (id) => {
  const userid = User.getInstance().user.id;
  const request = `DELETE FROM subjects  WHERE id=?`;
  const params = [id];
  return await db_run(request, params);
};

//get subjects by scheduleid return id or error
export const getOrAddSubjects = async (set) => {
  if (set.subjectid) return set.subjectid;
  let tmpRes = await reqWrapper(getSubjectsByName, [
    set.scheduleid,
    set.subjectName,
  ]);

  if (!tmpRes.error) return tmpRes.json.resultData.id;
  //there's no such name -> create
  tmpRes = await reqWrapper(createSubject, [
    { name: set.subjectName, scheduleid: set.scheduleid },
  ]);

  if (!tmpRes.error) return tmpRes.json.resultData.id;
  return tmpRes;
};
