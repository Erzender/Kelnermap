const Discord = require("discord.js");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const data = require("../_model");
const checkIsNationCitizen = require("../utils/citizenship")
  .checkIsNationCitizen;
const strongholdUpdate = require("../utils/stronghold").update;
const botProfile = require("./profile");

/*
$nation fonder <Nom>
$nation rejoindre <numéro nation>
$nation brexit [--force]
$nation lister
$nation voir <numéro nation>
$nation changer [nom, couleur, decription, image, bastion] <nouvelle valeur>
$nation naturaliser <identifiant discord>
$nation radier <identifiant discord>
$nation distribuer <points de réputation> <identifiant discord>
*/

exports.fonder = async (client, message, args, player) => {
  if (args.length < 3) {
    return message.channel.send("Pas compris.");
  }
  if (player.Identity !== null) {
    return message.channel.send("T'as déjà une nation fdp.");
  }
  let nation = null;
  try {
    if (args.length < 10) {
      nation = await data.Nation.create({ name: args[2] });
    } else {
      let arg = args[6].split("www.youtube.com/watch?v=");
      arg = arg.length > 1 ? arg[1] : arg[0];
      arg = arg.split("youtu.be/");
      arg = arg.length > 1 ? arg[1] : arg[0];
      nation = await data.Nation.create({
        name: args[2],
        desc: args[3],
        pic: args[4],
        color: args[5],
        hymne: arg,
        stronghold:
          parseInt(args[7]) +
          " X | " +
          parseInt(args[8]) +
          " Y | " +
          parseInt(args[9]) +
          " Z",
      });
    }
    await player.addHomeland(nation);
    await player.setIdentity(nation);
  } catch (err) {
    console.log(err);
    return message.channel.send("Le Kelner.exe a cessé de fonctionner.");
  }
  client.channels
    .get(JSON.parse(process.env.KELNER_BOT).channel)
    .send(
      "<@" +
        message.author.id +
        "> a chié une nation nouvelle : " +
        nation.dataValues.name +
        "."
    );
  voir(
    client,
    message,
    [null, null, (await player.getIdentity()).dataValues.id],
    player
  );
};

exports.rejoindre = async (client, message, args, player) => {
  if (args.length < 3) {
    return message.channel.send("Pas compris.");
  }
  if (player.Identity !== null) {
    return message.channel.send("T'as déjà une nation fdp.");
  }
  let nation = await data.Nation.findByPk(args[2]);
  if (nation === null)
    return message.channel.send("Pas trouvé, essaye de `$nation lister` déjà.");
  await player.setIdentity(nation);
  message.channel.send(
    "<@" +
      player.dataValues.discord +
      "> se revendique désormais de **" +
      nation.dataValues.name +
      "**."
  );
};

exports.brexit = async (client, message, args, player) => {
  if (player.Identity === null) {
    return message.channel.send("Vous brexitez.");
  }
  let citizens = null;
  try {
    citizens = await data.Player.findAll({
      include: {
        model: data.Nation,
        as: "Identity",
        where: { id: player.Identity.dataValues.id },
      },
    });
  } catch (err) {
    console.log(err);
  }
  if (
    Object.keys(citizens).length <= 1 &&
    args.length < 3 &&
    args[2] !== "--force"
  ) {
    return message.channel.send(
      "Déso mais t'es le dernier, ça va supprimer la nation, faut faire `$nation brexit --force`."
    );
  }
  if (Object.keys(citizens).length <= 1) {
    let name = player.Identity.dataValues.name;
    await player.Identity.destroy();
    client.channels
      .get(JSON.parse(process.env.KELNER_BOT).channel)
      .send(
        "C'est la fin de la grande nation qu'était " +
          name +
          ". Puisse l'oubli l'accueillir durablement."
      );
  }
  await player.setIdentity(null);
  message.channel.send(
    "Et hop, vous êtes apatride <@" + message.author.id + ">."
  );
};

const voir = async (client, message, args, player) => {
  if (args.length < 3) {
    return message.channel.send(
      "T'as pas dit quelle nation. Essaye `$nation lister` d'abord"
    );
  }
  const nation = await data.Nation.findByPk(args[2]);
  if (nation === null) {
    return message.channel.send("Connais pas.");
  }
  const citizens = await data.Player.findAll({
    include: [
      {
        model: data.Nation,
        as: "Homelands",
        where: { id: nation.dataValues.id },
      },
    ],
  });
  const embed = new Discord.RichEmbed()
    .setColor(nation.dataValues.color)
    .setAuthor(nation.dataValues.name)
    .setDescription(nation.dataValues.desc)
    .setThumbnail(nation.dataValues.pic)
    .addField("ID", nation.dataValues.id)
    .addField("Réputation disponible", nation.dataValues.reputationPool)
    .addField("Bastion", nation.dataValues.stronghold);
  if (citizens.length > 0) {
    embed.addField(
      "Citoyens",
      Object.keys(citizens)
        .map((i) => message.guild.members.get(citizens[i].dataValues.discord))
        .reduce((prev, citizen) => prev + ", " + citizen)
    );
  }
  message.channel.send(embed);
};

