import sqlite from "sqlite3";
var sqlite3 = sqlite.verbose();
import md5 from "md5";

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    db.run("PRAGMA foreign_keys=ON");
    db.run("PRAGMA encoding='UTF-8'");
    db.serialize(() => {
      //USERS TABLE
      db.run(
        `CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name text, 
        email text UNIQUE, 
        password text, 
        img text,
        role text,
        CONSTRAINT email_unique UNIQUE (email)
        )`,

        (err) => {
          if (err) {
            // Table already created
          } else {
            // Table just created, creating some rows
            var insert =
              "INSERT INTO users (name, email, password,role) VALUES (?,?,?,?)";
            db.run(insert, [
              "admin",
              "admin@example.com",
              md5("admin123456"),
              "admin",
            ]);
            db.run(insert, [
              "test",
              "test@test.test",
              md5("test123456"),
              "user",
            ]);
          }
        }
      );
      //SESSIONS TABLE
      db.run(
        `CREATE TABLE sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          token text,
          userid integer,
          FOREIGN KEY(userid) REFERENCES users(id)
          ON DELETE CASCADE  ON UPDATE NO ACTION)`,
        (err) => {}
      );
      //SCHEDULES TABLE
      db.run(
        `CREATE TABLE schedules (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name text,
          note text,
          lessonDuration integer,
          weeksNumber text,
          workDays text,
          timeTable text,
          maxLessons integer,
          startDay integer,       
          userid integer,    
          FOREIGN KEY(userid) REFERENCES users(id)
          ON DELETE CASCADE  ON UPDATE NO ACTION)`,
        (err) => {}
      );
      //SUBJECTS TABLE
      db.run(
        `CREATE TABLE subjects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name text,
          color text,
          userid integer,
          scheduleid integer,
          FOREIGN KEY(userid) REFERENCES users(id) 
          ON DELETE CASCADE ON UPDATE NO ACTION,
          FOREIGN KEY(scheduleid) REFERENCES schedules(id)
          ON DELETE CASCADE  ON UPDATE NO ACTION)`,
        (err) => {}
      );
      //LESSONS TABLE
      db.run(
        `CREATE TABLE lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scheduleid integer,
      subjectid integer,
      ordNum  integer,
      weekDay integer,
      weekNumber integer,
      FOREIGN KEY(scheduleid) REFERENCES schedules(id) 
      ON DELETE CASCADE  ON UPDATE NO ACTION,
      FOREIGN KEY(subjectid) REFERENCES subjects(id)
      ON DELETE CASCADE  ON UPDATE NO ACTION)`,
        (err) => {}
      );
      //NOTES TABLE
      db.run(
        `CREATE TABLE notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scheduleid integer,
      lessonid integer,
      date  text,
      note text,
      img text,
      FOREIGN KEY(scheduleid) REFERENCES schedules(id) 
      ON DELETE CASCADE ON UPDATE NO ACTION,
      FOREIGN KEY(lessonid) REFERENCES lessons(id)
      ON DELETE CASCADE  ON UPDATE NO ACTION)`,
        (err) => {}
      );
    });
  }
});

export default db;
