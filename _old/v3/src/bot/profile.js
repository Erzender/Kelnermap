const Discord = require("discord.js");
const data = require("../_model");
const checkIsNationCitizen = require("../utils/citizenship")
  .checkIsNationCitizen;

/*
$profil voir [<identifiant discord>]
$profil changer [image, description, minecraft] <nouvelle valeur>
*/

const voir = async (client, message, args, player) => {
  if (args.length >= 3) {
    player = await data.Player.findByPk(args[2], {
      include: [
        {
          model: data.Nation,
          as: "Identity",
        },
        { model: data.Nation, as: "Homelands" },
      ],
    });
    if (player === null) {
      return message.channel.send(
        "Connais pas. Faut bien mettre l'id par contre."
      );
    }
  }
  const nation =
    player.Identity === null ? "Aucune" : player.Identity.dataValues.name;
  const citizen = Object.keys(player.dataValues.Homelands).map(
    (v) => player.dataValues.Homelands[v].dataValues.name
  );

  let discordProfile = await message.guild.fetchMember(
    player.dataValues.discord
  );
  const embed = new Discord.RichEmbed()
    .setColor(
      checkIsNationCitizen(player)
        ? player.Identity.dataValues.color
        : "#777777"
    )
    .setAuthor(
      discordProfile.nickname
        ? discordProfile.nickname
        : discordProfile.user.username,
      player.Identity !== null ? player.Identity.pic : null
    )
    .setDescription(player.dataValues.desc)
    .setThumbnail(player.dataValues.picture);
  player.dataValues.minecraft &&
    player.dataValues.minecraft.length &&
    embed.addField("Pseudo Minecraft", player.dataValues.minecraft);
  embed
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
  if (args.length >= 5) {
    await player.update({ minecraft: args[2] });
    await player.update({ desc: args[3] });
    await player.update({ picture: args[4] });
  } else {
    try {
      if (args[2] === "description") {
        await player.update({ desc: args[3] });
      } else if (args[2] === "image") {
        await player.update({ picture: args[3] });
      } else if (args[2] === "minecraft") {
        await player.update({ minecraft: args[3] });
      } else {
        return message.channel.send("Pas compris.");
      }
    } catch (err) {
      console.log(err);
      return message.channel.send("Le Kelner.exe a cessé de fonctionner.");
    }
  }
  message.channel.send("Voilà voilà.");
  voir(client, message, [null, null], player);
};
