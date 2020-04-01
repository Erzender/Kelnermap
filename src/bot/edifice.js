const Discord = require("discord.js");

const data = require("../_model");
const regions = require("../regionInfo.json");

/*
$édifice créer <nom> <description> <image> <région/ville>
$édifice voir <id>
$édifice changer <id> <nom> <description> <image> <région/ville>
*/

const isValidUrl = string => {
  try {
    new URL(string);
  } catch (_) {
    return false;
  }
  return true;
};

const voir = async (client, message, args, player) => {
  if (args.length < 3) return message.channel.send("NO.");
  const edifice = await data.Edificio.findByPk(args[2]);
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

  let edificio = null;

  if (!regions[args[5]]) return message.channel.send("Pas trouvé la région.");
  try {
    edificio = await data.Edificio.create({
      name: args[2],
      desc: args[3],
      pic: args[4],
      region: args[5],
      CreatorDiscord: player.dataValues.discord,
      mastodon: args[6]
    });
  } catch (err) {
    console.log(err);
    return message.channel.send("Le Kelner.exe a cessé de fonctionner.");
  }
  voir(client, message, [null, null, edificio.dataValues.id], player);
};

exports.changer = async (client, message, args, player) => {
  if (args.length < 8) return message.channel.send("Pas compris.");

  let edifice = await data.Edificio.findByPk(args[2]);
  if (!edifice) return message.channel.send("Il existe pas ce truc.");
  if (edifice.dataValues.CreatorDiscord !== player.dataValues.discord)
    return message.channel.send("C'est pas ta construction wesh.");
  await edifice.update({
    name: args[3],
    desc: args[4],
    pic: args[5],
    region: args[6],
    mastodon: args[7]
  });
  voir(client, message, [null, null, edifice.dataValues.id], player);
};

exports.supprimer = async (client, message, args, player) => {
  if (args.length < 3) return message.channel.send("Pas compris.");

  let edifice = await data.Edificio.findByPk(args[2]);
  if (!edifice) return message.channel.send("Il existe pas ce truc.");
  if (edifice.dataValues.CreatorDiscord !== player.dataValues.discord)
    return message.channel.send("C'est pas ta construction wesh.");
  await edifice.destroy();
  return message.channel.send("L'édifice de pute à été éliminé.");
};
