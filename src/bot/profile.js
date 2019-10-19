const Discord = require("discord.js");
const data = require("../_model");
const checkIsNationCitizen = require("../utils/citizenship")
  .checkIsNationCitizen;

const voir = async (client, message, args, player) => {
  if (args.length >= 3) {
    player = await data.Player.findByPk(args[2], {
      include: [
        {
          model: data.Nation,
          as: "Identity"
        },
        { model: data.Nation, as: "Citizenship" }
      ]
    });
    if (player === null) {
      return message.channel.send("Connais pas.");
    }
  }
  const nation =
    player.Identity === null ? "Aucune" : player.Identity.dataValues.name;
  const citizen = Object.keys(player.dataValues.Citizenship).map(
    v => player.dataValues.Citizenship[v].dataValues.name
  );

  const embed = new Discord.RichEmbed()
    .setColor(
      checkIsNationCitizen(player)
        ? player.Identity.dataValues.color
        : "#777777"
    )
    .setAuthor(
      message.author.username,
      player.Identity !== null ? player.Identity.pic : null
    )
    .setDescription(player.dataValues.desc)
    .setThumbnail(player.dataValues.picture)
    .addField("Réputation", player.dataValues.reputation)
    .addField("Nationalité", nation);

  if (citizen.length > 0) {
    embed.addField(
      "Citoyen de :",
      citizen.reduce((total, next) => {
        return total + ", " + next;
      })
    );
  }
  message.channel.send(embed);
};
exports.voir = voir;

exports.changer = async (client, message, args, player) => {
  if (args.length < 4) {
    return message.channel.send("Pas compris.");
  }
  try {
    if (args[2] === "description") {
      await player.update({ desc: args[3] });
    } else if (args[2] === "image") {
      await player.update({ picture: args[3] });
    } else {
      return message.channel.send("Pas compris.");
    }
  } catch (err) {
    console.log(err);
    return message.channel.send("Le Kelner.exe a cessé de fonctionner.");
  }
  message.channel.send("Voilà voilà.");
  voir(
    client,
    message,
    [null, null],
    player
  )
};
