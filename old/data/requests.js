const creds = require('./creds').creds
const fetch = require('node-fetch')

const getObject = require('./utils').getObject

exports.addRequest = async function(type, payload) {
  try {
    result = await fetch(creds.url + "/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({type: type, payload: payload})
    })
  } catch (e) {
    console.error(e);
    return null
  }
  ret = await getObject(result)
  return ret !== null ? ret.id : ret
}

exports.getRequest = async function(id) {
  try {
    result = await fetch(creds.url + "/requests/" + id, {method: "GET"})
  } catch (e) {
    console.error(e);
    return null
  }
  return await getObject(result)
}

exports.getRequests = async function() {
  try {
    result = await fetch(creds.url + "/requests", {method: "GET"})
  } catch (e) {
    console.error(e);
    return null
  }
  return await getObject(result)
}

exports.removeRequest = async function(id) {
  try {
    result = await fetch(creds.url + "/requests/" + id, {method: "DELETE"})
  } catch (e) {
    console.error(e);
    return null
  }
  return await getObject(result)
}
