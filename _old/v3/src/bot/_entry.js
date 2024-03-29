const Discord = require("discord.js");
const data = require("../_model");
const client = new Discord.Client();

const commands = {
  $profil: require("./profile"),
  $nation: require("./nation"),
  $région: require("./region"),
  $édifice: require("./edifice"),
  $oeuvre: require("./art")
};

const adminCommands = require("./admin");
const minecraftCommands = require("./minecraft");

try {
  client.on("ready", () => {
    console.log("Ready!");
  });
} catch (err) {
  console.log(err);
}

try {
  client.on("error", () => {
    console.log("Discord error ?");
  });
} catch (err) {
  console.log(err);
}

try {
  client.on("message", message => {
    processBotMessage(message);
  });
} catch (err) {
  console.log(err);
}

try {
  client.on("disconnect", () => {
    setTimeout(() => {
      try {
        client.login(JSON.parse(process.env.KELNER_BOT).id);
      } catch (err) {
        console.log(err);
      }
    }, 60000);
  });
} catch (err) {
  console.log(err);
}

exports.client = client;

const processBotMessage = message => {
  if (
    message.channel.id === JSON.parse(process.env.KELNER_BOT).console &&
    message.content.length &&
    message.content[0] !== "$"
  )
    return checkConsole(client, message);
  if (
    !(
      (message.channel.id === JSON.parse(process.env.KELNER_BOT).channel ||
        message.channel.id ===
          JSON.parse(process.env.KELNER_BOT).adminchannel) &&
      message.channel.guild.id === JSON.parse(process.env.KELNER_BOT).guild &&
      message.content.length > 0 &&
      message.content[0] === "$"
    )
  ) {
    return null;
  }
  let rawargs = message.content.split(" ");
  let args = [];
  let complexArgPos = -1;
  rawargs.forEach((arg, i) => {
    if (arg[0] === '"' && complexArgPos < 0) {
      complexArgPos = i;
    }
    if (arg[arg.length - 1] === '"' && complexArgPos > 0) {
      let concat = rawargs
        .slice(complexArgPos, i + 1)
        .reduce((acc, val) => acc + " " + val);
      args.push(concat.slice(1, concat.length - 1));
      return (complexArgPos = -1);
    }
    if (complexArgPos < 0) {
      return args.push(arg);
    }
    if (i >= rawargs.length - 1) {
      args = args.concat(rawargs.slice(complexArgPos, i + 1));
    }
  });
  args = args.map(
    arg =>
      arg.length && arg[0] === "<" && arg[arg.length - 1] === ">"
        ? arg.substring(1, arg.length - 1)
        : arg
  );
  processCommand(client, message, args);
};

const processCommand = async (client, message, args) => {
  if (
    args.length >= 2 &&
    ((commands[args[0]] && !!commands[args[0]][args[1]]) ||
      (args[0] === "$admin" &&
        message.channel.id ===
          JSON.parse(process.env.KELNER_BOT).adminchannel &&
        adminCommands[args[1]]))
  ) {
    let player = await data.Player.findOne({
      where: { discord: message.author.id },
      include: [
        {
          model: data.Nation,
          as: "Identity"
        },
        { model: data.Nation, as: "Homelands", through: "Citizenship" }
      ]
    });
    if (player === null) {
      try {
        player = await data.Player.create({ discord: message.author.id });
        return message.channel.send(
          "T'étais comme le ç de surf, maintenant c'est bon recommence stp."
        );
      } catch (err) {
        console.log(err);
        return message.channel.send("Le Kelner.exe a cessé de fonctionner.");
      }
    }
    if (args[0] === "$admin") {
      adminCommands[args[1]](client, message, args, player);
    } else {
      commands[args[0]][args[1]](client, message, args, player);
    }
  } else {
    return message.channel.send("Cette commande n'existe papapapapa.");
  }
};

const checkConsole = async (client, message) => {
  let exists = false;
  Object.keys(minecraftCommands).forEach(cmd => {
    if (message.content.search(cmd) >= 0) {
      exists = true;
    }
  });
  if (!exists) return;
  let lines = message.content.replace("\\_", "_").split("\n");
  let header = [];
  let world = [];
  let player = [];
  let args = [];
  let playerObj = null;
  lines.forEach(async line => {
    header = line.split(" INFO] "); // [sam., 11. sept. 2021 20:09:31 CEST INFO] [Refuge> Erzender> ah oui
    if (
      header.length === 2 &&
      (world = header[1].split("[Refuge\\> ")) &&
      world.length === 2 &&
      world[0] === "" &&
      (player = world[1].split("\\> ")) &&
      player.length === 2
    ) {
      args = player[1].split(" ");
      if (
        Object.keys(minecraftCommands).findIndex(elem => elem === args[0]) >= 0
      ) {
        playerObj = await data.Player.findOne({
          where: { minecraft: player[0] }
        });
        if (playerObj !== null) {
          minecraftCommands[args[0]](client, message, args, playerObj);
        } else {
          return message.channel.send(
            `tellraw ${player[0]} ["",{"text":"["},{"text":"${args[0]}","bold":true,"color":"dark_red"},{"text":">","bold":true},{"text":" Je n'ai jamais entendu parler de toi. Alors je t'ignore hohoho ! ^_^"}]`
          );
        }
      }
    }
  });
};
