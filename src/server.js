const express = require("express");
const app = express();
const client = require("./bot/_entry").client;
const cors = require("cors");

const db = require("./_data");
const bot = require("./bot/_entry");

try {
  client.login(JSON.parse(process.env.KELNER_BOT).id);
} catch (err) {
  console.log(err);
}

app.use(cors());

app.get("/lekelner/", function(req, res) {
  res.sendFile(__dirname + "/app/index.html");
});

app.get("/lekelner/build.js", function(req, res, next) {
  // res.set('Cache-Control', 'public, max-age=31557600'); // one year
  res.sendFile(__dirname + "/app/dist/build.js");
});

app.get("/lekelner/styles", function(req, res, next) {
  // res.set('Cache-Control', 'public, max-age=31557600'); // one year
  res.sendFile(__dirname + "/app/styles.css");
});

app.get("/lekelner/map", function(req, res, next) {
  // res.set('Cache-Control', 'public, max-age=31557600'); // one year
  res.sendFile(__dirname + "/assets/map.jpg");
});

app.get("/lekelner/asset/:id", function(req, res, next) {
  res.sendFile(__dirname + "/assets/" + req.params.id);
});

db.sequelize.sync().then(() => {
  const port = process.env.PORT || 8081;
  console.log("listening on port " + port);
  app.listen(port);
});
