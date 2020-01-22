const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Discord = require("discord.js");
const moment = require("moment");

const data = require("../_model");
const regionUtils = require("../utils/regions");
const checkIsNationCitizen = require("../utils/citizenship")
  .checkIsNationCitizen;
const getNationCitizens = require("../utils/citizenship").getNationCitizens;
const regions1 = require("../regionInfo.json");

let regions = {};
Object.keys(regions1).forEach(region => {
  regions[region] = {
    ...regions1[region],
    keys:
      Object.keys(regions1).filter(vas => regions1[vas].suze === region) +
      [region]
  };
});

const getClaimableRegions = () =>
  Object.keys(regions).filter(id => !regions[id].suze);

exports.revendiquer = async (client, message, args, player) => {
  if (!player.Identity) {
    return message.channel.send("Faut une nation d'abord : `$nation fonder`");
  }
  if (!checkIsNationCitizen(player)) {
    return message.channel.send(
      "Il faut être citoyen de sa nation pour ça, bolosse."
    );
  }

  if (args.length <= 2) {
    const content = getClaimableRegions().map(id => id + ": " + regions[id].n);
    let embed = new Discord.RichEmbed().addField("Régions", content);
    return message.channel.send(embed);
  }
  if (!getClaimableRegions().find(region => region === args[2]))
    return message.channel.send("C'est non !");

  let owner = await data.Nation.findOne({
    where: { regions: { [Op.substring]: args[2] } }
  });

  if (owner === null) {
    await player.Identity.update({
      regions: player.Identity.dataValues.regions + regions[args[2]].keys
    });
    return message.channel.send(
      `**${
        player.Identity.dataValues.name
      }** compte une nouvelle région dans son territoire : **${
        regions[args[2]].n
      }**`
    );
  }

  if (owner && (args.length <= 3 || args[3] != "--force")) {
    return message.channel.send(
      `**${owner.dataValues.name}** détient **${
        regions[args[2]].n
      }**, il faudra revendiquer ce territoire avec \`$région revendiquer ${
        args[2]
      } --force\``
    );
  }

  if (owner.dataValues.stronghold === null) {
    let citizens = await getNationCitizens(owner);
    citizens = "<@" + citizens.join("><@") + ">";
    let desowned = owner.dataValues.regions;
    regions[args[2]].keys
      .split("")
      .forEach(key => (desowned = desowned.replace(key, "")));
    await owner.update({
      regions: desowned
    });
    player = await data.Player.findByPk(message.author.id, {
      include: [
        {
          model: data.Nation,
          as: "Identity"
        },
        { model: data.Nation, as: "Citizenship" }
      ]
    });
    await player.Identity.update({
      regions: player.Identity.dataValues.regions + regions[args[2]].keys
    });

    return message.channel.send(
      `**${owner.dataValues.name}** n'a pas de bastion défini. Par conséquent, vous gagnez la région par chaos technique.
      ${citizens}, lolrekt.`
    );
  }

  let battle = await data.Battle.findOne({ where: { status: "initialized" } });
  if (battle) {
    return message.channel.send(
      `Impossible, il y a déjà une bataille de programmée.`
    );
  }

  battle = await data.Battle.create({
    regionTarget: args[2],
    stronghold: owner.dataValues.stronghold,
    date: moment()
      .day(3)
      .startOf("day")
      .add(21, "hours")
  });

  await battle.setBelligerent(player.Identity);
  await battle.setTarget(owner);

  let citizens = await getNationCitizens(owner);
  citizens = "<@" + citizens.join("><@") + ">";
  player.Identity.update({ regionTarget: args[2] });
  message.channel.send(`Cible verouillée : **${regions[args[2]].n}**
${citizens}, citoyens de **${
    owner.dataValues.name
  }**, votre nation risque de perdre son territoire si vous ne répondez pas de cet affront !
Il faut utilser \`$région invasion\`, là`);
};

exports.invasion = async (client, message, args, player) => {
  let battle = await data.Battle.findOne({ where: { status: "initialized" } });
  if (battle === null)
    return message.channel.send("Imbécile, il n'y a pas de bataille.");
  if (
    args.length < 3 ||
    (args[2] !== "rejoindre" && args[2] !== "combattre" && args[2] !== "fuir")
  )
    return message.channel.send(
      "Il faut combattre ou rejoindre l'invasion, en fait. Ou la fuir haha."
    );
  await battle.removeInvader(player);
  await battle.removeDefender(player);
  if (args[2] === "rejoindre") await battle.addInvader(player);
  else if (args[2] === "combattre") await battle.addDefender(player);
  let invaders = await battle
    .getInvaders()
    .map(invader => "<@" + invader.dataValues.discord + "> ");
  invaders = invaders.length > 0 ? invaders : "Personne ?";
  let defenders = await battle
    .getDefenders()
    .map(defender => "<@" + defender.dataValues.discord + "> ");
  defenders = defenders.length > 0 ? defenders : "Personne ?";

  const embed = new Discord.RichEmbed()
    .setColor(
      checkIsNationCitizen(player)
        ? player.Identity.dataValues.color
        : "#777777"
    )
    .setDescription(
      "Nouvelle configuration de bataille ! Rejoignez la bataille avec `$région invasion rejoindre` ou `$région invasion combattre`. Elle aura lieu " +
        regionUtils.getDateFormatted(battle.dataValues.date) +
        " ! " +
        "Il s'agit de la région de **" +
        regions1[await battle.dataValues.regionTarget].n +
        "** que **" +
        (await battle.getBelligerent()).dataValues.name +
        "** voudrait amputer à **" +
        (await battle.getTarget()).dataValues.name +
        "**."
    )
    .addField("Envahisseurs", invaders)
    .addField("Défenseurs", defenders);
  message.channel.send(embed);
};
