import * as less from "../modules/lessonsM.js";
import express from "express";
import bodyParser from "body-parser";
import { reqWrapper } from "../modules/reqM.js";
import { getOrAddSubjects } from "../modules/subjectsM.js";
import e from "express";

const router = express.Router();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//create new lessons scedule
router.post("/", async (req, res, next) => {
  let result = await getOrAddSubjects(req.body.data);
  if (!result.error) {
    result = await reqWrapper(less.createLesson, [
      { ...req.body.data, subjectid: result },
    ]);
  }
  res.status(result.status).json(result.json);
});

//get lessons by scheduleid by days
router.get("/", async (req, res, next) => {
  let result = await reqWrapper(less.getLessonsByDays, [req.query.id]);
  res.status(result.status).json(result.json);
});
//get lessons by scheduleid by days
router.get("/weeks", async (req, res, next) => {
  let result = await reqWrapper(less.getLessonsByWeeksByDays, [
    req.query.id,
    req.query.weekNumber,
  ]);
  res.status(result.status).json(result.json);
});

//delete all lesson by scheduleid
router.delete("/all", async (req, res, next) => {
  let result = await reqWrapper(less.deleteAllLesson, [
    req.query.scheduleid,
    req.query.weekNumber,
  ]);
  res.status(result.status).json(result.json);
});
//delete lesson by id
router.delete("/:id", async (req, res, next) => {
  let result = await reqWrapper(less.deleteLesson, [req.query.id]);
  res.status(result.status).json(result.json);
});

//copy  lessons from week to week
router.patch("/copy", async (req, res, next) => {
  let result = await reqWrapper(less.getLessonsByWeek, [
    req.body.data.scheduleid,
    req.body.data.weekNumberFrom,
  ]);
  if (!result.error) {
    console.log(result);
    let err = false;
    result.json.resultData.forEach(async (element) => {
      let smallres = await reqWrapper(less.createLesson, [
        { ...element, weekNumber: req.body.data.weekNumberTo },
      ]);
      if (smallres.error) {
        err = true;
        res.status(result.status).json(result.json);
        return;
      }
    });
    if (!err) res.status(200).json({ message: "success" });
  }
});

//update one lesson
router.patch("/:id", async (req, res, next) => {
  let result = await getOrAddSubjects(req.body.data);
  if (!result.error) {
    console.log(result);

    result = await reqWrapper(less.updateLesson, [
      req.query.id,
      { ...req.body.data, subjectid: result },
    ]);
  }
  res.status(result.status).json(result.json);
});

//update (for reordering) lessons arr
router.patch("/", async (req, res, next) => {
  let arr = req.body.data;
  if (!Array.isArray(arr)) {
    res.status(400).json({ error: "datas type is not ARRAY" });
    return;
  }
  let mainResult = [];
  if (arr.length) {
    console.log("updateLessArr");
    for (let i = 0; i < arr.length; i++) {
      let params = { ordNum: arr[i].ordNum, weekDay: arr[i].weekDay };
      let result = await reqWrapper(less.updateLesson, [arr[i].id, params]);
      console.log("updateLessArr_result id=" + arr[i].id);
      console.log(result);
      mainResult.push(result);
    }
    console.log("mainResult");
    console.log(mainResult);

    res.status(200).json({ message: "ok" });
    // if (result) res.status(result.status).json(result.json);
    // else res.status(200).json({ message: "array is empty" });
  } else res.status(400).json({ error: "body is empty" });
});

export default router;
