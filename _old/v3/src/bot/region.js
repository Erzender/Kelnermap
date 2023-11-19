const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Discord = require("discord.js");
const moment = require("moment");

const data = require("../_model");
const regionUtils = require("../utils/regions");
const checkIsNationCitizen = require("../utils/citizenship")
  .checkIsNationCitizen;
const getNationCitizens = require("../utils/citizenship").getNationCitizens;
const regions = require("../../config/regionInfo.json");

/*
$région revendiquer [<numéro région>] [--force]
$région céder <numéro région>
$région invasion [rejoindre, combattre, fuir]
$région envahie
$région défendue
*/

/*
let regions = {};
Object.keys(regions1).forEach((region) => {
  regions[region] = {
    ...regions1[region],
    keys:
      Object.keys(regions1).filter((vas) => regions1[vas].suze === region) +
      [region],
  };
});*/

const getClaimableRegions = () =>
  Object.keys(regions).filter((id) => !regions[id].suze);

exports.revendiquer = async (client, message, args, player) => {
  if (!checkIsNationCitizen(player)) {
    return message.channel.send(
      "Il faut être citoyen de sa nation pour ça, bolosse."
    );
  }

  if (args.length <= 2) {
    // Renvoyer la liste des régions contrôlables
    const content = getClaimableRegions().map(
      (id) => id + ": " + regions[id].n
    );
    let embed = new Discord.RichEmbed().addField("Régions", content);
    return message.channel.send(embed);
  }
  if (!getClaimableRegions().find((region) => region === args[2]))
    return message.channel.send("C'est non !");

  let nation = player.Identity;
  if (args.length > 3 && args[3] != "--force")
    nation = await data.Nation.findByPk(args[3]);
  if (!nation) return message.channel.send("C'est pour quelle nation wesh ?");

  let owner = await data.Nation.findOne({
    where: { regions: { [Op.substring]: "[" + args[2] + "]" } },
  });

  if (owner === null) {
    await nation.update({
      regions: nation.dataValues.regions + "[" + args[2] + "]",
    });
    return message.channel.send(
      `**${
        nation.dataValues.name
      }** compte une nouvelle région dans son territoire : **${
        regions[args[2]].n
      }**`
    );
  }

  if (owner.dataValues.id === nation.dataValues.id) {
    return message.channel.send("Tu veux t'envahir toi-même. Idiot bête.");
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
    await owner.update({
      regions: owner.dataValues.regions.replace("[" + args[2] + "]", ""),
    });
    player = await data.Player.findByPk(message.author.id, {
      include: [
        {
          model: data.Nation,
          as: "Identity",
        },
        { model: data.Nation, as: "Homelands" },
      ],
    });
    await nation.update({
      regions: nation.dataValues.regions + "[" + args[2] + "]",
    });

    return message.channel.send(
      `**${owner.dataValues.name}** n'a pas de bastion défini. Par conséquent, vous gagnez la région par chaos technique.
      ${citizens}, lolrekt.`
    );
  }

  let battle = await data.Battle.findOne({
    where: { status: { [Op.in]: ["initialized", "started"] } },
  });
  if (battle) {
    return message.channel.send(
      `Impossible, il y a déjà une bataille de programmée.`
    );
  }

  let date = moment().day(3).startOf("day").add(21, "hours");
  if (moment().isAfter(date))
    return message.channel.send(
      "C'est trop tôt pour déclarer une bataille, attendez demain vers 1:00 !"
    );
  battle = await data.Battle.create({
    regionTarget: args[2],
    stronghold: owner.dataValues.stronghold,
    date,
    BelligerentId: nation.dataValues.id,
    TargetId: owner.dataValues.id,
  });

  let citizens = await getNationCitizens(owner);
  citizens = "<@" + citizens.join("><@") + ">";
  nation.update({ regionTarget: args[2] });
  message.channel.send(`Cible verouillée : **${regions[args[2]].n}**
${citizens}, citoyens de **${
    owner.dataValues.name
  }**, votre nation risque de perdre son territoire si vous ne répondez pas de cet affront !
Il faut utilser \`$région invasion\`, là`);
};

