require("dotenv").config();
const { cron } = require("./cron");
const { Commander } = require("./commands");
const { db } = require("./data");
const { client } = require("./discordbot");

setTimeout(async () => {
  const commander = new Commander(db, client);
  cron(commander);
}, 2000);
