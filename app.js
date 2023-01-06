import express from "express";
import cors from "cors";
import { getUserByToken } from "./modules/usersM.js";
import { User } from "./classes/User.js";

import userRouter from "./routes/users.js";
import schedulesRouter from "./routes/schedules.js";
import lessonsRouter from "./routes/lessons.js";
import subjectsRouter from "./routes/subjects.js";
import notesRouter from "./routes/notes.js";
import router from "./routes/users.js";

export const app = express();
const port = 9000;
process.env.TZ = "Etc/Universal"; // UTC +00:00

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

export async function autorisation(req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .json({ error: "No credentials sent! Please relogin!" });
  }
  const token = req.headers.authorization.split(" ")[1];
  let userRow = await getUserByToken(token);
  if (!userRow)
    return res.status(403).json({ error: "User not found. Please relogin!" });

  let user = User.getInstance();
  user.setToken(token);
  user.setUser(userRow);

  next();
}
app.use(unless(autorisation, "POST/users/login", "POST/users", "GET/Home"));

router.get("/Home", async (req, res, next) => {
  res.status(200).json({ message: "wellcome!" });
});

app.use("/users", userRouter);
app.use("/schedules/:id/lessons", lessonsRouter);
app.use("/schedules/:id/subjects", subjectsRouter);
app.use("/subjects", subjectsRouter);
app.use("/schedules", schedulesRouter);
app.use("/lessons", lessonsRouter);
app.use("/notes", notesRouter);
export function unless(middleware, ...paths) {
  return async function (req, res, next) {
    console.log("REQUEST " + req.method + req.path);
    console.log("________ data", req.body.data);
    if (req.body.data) console.log("________ data", req.body.data);
    if (req.params !== {}) console.log("________ params", req.params);
    if (req.query) console.log("________  query", req.query);
    // console.log(req.body.data);
    const pathCheck = paths.some((path) => path === req.method + req.path);
    pathCheck ? next() : await middleware(req, res, next);
  };
}
export default app;
