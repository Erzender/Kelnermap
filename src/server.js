const express = require("express");
const app = express();
const client = require("./bot/_entry").client;
const cors = require("cors");
const cron = require("node-cron");

const db = require("./_data");
const bot = require("./bot/_entry");
const regionInfo = require("./regionInfo.json");
const nationUtils = require("./utils/nations");
const regionUtils = require("./utils/regions");
const cronUtils = require("./utils/cron");

try {
  client.login(JSON.parse(process.env.KELNER_BOT).id);
} catch (err) {
  console.log(err);
}

app.use(cors());

const router = express.Router();

router.get("/", function(req, res) {
  res.sendFile(__dirname + "/app/index.html");
});

router.get("/build.js", function(req, res, next) {
  // res.set('Cache-Control', 'public, max-age=31557600'); // one year
  res.sendFile(__dirname + "/app/dist/build.js");
});

router.get("/styles", function(req, res, next) {
  // res.set('Cache-Control', 'public, max-age=31557600'); // one year
  res.sendFile(__dirname + "/app/styles.css");
});

router.get("/asset/:id", function(req, res, next) {
  res.sendFile(__dirname + "/assets/" + req.params.id);
});

router.get("/mapInfo", async function(req, res, next) {
  let info = {
    regionInfo: regionInfo,
    war: await regionUtils.getWar(),
    nations: await nationUtils.getNationRawList()
  };
  res.json(info);
});

router.get("/nation/:id", async function(req, res, next) {
  res.json(await nationUtils.nationDesc());
});

app.use("/lekelner", router);

db.sequelize.sync().then(() => {
  const port = process.env.PORT || 8081;
  console.log("listening on port " + port);
  app.listen(port);
  setTimeout(cronUtils.battles, 5000);
  cron.schedule("0 * * * *", cronUtils.battles);
});
