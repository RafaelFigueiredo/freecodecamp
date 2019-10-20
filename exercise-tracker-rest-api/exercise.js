const express = require("express");
const mongoose = require("mongoose");
const r = express.Router();

// database connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost/exercise-track");

let connection = mongoose.connection;
connection.on("error", function(err) {
  console.log("database error:", err);
});
connection.once("open", function() {
  console.log("conected to database");
});

// schema
const exerciseSchema = mongoose.Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date }
});

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  exercises: [exerciseSchema]
});

const User = mongoose.model("User", userSchema);

// new-user

r.post("/new-user", function(req, res) {
  let username = req.body.username;
  console.log("username: ", username);

  let newUser = new User({ username: username });
  newUser.save(function(err, data) {
    if (err) {
      console.log("Error saving new user", err);
      res.status(500);
      return;
    }
    console.log(data);
    res.json(data);
  });
});

// add
r.post("/add", function(req, res) {
  let id = req.body.id;
  let newExercise = {
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date
  };

  User.findById(id, function(err, user) {
    if (err) {
      console.log("Error saving new user", err);
      res.status(500);
      return;
    }

    user.exercises.push(newExercise);

    user.save(function(err, data) {
      if (err) {
        console.log("Error saving new user", err);
        res.status(500);
        return;
      }
      console.log(data);
      res.json(data);
    });
  });
});

// log
r.get("/log?", function(req, res) {
  let id = req.query.id;
  let from = req.query.from;
  let to = req.query.to;
  let limit = req.query.limit;

  if (id == undefined) {
    res.json({ error: "invalid id", id: id });
    return;
  }

  User.findById(id).exec(function(err, data) {
    if (err) {
      res.json({ error: "exec" });
      return;
    }
    let exercises = data.exercises
    
    //filter
    if (from != undefined) {
      let dateFrom = new Date(from);
      if (isNaN(dateFrom.getTime())) {
        res.json({ error: "Invalid date from" });
        return;
      }
      
      exercises = exercises.filter(function(item){
        return (item.date >= dateFrom)
      })
    }

    if (to != undefined) {
      let dateTo = new Date(to);
      if (isNaN(dateTo.getTime())) {
        res.json({ error: "Invalid date to" });
        return;
      }
      exercises = exercises.filter(function(item){
        return (item.date <= dateTo)
      })
    }

    if (limit != undefined) {
      if (isNaN(limit)) {
        res.json({ error: "Invalid limit" });
        return;
      }
      
      if(exercises.length > limit){
        exercises = exercises.slice(0, limit)
      }
    }
    
    res.json(exercises)
  });
});

module.exports = r;
