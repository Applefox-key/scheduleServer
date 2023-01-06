import * as schedule from "../modules/schedulesM.js";
import * as subj from "../modules/subjectsM.js";
import express from "express";
import bodyParser from "body-parser";
import { reqWrapper } from "../modules/reqM.js";

const router = express.Router();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//get subjects by scheduleid
router.get("/", async (req, res, next) => {
  let result = await reqWrapper(subj.getSubjects, [req.query.id]);
  res.status(result.status).json(result.json);
});
//add subject
router.post("/", async (req, res, next) => {
  let result = await reqWrapper(subj.createSubject, [req.body.data]);
  res.status(result.status).json(result.json);
});
//update subjects  by id
router.patch("/:id", async (req, res, next) => {
  let result = await reqWrapper(subj.updateSubject, [
    req.params.id,
    req.body.data,
  ]);
  res.status(result.status).json(result.json);
});
//delete subject by id
router.delete("/:id", async (req, res, next) => {
  let result = await reqWrapper(subj.deleteSubject, [req.params.id]);
  res.status(result.status).json(result.json);
});
export default router;
