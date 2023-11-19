exports.getObject = async function(result) {
  try {
    json = await result.json()
  } catch (e) {
    console.error(e);
    return null
  }
  return json
}
