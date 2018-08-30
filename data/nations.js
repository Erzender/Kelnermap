const creds = require('./creds').creds
const fetch = require('node-fetch')

const getObject = require('./utils').getObject
const config = require('../config.json')

exports.getNations = async function() {
  try {
    result = await fetch(creds.url + "/nations", {
      method: "GET"
    })
  } catch (e) {
    console.error(e);
    return null
  }
  return await getObject(result)
}

exports.getNation = async function(id) {
  try {
    result = await fetch(creds.url + "/nations?id=" + id, {
      method: "GET"
    })
  } catch (e) {
    console.error(e);
    return null
  }
  return await getObject(result)
}

exports.getMap = async function() {
  try {
    result = await fetch(creds.url + "/nations", {
      method: "GET"
    })
  } catch (e) {
    console.error(e);
    return null
  }
  var flat = []
  for (var x = 0; x < config.mapSize; x++) {
    flat.push([])
    for (var z = 0; z < config.mapSize; z++) {
      flat[x].push({ids: [], control: false})
    }
  }
  for (area of config.control) {
    flat[area.x][area.z].control = true
  }
  var obj = await getObject(result)
  if (obj === null) {
    return null
  }
  for (nation of obj) {
    for (area of nation.areas) {
      if (area.x < config.mapSize && area.x >= 0 && area.z < config.mapSize && area.z >= 0){
        flat[area.x][area.z].ids.push(nation.id)
      }
    }
  }
  return {map: flat, nations: obj.reduce((map, nation) => {
    map[nation.id] = { name: nation.name, player: nation.player, soutiens: nation.soutiens, desc: nation.desc, color: nation.color}
    return map
  }, {})}
}

exports.updateNation = async function(id, payload) {
  try {
    result = await fetch(creds.url + "/nations/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
  } catch (e) {
    console.error(e);
    return null
  }
  ret = await getObject(result)
  return ret !== null ? ret.id : ret
}

exports.createNation = async function(payload) {
  try {
    result = await fetch(creds.url + "/nations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
  } catch (e) {
    console.error(e);
    return null
  }
  ret = await getObject(result)
  return ret !== null ? ret.id : ret
}
