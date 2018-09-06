const fetch = require("node-fetch")
const data = require("../data")

const processTerritory = async function(author, areas) {
  var nation = await data.nations.getNation(author.id)
  var flat = await data.nations.getMap()
  if (nation === null || flat === null) {
    return {success: false, what: "le serveur est ptetre cassé. Au secours @Erzender , vous êtes mon seul espoir"}
  }
  for (area of areas) {
    if (flat.map[area.x][area.z].ids.length > 0 && !flat.map[area.x][area.z].ids.find(id => id === author.id)) {
      return {success: false, what: "un emplacement est **occupé**."}
    }
    if (flat.map[area.x][area.z].control === false) {
      return {success: false, what: "un bout du territoire déclaré est à la flotte, comme ta requête 🎅 "}
    }
    flat.map[area.x][area.z].ids = [author.id]
  }
  for (area of areas) {
    if (
      flat.map[area.x - 1][area.z].ids[0] !== author.id &&
      flat.map[area.x + 1][area.z].ids[0] !== author.id &&
      flat.map[area.x][area.z - 1].ids[0] !== author.id &&
      flat.map[area.x][area.z + 1].ids[0] !== author.id
    ) {
      return {success: false, what: "le territoire déclaré n'est pas continu. Il est juste con."}
    }
  }
  if (nation.length === 0) {
    if (await data.nations.createNation({id: author.id, name: "Une nation nouvelle", color: "#333333", player: author.username, areas: areas, soutiens: []}) === null) {
      return {success: false, what: "le serveur est ptetre cassé. Au secours @Erzender , vous êtes mon seul espoir"}
    }
    return {success: true}
  }
  if (await data.nations.updateNation(author.id, {areas: areas}) === null) {
    return {success: false, what: "le serveur est ptetre cassé. Au secours @Erzender , vous êtes mon seul espoir"}
  }
  return {success: true}
}

const processPlayer = async function(author, fields) {
  var nation = await data.nations.getNation(author.id)
  if (nation === null) {
    return {success: false, what: "euuuh bug je crois."}
  }
  var newSoutiens = []
  for (soutien of fields.soutiens) {
    if (!newSoutiens.find(elem => elem === soutien)) {
      newSoutiens.push(soutien)
    }
  }
  if (nation.length === 0) {
    if (await data.nations.createNation({id: author.id, name: fields.nationName, color: fields.color, player: author.username, soutiens: newSoutiens, image: fields.image, leader: fields.name, desc: fields.desc}) === null) {
      return {success: false, what: "le serveur est ptetre cassé. Au secours @Erzender , vous êtes mon seul espoir"}
    }
    return {success: true}
  }
  if (await data.nations.updateNation(author.id, {name: fields.nationName, color: fields.color, player: author.username, soutiens: fields.soutiens, image: fields.image, leader: fields.name, desc: fields.desc}) === null) {
    return {success: false, what: "le serveur est ptetre cassé. Au secours @Erzender , vous êtes mon seul espoir"}
  }
  return {success: true}
}

const processPurge = async function(message) {
  /*
  if (message.author.id !== JSON.parse(process.env.KELNER_BOT).admin) {
    return null
  }
  */
  var requests = await data.requests.getRequests()
  if (!requests) {
    return null
  }
  var cpt = 0
  for (request of requests) {
    if (request.id !== 0) {
      await data.requests.removeRequest(request.id)
      cpt++
    }
  }
  await message.reply("la purge youpi: " + cpt + " requêtes assassinnées")
  return null
}

exports.processBotMessage = async function(message) {
  if (!(message.channel.id === JSON.parse(process.env.KELNER_BOT).channel && message.channel.guild.id === JSON.parse(process.env.KELNER_BOT).guild)){
    return null
  }
  if (message.content === "purge"){
    return processPurge(message)
  }
  if (Number(message.content) > 0) {
    res = await data.requests.getRequest(message.content)
    if (res === null) {
      return null
    }
    if (res.type==="TERRITORY") {
      outcome = await processTerritory(message.author, res.payload)
      await data.requests.removeRequest(message.content)
      if (outcome.success) {
        return message.reply("le territoire a été **enregistré**")
      }
      return message.reply("nique ta race Frodon : " + outcome.what)
    }
    if (res.type==="PLAYER") {
      outcome = await processPlayer(message.author, res.payload)
      await data.requests.removeRequest(message.content)
      if (outcome.success) {
        return message.reply("le profile a été **mis à jour**")
      }
      return message.reply("nique ta race Frodon : " + outcome.what)
    }
  }
}