exports.voir = voir;

exports.changer = async (client, message, args, player) => {
  if (args.length < 4) {
    return message.channel.send("Pas compris.");
  }

  let nation = player.dataValues.Identity;
  try {
    if (args.length >= 11) {
      nation = player.Homelands.filter(
        (nat) => nat.dataValues.id.toString() === args[2]
      );
      if (nation.length === 0)
        return message.channel.send("You have no power here.");

      nation = nation[0];
      let arg = args[7].split("www.youtube.com/watch?v=");
      arg = arg.length > 1 ? arg[1] : arg[0];
      arg = arg.split("youtu.be/");
      arg = arg.length > 1 ? arg[1] : arg[0];
      await nation.update({
        name: args[3],
        desc: args[4],
        pic: args[5],
        color: args[6],
        hymne: arg,
        stronghold:
          parseInt(args[8]) +
          " X | " +
          parseInt(args[9]) +
          " Y | " +
          parseInt(args[10]) +
          " Z",
      });
    } else {
      if (!checkIsNationCitizen(player)) {
        return message.channel.send("You have no power here.");
      }
      if (args[2] === "couleur" && /^#(?:[0-9a-f]{3}){1,2}$/i.test(args[3])) {
        await player.dataValues.Identity.update({ color: args[3] });
      } else if (args[2] === "nom") {
        await player.dataValues.Identity.update({ name: args[3] });
      } else if (args[2] === "image") {
        await player.dataValues.Identity.update({ pic: args[3] });
      } else if (args[2] == "description") {
        await player.dataValues.Identity.update({ desc: args[3] });
      } else if (args[2] == "hymne") {
        let arg = args[3].split("www.youtube.com/watch?v=");
        arg = arg.length > 1 ? arg[1] : arg[0];
        arg = arg.split("youtu.be/");
        arg = arg.length > 1 ? arg[1] : arg[0];
        await player.dataValues.Identity.update({ hymne: arg });
      } else if (args[2] == "bastion") {
        if (args.length < 6) {
          return message.channel.send(
            "Il faut 3 coordonnées (X, Y, Z).\n`$nation changer bastion 1 2 3`"
          );
        }
        await player.dataValues.Identity.update({
          stronghold:
            parseInt(args[3]) +
            " X | " +
            parseInt(args[4]) +
            " Y | " +
            parseInt(args[5]) +
            " Z",
        });
      } else {
        return message.channel.send("Pas compris.");
      }
    }
  } catch (err) {
    console.log(err);
    return message.channel.send(
      "Le Kelner.exe a cessé de fonctionner. Nom de nation déjà pris peut-être ?"
    );
  }
  voir(client, message, [null, null, nation.dataValues.id], player);
  message.channel.send("Voilà voilà.");
};

exports.lister = async (client, message, args, player) => {
  let nations = await data.Nation.findAll();
  let format = Object.keys(nations)
    .map((i) => ({
      id: nations[i].dataValues.id,
      name: nations[i].dataValues.name,
    }))
    .reduce((prev, next) => prev + "\n" + next.name + " (" + next.id + ")", "");
  const embed = new Discord.RichEmbed()
    .setTitle("Nations")
    .setDescription(format);
  message.channel.send(embed);
};

exports.naturaliser = async (client, message, args, player) => {
  if (args.length < 3) {
    return message.channel.send("Pas compris.");
  }
  if (!checkIsNationCitizen(player)) {
    return message.channel.send("You have no power here.");
  }
  let targetPlayer = await data.Player.findByPk(args[2]);
  if (targetPlayer === null) {
    return message.channel.send("Joueur inconnu.");
  }
  let nation = player.Identity;
  if (args.length > 3)
    nation = await data.Nation.findOne({
      where: {
        id: {
          [Op.and]: {
            [Op.eq]: args[3],
            [Op.in]: player.Homelands.map((nat) => nat.id),
          },
        },
      },
    });
  if (nation === null)
    return message.channel.send("Je crois que ça va pas être possible");
  await targetPlayer.removeHomeland(nation);
  await targetPlayer.addHomeland(nation);
  message.channel.send(
    "<@" + args[2] + "> est un dirigeant de **" + nation.dataValues.name + "**"
  );
};

