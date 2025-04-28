const express = require("express");
const app = express();
const cors = require("cors");
const nanoId = require("nanoid");
require("dotenv").config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const users = [];
const exercises = [];

app.post("/api/users", function (req, res) {
  const { username } = req.body;
  const id = nanoId();
  users.push({ username: username, _id: id });
  res.json({ username: username, _id: id });
});

app.post("/api/users/:_id/exercises", function (req, res) {
  const _id = req.params._id;

  const { description, duration, date } = req.body;
  const dateNew = date ? date : new Date().toDateString()
  const exercise = {
    _id: _id,
    description: description,
    duration: Number(duration),
    date: dateNew,
  };
  
  exercises.push(exercise);
  const user = users.find((user) => user._id === _id)
  const objectReturn = {
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date,
    _id: user._id,
  }
  res.json(objectReturn);
});

app.get("/api/users", function (req, res) {
  res.json(users);
});

app.get("/api/users/:_id/logs", function (req, res) {
  const { from, to, limit } = req.query;
  console.log(from, to, limit)

  const _id = req.params._id;
  const user = users.find((user) => user._id === _id)
  const log = [];
  
  for(let i = 0; i < exercises.length; i++){

    if(from != undefined && to != undefined){
      const fromDate = new Date(from);
      const toDate = new Date(to);
      const date = new Date(exercises[i].date);
      if(fromDate >= date  &&  date <= toDate){
        log.push(exercises[i]);
      }
    }
    if (exercises[i]._id === _id){
      log.push(exercises[i]);
    }

    if(limit != undefined){
      if(limit == log.length){
        break;
      }
    }
  }

  const returnObject = {
    username: user.username,
    count: log.length,
    _id: _id,
    log: log
  }

  res.json(returnObject);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
