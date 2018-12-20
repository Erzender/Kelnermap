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

routes.get("/", views.home);

routes.get("/login", views.login);

routes.get("/map", function(req, res) {
  res.sendFile(__dirname + "/public/map.html");
});

routes.get("/mapview", views.map)

routes.get("/nations", views.nations)

routes.get("/logout", function(req, res) {
  if (req.session.player) {
    req.session.player = undefined;
  }
  res.redirect("/lekelner/login");
});

routes.get("/data", function(req, res) {
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

routes.post("/request/:id", function(req, res) {
  return requests.newRequest(req, res, req.params.id);
});

routes.get("/descriptions/:id", function(req, res) {
  res.sendFile(__dirname + "/public/descriptions/" + req.params.id);
});

routes.get("/:id", function(req, res) {
  res.sendFile(__dirname + "/public/" + req.params.id);
});

app.use("/lekelner", routes);

app.get("/", function(req, res) {
  res.send("Le site tourne sur /lekelner");
});

var port = process.env.PORT || 8080;
console.log("listening on port " + port);
app.listen(port);
