import * as notes from "../modules/notesM.js";
import express from "express";
import bodyParser from "body-parser";
import { reqWrapper } from "../modules/reqM.js";
const router = express.Router();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//create new note
router.post("/", async (req, res, next) => {
  let result = await reqWrapper(notes.createNote, [req.body.data]);

  res.status(result.status).json(result.json);
});
//get notes
router.get("/", async (req, res, next) => {
  let result = await reqWrapper(notes.getNotes, [req.query]);
  res.status(result.status).json(result.json);
});

export default router;