exports.céder = async (client, message, args, player) => {
  let nation = player.Identity;
  if (args.length > 3) nation = await data.Nation.findByPk(args[3]);
  if (!nation) return message.channel.send("C'est pour quelle nation wesh ?");
  if (!checkIsNationCitizen(player)) {
    return message.channel.send("Il faut être citoyen de sa nation pour ça.");
  }
  if (args.length <= 2) {
    return message.channel.send("Oui m'enfin quelle région ?");
  }

  if (
    !getClaimableRegions().find((region) => region === args[2]) ||
    nation.dataValues.regions.search(args[2]) < 0
  )
    return message.channel.send(
      "Ah oui mais là, je crois que ça va pas être possible."
    );

  let battle = await data.Battle.findOne({
    where: {
      status: { [Op.in]: ["initialized", "started"] },
      regionTarget: args[2],
    },
  });
  if (battle !== null)
    return message.channel.send("Oh bah non hé y'a une bataille dessus.");

  await nation.update({
    regions: nation.dataValues.regions.replace("[" + args[2] + "]", ""),
  });

  message.channel.send(
    "**" +
      nation.dataValues.name +
      "** abdique la région de **" +
      regions[args[2]].n +
      "**"
  );
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
    .map((invader) => "<@" + invader.dataValues.discord + "> ");
  invaders = invaders.length > 0 ? invaders : "Personne ?";
  let defenders = await battle
    .getDefenders()
    .map((defender) => "<@" + defender.dataValues.discord + "> ");
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
        regions[await battle.dataValues.regionTarget].n +
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

exports.envahie = async (client, message, args, player) => {
  if (!player.Identity || !checkIsNationCitizen(player))
    return message.channel.send("Euh beh non, t'as pas de nation.");
  let battle = await data.Battle.findOne({ where: { status: "started" } });
  if (battle === null)
    return message.channel.send(
      "L'issue de la dernière bataille est déjà scellée."
    );
  if (player.Identity.id !== (await battle.getBelligerent()).dataValues.id)
    return message.channel.send(
      "Hum mais il faut être de la nation qui envahit."
    );

  let owner = await battle.getTarget();
  let desowned = owner.dataValues.regions;
  await owner.update({
    regions: owner.dataValues.regions.replace(
      "[" + battle.dataValues.regionTarget + "]",
      ""
    ),
  });
  let winner = await battle.getBelligerent();
  let reputation = 10 * (await battle.getDefenders()).length + 10;
  await winner.update({
    regions:
      winner.dataValues.regions + "[" + battle.dataValues.regionTarget + "]",
    reputationPool: winner.dataValues.reputationPool + reputation,
  });
  await battle.update({ status: "victory" });
  await battle.removeInvaders(await battle.getInvaders());
  await battle.removeDefenders(await battle.getDefenders());
  return message.channel.send(
    "Victoire déclarée ! **" +
      winner.dataValues.name +
      "** a conquis la région de **" +
      regions[battle.dataValues.regionTarget].n +
      "**.\n" +
      reputation +
      " points de réputation, bim."
  );
};

exports.défendue = async (client, message, args, player) => {
  if (!player.Identity || !checkIsNationCitizen(player))
    return message.channel.send("Euh beh non, t'as pas de nation.");
  let battle = await data.Battle.findOne({ where: { status: "started" } });
  if (battle === null)
    return message.channel.send(
      "L'issue de la dernière bataille est déjà scellée."
    );
  if (player.Identity.id !== (await battle.getTarget()).dataValues.id)
    return message.channel.send(
      "Hum mais il faut être de la nation qui défend."
    );

  let winner = await battle.getTarget();
  let reputation = 10 * (await battle.getInvaders()).length + 10;
  await winner.update({
    reputationPool: winner.dataValues.reputationPool + reputation,
  });
  await battle.update({ status: "defeat" });
  await battle.removeInvaders(await battle.getInvaders());
  await battle.removeDefenders(await battle.getDefenders());
  return message.channel.send(
    "C'est la défaite ! **" +
      winner.dataValues.name +
      "** conserve la région de **" +
      regions[battle.dataValues.regionTarget].n +
      "**.\nEt ça leur fait " +
      reputation +
      " points de réput'"
  );
};
