const fetch = require("node-fetch");
const data = require("../data");
const moment = require("moment");

const checkUnlimittedPower = async function (idRequesting, idRequested) {
  var nations = await data.nations.getNations();
  var soutiensRequesting = 0;
  var soutiensRequested = 0;
  for (nation of nations) {
    var rankRequested = nation.soutiens.findIndex(id => id === idRequested);
    var rankRequesting = nation.soutiens.findIndex(id => id === idRequesting);
    if (
      (rankRequesting >= 0 && rankRequested < 0) ||
      (rankRequested > rankRequesting && rankRequesting >= 0)
    ) {
      soutiensRequesting = soutiensRequesting + 1;
    } else if (
      (rankRequested >= 0 && rankRequesting < 0) ||
      (rankRequesting > rankRequested && rankRequested >= 0)
    ) {
      soutiensRequested = soutiensRequested + 1;
    }
  }
  return soutiensRequested < soutiensRequesting;
};

const processTerritory = async function (author, areas) {
  var nation = await data.nations.getNation(author.id);
  var flat = await data.nations.getMap();
  if (nation === null || flat === null) {
    return {
      success: false,
      what: "le serveur est ptetre cassé. Au secours @Erzender , vous êtes mon seul espoir"
    };
  }
  var alsoUpdate = {};
  for (area of areas) {
    if (
      flat.map[area.x][area.z].ids.length > 0 &&
      !flat.map[area.x][area.z].ids.find(id => id === author.id) &&
      !(await checkUnlimittedPower(author.id, flat.map[area.x][area.z].ids[0]))
    ) {
      return {
        success: false,
        what: "un emplacement est **occupé** par quelqu'un de plus puissant."
      };
    }
    if (
      flat.map[area.x][area.z].ids.length > 0 &&
      !flat.map[area.x][area.z].ids.find(id => id === author.id)
    ) {
      alsoUpdate[flat.map[area.x][area.z].ids[0]] = true;
    }
    if (flat.map[area.x][area.z].control === false) {
      return {
        success: false,
        what: "un bout du territoire déclaré est à la flotte, comme ta requête 🎅 "
      };
    }
    flat.map[area.x][area.z].ids = [author.id];
  }
  for (area of areas) {
    if (
      flat.map[area.x - 1][area.z].ids[0] !== author.id &&
      flat.map[area.x + 1][area.z].ids[0] !== author.id &&
      flat.map[area.x][area.z - 1].ids[0] !== author.id &&
      flat.map[area.x][area.z + 1].ids[0] !== author.id &&
      areas.length > 1
    ) {
      return {
        success: false,
        what: "le territoire déclaré n'est pas continu. Il est juste con."
      };
    }
  }
  if (nation.length === 0) {
    if (
      (await data.nations.createNation({
        id: author.id,
        name: "Une nation nouvelle",
        color: "#333333",
        player: author.username,
        areas: areas,
        soutiens: []
      })) === null
    ) {
      return {
        success: false,
        what: "le serveur est ptetre cassé. Au secours @Erzender , vous êtes mon seul espoir"
      };
    }
    return {
      success: true
    };
  }
  for (update of Object.keys(alsoUpdate)) {
    if (
      (await data.nations.updateNation(update, {
        areas: []
      })) === null
    ) {
      return {
        success: false,
        what: "le serveur est ptetre cassé. Au secours @Erzender , vous êtes mon seul espoir"
      };
    }
  }
  if (
    (await data.nations.updateNation(author.id, {
      areas: areas,
      lastClaim: moment()
    })) === null
  ) {
    return {
      success: false,
      what: "le serveur est ptetre cassé. Au secours @Erzender , vous êtes mon seul espoir"
    };
  }
  if (Object.keys(alsoUpdate).length > 0) {
    return {
      success: true,
      what: ". C'est une invasion redoutable qui a fait sombrer **" +
        Object.keys(alsoUpdate).length +
        "** civilisation(s) 💀"
    };
  }
  return {
    success: true,
    what: ""
  };
};

const processPlayer = async function (author, fields) {
  var nation = await data.nations.getNation(author.id);
  if (nation === null) {
    return {
      success: false,
      what: "euuuh bug je crois."
    };
  }
  var newSoutiens = [];
  for (soutien of fields.soutiens) {
    if (!newSoutiens.find(elem => elem === soutien)) {
      newSoutiens.push(soutien);
    }
  }
  if (nation.length === 0) {
    if (
      (await data.nations.createNation({
        id: author.id,
        name: fields.nationName,
        color: fields.color,
        player: author.username,
        soutiens: newSoutiens,
        image: fields.image,
        leader: fields.name,
        desc: fields.desc,
        areas: []
      })) === null
    ) {
      return {
        success: false,
        what: "le serveur est ptetre cassé. Au secours @Erzender , vous êtes mon seul espoir"
      };
    }
    return {
      success: true
    };
  }
  if (
    (await data.nations.updateNation(author.id, {
      name: fields.nationName,
      color: fields.color,
      player: author.username,
      soutiens: fields.soutiens,
      image: fields.image,
      leader: fields.name,
      desc: fields.desc
    })) === null
  ) {
    return {
      success: false,
      what: "le serveur est ptetre cassé. Au secours @Erzender , vous êtes mon seul espoir"
    };
  }
  return {
    success: true,
    what: ""
  };
};

const processPurge = async function (message) {
  /*
  if (message.author.id !== JSON.parse(process.env.KELNER_BOT).admin) {
    return null
  }
  */
  var requests = await data.requests.getRequests();
  if (!requests) {
    return null;
  }
  var cpt = 0;
  for (request of requests) {
    if (request.id !== 0) {
      await data.requests.removeRequest(request.id);
      cpt++;
    }
  }
  await message.reply("la purge youpi: " + cpt + " requêtes assassinnées");
  return null;
};

exports.processBotMessage = async function (message) {
  if (!(message.channel.id === JSON.parse(process.env.KELNER_BOT).channel && message.channel.guild.id === JSON.parse(process.env.KELNER_BOT).guild)) {
    return null;
  }
  if (message.content === "purge") {
    return processPurge(message);
  }
  content = message.content.split(" ")
  if (content.length > 2 && content[0] === "okGlados" && content[1] === "login")  {
    return message.reply(content[2])
  }
  if (Number(message.content) > 0) {
    res = await data.requests.getRequest(message.content);
    if (res === null) {
      return null;
    }
    if (res.type === "TERRITORY") {
      outcome = await processTerritory(message.author, res.payload);
      await data.requests.removeRequest(message.content);
      if (outcome.success) {
        return message.reply(
          "le territoire a été **enregistré**" + outcome.what
        );
      }
      return message.reply("nique ta race Frodon : " + outcome.what);
    }
    if (res.type === "PLAYER") {
      outcome = await processPlayer(message.author, res.payload);
      await data.requests.removeRequest(message.content);
      if (outcome.success) {
        return message.reply("le profile a été **mis à jour**");
      }
      return message.reply("nique ta race Frodon : " + outcome.what);
    }
  }
};