exports.radier = async (client, message, args, player) => {
  if (args.length < 3) {
    return message.channel.send("Pas compris.");
  }
  if (!checkIsNationCitizen(player)) {
    return message.channel.send("You have no power here.");
  }
  let targetPlayer = await data.Player.findByPk(args[2]);
  if (targetPlayer === null) {
    return message.channel.send("Joueur inconnu.");
  }
  let nation = player.Identity;
  if (args.length > 3) nation = await data.Nation.findByPk(args[3]);
  if (nation === null) return message.channel.send("Pas trouvé la nation");
  if (
    args[2] === player.dataValues.discord &&
    player.Identity.id === nation.id
  ) {
    return message.channel.send(
      "Nan ça c'est toi, essaye avec `$nation brexit`"
    );
  }
  await targetPlayer.removeHomeland(nation);
  message.channel.send(
    "<@" +
      args[2] +
      "> n'est plus dirigeant de **" +
      nation.dataValues.name +
      "**"
  );
};

const multiDistri = async (client, message, args, player) => {
  nation = await data.Nation.findOne({
    where: {
      [Op.and]: [
        { id: { [Op.eq]: args[2] } },
        { id: { [Op.in]: player.Homelands.map((nat) => nat.dataValues.id) } },
      ],
    },
  });
  if (nation === null)
    return message.channel.send("Je crois que ça va pas être possible");

  let players = [];
  let amount = parseInt(args[3]);
  args.forEach((arg, i) => {
    if (i <= 3) return;
    players.push(args[i]);
  });
  let realAmount =
    amount * players.length < nation.dataValues.reputationPool
      ? amount * players.length
      : nation.dataValues.reputationPool;

  if (realAmount <= 0) {
    return message.channel.send("Y'a comme un lézard dans ton calcul.");
  }

  let total = ~~(realAmount / players.length);
  let extras = realAmount % players.length;
  let embed = new Discord.RichEmbed().setDescription("Point distribués :");
  let targetPlayer = null;

  total += 1;
  for (i = 0; i < players.length; i++) {
    targetPlayer = await data.Player.findByPk(players[i]);
    if (targetPlayer !== null) {
      if (i >= extras) total -= 1;
      await nation.update({
        reputationPool: nation.dataValues.reputationPool - total,
      });
      await targetPlayer.update({
        reputation: targetPlayer.dataValues.reputation + total,
      });
      embed.addField(total + " ->", "<@" + players[i] + ">");
    }
  }
  console.log(players);
  message.channel.send(embed);
};

exports.distribuer = async (client, message, args, player) => {
  if (args.length < 5) {
    return message.channel.send("Pas compris.");
  }
  if (args.length > 4) {
    await multiDistri(client, message, args, player);
    return;
  }
  if (!checkIsNationCitizen(player)) {
    return message.channel.send("You have no power here.");
  }
  let amount = parseInt(args[2]);
  if (amount > player.dataValues.Identity.reputationPool)
    return message.channel.send(
      "Il n'y a pas autant de réputation disponible, espèce d'andouille dégarnie notoire"
    );
  let receiver = await data.Player.findByPk(args[3]);
  if (receiver === null) return message.channel.send("Connais pas ce type");
  await receiver.update({
    reputation: receiver.dataValues.reputation + amount,
  });
  await player.dataValues.Identity.update({
    reputationPool: player.dataValues.Identity.reputationPool - amount,
  });
  message.channel.send("Et " + amount + " réput', " + amount + " !");
  botProfile.voir(
    client,
    message,
    [null, null, receiver.dataValues.discord],
    player
  );
};

const diplomacyCommands = {
  méfiant: "MISTRUSTFUL",
  amical: "FRIENDLY",
};

exports.diplomatie = async (client, message, args, player) => {
  if (args.length < 5) {
    return message.channel.send("Pas compris.");
  }

  nation = await data.Nation.findOne({
    where: {
      [Op.and]: [
        { id: { [Op.eq]: args[2] } },
        { id: { [Op.in]: player.Homelands.map((nat) => nat.dataValues.id) } },
      ],
    },
  });
  if (nation === null)
    return message.channel.send("Je crois que ça va pas être possible");

  let updates = {};
  let cur = 0;
  args.slice(2, args.length).forEach((elem) => {
    if (diplomacyCommands[elem]) {
      updates[cur] = diplomacyCommands[elem];
    } else {
      cur = elem;
    }
  });
  let nations = data.Nation.findAll({
    where: { id: { [Op.in]: Object.keys(updates) } },
  });
  if (nations.length !== updates.length)
    return message.channel.send("Y'a des nations qu'on trouve pas là oh.");
  await data.Diplomacy.destroy({ where: { originId: args[2] } });
  Object.keys(updates).forEach(async (elem) => {
    await data.Diplomacy.create({
      originId: args[2],
      targetId: elem,
      type: updates[elem],
    });
  });

  return message.channel.send("Et voilà, c'est tout bon !");
};
