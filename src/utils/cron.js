const moment = require("moment");
const data = require("../_model");
const bot = require("../bot/_entry").client;
const regions = require("../regionInfo.json");

const initializedBattles = async channel => {
  let battle = await data.Battle.findOne({ where: { status: "initialized" } });
  if (!battle) return;

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

const forgottenBattles = async channel => {
  let battle = await data.Battle.findOne({ where: { status: "started" } });
  if (
    !battle ||
    moment().isBefore(moment(battle.dataValues.date).add(1, "day"))
  )
    return;
  let winner = await battle.getTarget();
  let reputation = 10 * (await battle.getInvaders()).length + 10;
  await winner.update({
    reputationPool: winner.dataValues.reputationPool + reputation
  });
  await battle.update({ status: "defeat" });
  await battle.removeInvaders(await battle.getInvaders());
  await battle.removeDefenders(await battle.getDefenders());
  channel.send(
    "Je crois qu'il y a une bataille pas validée mdr, du coup on va dire que c'est **" +
      winner.dataValues.name +
      "** qui s'en tire avec " +
      reputation +
      " points de réputation et qui conserve la région de **" +
      regions[battle.dataValues.regionTarget].n +
      "**. Voilà !"
  );
};

exports.battles = async () => {
  let channel;
  try {
    channel = bot.channels.get(JSON.parse(process.env.KELNER_BOT).pvpchannel);
  } catch (err) {
    console.log(err);
    return;
  }
  forgottenBattles(channel);
  initializedBattles(channel);
};
