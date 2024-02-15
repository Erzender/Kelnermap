class MapWatcher {
  constructor() {}

  async info() {
    try {
      const res = await fetch(process.env.KELNER_DYNMAP);
      const body = JSON.parse(await res.text());
      let retour = {};

      for (let player of body.players) {
        retour[player.account] = {
          monde: player.world,
          x: Math.floor(player.x),
          y: Math.floor(player.y),
          z: Math.floor(player.z)
        };
      }
      return retour;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

exports.MapWatcher = MapWatcher;
