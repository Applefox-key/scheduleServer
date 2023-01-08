import * as schedule from "../modules/schedulesM.js";
import express from "express";
import bodyParser from "body-parser";
import { reqWrapper } from "../modules/reqM.js";

const router = express.Router();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//create new scedule
router.post("/", async (req, res, next) => {
  let result = await reqWrapper(schedule.createSchedule, [req.body.data]);
  console.log(result);
  res.status(result.status).json(result.json);
});
//get users scedules
router.get("/", async (req, res, next) => {
  let result = await reqWrapper(schedule.getSchedules, [req.body.data]);
  res.status(result.status).json(result.json);
});
//get users scedule by id
router.get("/:id", async (req, res, next) => {
  console.log("result");
  let result = await reqWrapper(schedule.getScheduleById, [req.params.id]);
  console.log(result);
  res.status(result.status).json(result.json);
});
//update users scedule by id
router.patch("/:id", async (req, res, next) => {
  let result = await reqWrapper(schedule.updateSchedule, [
    req.query.id,
    req.body.data,
  ]);
  res.status(result.status).json(result.json);
});
//delete users scedule by id
router.delete("/:id", async (req, res, next) => {
  let result = await reqWrapper(schedule.deleteSchedule, [req.params.id]);
  res.status(result.status).json(result.json);
});

export default router;
