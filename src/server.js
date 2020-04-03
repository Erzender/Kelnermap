const express = require("express");
const app = express();
const client = require("./bot/_entry").client;
const cors = require("cors");
const cron = require("node-cron");
const bodyParser = require("body-parser");

const db = require("./_data");
const bot = require("./bot/_entry");
const nationUtils = require("./utils/nations");
const regionUtils = require("./utils/regions");
const cronUtils = require("./utils/cron");
const resource = require("./pres/_entry");

const cities = require("../config/cities.json");
const regions = require("../config/regions.json");

try {
  client.login(JSON.parse(process.env.KELNER_BOT).id);
} catch (err) {
  console.log(err);
}

app.use(cors());
app.set("view engine", "ejs");

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", function (req, res) {
  res.sendFile(__dirname + "/app/index.html");
});

router.get("/build.js", function (req, res, next) {
  // res.set('Cache-Control', 'public, max-age=31557600'); // one year
  res.sendFile(__dirname + "/app/dist/build.js");
});

router.get("/styles", function (req, res, next) {
  // res.set('Cache-Control', 'public, max-age=31557600'); // one year
  res.sendFile(__dirname + "/app/styles.css");
});

router.get("/asset/:id", function (req, res, next) {
  res.sendFile(__dirname + "/assets/" + req.params.id);
});

router.get("/mapInfo", async function (req, res, next) {
  let info = {
    regionInfo: await regionUtils.getRegionActivity(),
    war: await regionUtils.getWar(),
    pvp: await regionUtils.getLeaderBoard(),
    nations: await nationUtils.getNationRawList(),
    cities,
    regions,
  };
  res.json(info);
});

router.get("/nation/:id", async function (req, res, next) {
  res.json(await nationUtils.nationDesc(req.params.id));
});

app.set("views", __dirname + "/views");
router.use("/explorer", resource);

app.use("/lekelner", router);

app.get("/", async function (req, res, next) {
  res.redirect("/lekelner");
});

db.sequelize.sync().then(() => {
  const port = process.env.PORT || 8081;
  console.log("listening on port " + port);
  app.listen(port);
  //setTimeout(cronUtils.battles, 5000);
  cron.schedule("0 * * * *", cronUtils.battles);
});
