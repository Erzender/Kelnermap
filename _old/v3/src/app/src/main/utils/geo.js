import config from "../../../config.json";

exports.geoToImage = (mod, x, z) => ({
  x: config.mapSize.x * mod * ((x - config.cali.xOf) / config.cali.x),
  z: config.mapSize.z * mod * ((z - config.cali.zOf) / config.cali.z),
});

exports.imageToTile = (x, z) => ({
  x:
    Math.round(
      (x * (config.mapCorners.end.X - config.mapCorners.start.X)) /
        config.mapSize.x
    ),
  z:
    Math.round(
      (z * (config.mapCorners.end.Z - config.mapCorners.start.Z)) /
        config.mapSize.z
    ),
});
