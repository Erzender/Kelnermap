const moment = require("moment");
const data = require("../_model");
const bot = require("../bot/_entry").client;
const regions = require("../regioninfo.json");

exports.battles = async () => {
  let battle = await data.Battle.findOne({ where: { status: "initialized" } });
  if (!battle) return;
  try {
    let channel = bot.channels.get(
      JSON.parse(process.env.KELNER_BOT).pvpchannel
    );
  } catch (err) {
    return;
  }
  if (
    moment()
      .add(1, "hour")
      .isAfter(battle.dataValues.date) &&
    moment().isBefore(battle.dataValues.date)
  )
    return channel.send(
      "🏹**LA BATAILLE COMMENCE DANS UNE HEURE**\nElle oppose " +
        (await battle.getInvaders()).reduce(
          (full, invader) => full + "<@" + invader.dataValues.discord + ">, ",
          ""
        ) +
        "à " +
        (await battle.getDefenders()).reduce(
          (full, defender) => full + "<@" + defender.dataValues.discord + ">, ",
          ""
        ) +
        "pour la conquête de la région de **" +
        regions[battle.dataValues.regionTarget].n +
        "**\nVous pouvez toujours la rejoindre en tapant `$région invasion` dans <#" +
        bot.channels.get(JSON.parse(process.env.KELNER_BOT).channel).id +
        ">"
    );
  if (moment().isBefore(battle.dataValues.date)) return;
  battle.status = "started";
  battle.save();
  channel.send(
    "☠️**LA BATAILLE COMMENCE**\nElle oppose " +
      (await battle.getInvaders()).reduce(
        (full, invader) => full + "<@" + invader.dataValues.discord + ">, ",
        ""
      ) +
      "à " +
      (await battle.getDefenders()).reduce(
        (full, defender) => full + "<@" + defender.dataValues.discord + ">, ",
        ""
      ) +
      "pour la conquête de la région de **" +
      regions[battle.dataValues.regionTarget].n +
      "**\nBon courage."
  );
};
