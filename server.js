const express = require("express");
const app = express();
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const session = require("express-session");

const Discord = require("discord.js");
const client = new Discord.Client();

const bot = require("./bot/bot");
const data = require("./data");
const requests = require("./utils/requests");
const creds = require("./data/creds").creds;
const config = require("./config.json");
const views = require("./pres/views");

const db = require("./data/_init");
const datastuff = require("./data/_model")

app.use(session({ secret: "some-random-text" }));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.set("view engine", "ejs");

client.on("ready", () => {
  console.log("Ready!");
});

client.on("message", message => {
  bot.processBotMessage(message);
});

if (process.env.KELNER_BOT) {
  try {
    client.login(JSON.parse(process.env.KELNER_BOT).id);
  } catch (err) {
    console.log(err);
  }
}

var routes = express.Router();

app.get("/", views.home);

app.get("/login", views.login);

app.get("/map", function(req, res) {
  res.sendFile(__dirname + "/public/map.html");
});

app.get("/mapview", views.map);

app.get("/nations", views.nations);

app.get("/logout", function(req, res) {
  if (req.session.player) {
    req.session.player = undefined;
  }
  res.redirect("/login");
});

app.get("/data", function(req, res) {
  data.nations.getNations().then(result => {
    if (result !== null) {
      return res.json({
        land: config.control,
        control: result.map(nation => {
          return {
            id: nation.id,
            name: nation.name,
            player: nation.player,
            desc: nation.desc,
            areas: nation.areas,
            color: nation.color,
            soutiens: nation.soutiens,
            image: nation.image
          };
        })
      });
    }
    return res.status(500).send("Internal error.");
  });
});

app.post("/request/:id", function(req, res) {
  return requests.newRequest(req, res, req.params.id);
});

app.get("/descriptions/:id", function(req, res) {
  res.sendFile(__dirname + "/public/descriptions/" + req.params.id);
});

app.get("/:id", function(req, res) {
  res.sendFile(__dirname + "/public/" + req.params.id);
});

db.sequelize.sync().then(() => {
  const port = process.env.PORT || 8080
  console.log("listening on port " + port);
  app.listen(port);
});
