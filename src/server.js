require("dotenv").config();
const { cron } = require("./cron");
const { Commander } = require("./commands");
const { db } = require("./data");

setTimeout(async () => {
  const commander = new Commander(db);
  cron(commander);
}, 2000);
