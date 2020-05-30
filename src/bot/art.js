const Discord = require("discord.js");

const data = require("../_model");

/*
$oeuvre créer <nom> <description> <image> <édifice>
$édifice voir <id>
$édifice changer <id> <nom> <description> <image> <édifice>
*/

const isValidUrl = (string) => {
  try {
    new URL(string);
  } catch (_) {
    return false;
  }
  return true;
};

const voir = async (client, message, args, player) => {
  if (args.length < 3) return message.channel.send("NO.");
  const edifice = await data.Art.findByPk(args[2]);
  if (edifice === null) return message.channel.send("Pas trouvé.");

  const embed = new Discord.RichEmbed()
    .setTitle(edifice.dataValues.name)
    .setDescription(edifice.dataValues.desc);
  isValidUrl(edifice.dataValues.pic) && embed.setImage(edifice.dataValues.pic);

  message.channel.send(embed);
};
exports.voir = voir;

exports.créer = async (client, message, args, player) => {
  if (args.length < 7) return message.channel.send("Pas compris.");

  let art = null;
  let edifice = await data.Edificio.findByPk(args[5]);

  if (edifice === null) return message.channel.send("Pas trouvé l'édifice.");
  try {
    art = await data.Art.create({
      name: args[2],
      desc: args[3],
      pic: args[4],
      ArtistDiscord: player.dataValues.discord,
      mastodon: args[6],
    });
    await art.setPlace(edifice);
  } catch (err) {
    console.log(err);
    return message.channel.send("Le Kelner.exe a cessé de fonctionner.");
  }
  voir(client, message, [null, null, art.dataValues.id], player);
};

exports.changer = async (client, message, args, player) => {
  if (args.length < 8) return message.channel.send("Pas compris.");

  let art = await data.Art.findByPk(args[2]);
  if (!art) return message.channel.send("Il existe pas ce truc.");
  if (art.dataValues.ArtistDiscord !== player.dataValues.discord)
    return message.channel.send("C'est pas ta création ça wesh.");
  await art.update({
    name: args[3],
    desc: args[4],
    pic: args[5],
    PlaceId: args[6],
    mastodon: args[7],
  });
  voir(client, message, [null, null, art.dataValues.id], player);
};

exports.supprimer = async (client, message, args, player) => {
  if (args.length < 3) return message.channel.send("Pas compris.");

  let art = await data.Art.findByPk(args[2]);
  if (!art) return message.channel.send("Il existe pas ce truc.");
  if (art.dataValues.ArtistDiscord !== player.dataValues.discord)
    return message.channel.send("C'est pas ta création ça wesh.");
  await art.destroy();
  return message.channel.send("La trace de l'oeuvre a été perdue.");
};
