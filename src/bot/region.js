const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Discord = require("discord.js");

const data = require("../_model");
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
      `**${player.Identity.dataValues.name}** compte une nouvelle région dans son territoire : **${regions[args[2]].n}**`
    );
  }

  if (owner && (args.length <= 3 || args[3] != "--force")) {
    return message.channel.send(
      `**${
        owner.dataValues.name
      }** détient ce territoire, il faudra le revendiquer avec \`$région revendiquer ${
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
      `**${owner.dataValues.name}** n'a pas de forteresse définie. Par conséquent, vous gagnez la région par chaos technique.
      ${citizens}, lolrekt.`
    );
  }

  if (player.Identity.dataValues.regionTarget !== "") {
    return message.channel
      .send(`La cible est déjà verouillée : **${regions[player.Identity.dataValues.regionTarget].n}**
Va falloir attendre qu'il décongèle.`);
  }

  let citizens = await getNationCitizens(owner);
  citizens = "<@" + citizens.join("><@") + ">";
  player.Identity.update({ regionTarget: args[2] });
  message.channel.send(`Cible verouillée : **${regions[args[2]].n}**
rassemblez vos guerriers, la bataille pour ce territoire aura lieu lundi à 19h au bastion de **${owner.dataValues.name}**.
${citizens}, préparez-vous à la défense.`);
};
