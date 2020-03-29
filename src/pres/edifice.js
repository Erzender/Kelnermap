const data = require("../_model");
const regions = require("../regionInfo.json");

exports.get = async function(req, res) {
  let edifice = await data.Edificio.findByPk(req.params.id, {
    include: [
      {
        model: data.Player,
        as: "Creator"
      }
    ]
  });
  if (edifice === null) {
    return res.status(404).render("index", { route: "404" });
  }
  console.log(edifice);
  res.render("index", {
    route: "edifice",
    edifice: {
      ...edifice.dataValues,
      desc: edifice.dataValues.desc.split("\n") || [],
      playerPicture:
        edifice.dataValues.Creator.dataValues.picture !== null &&
        edifice.dataValues.Creator.dataValues.picture.length
          ? edifice.dataValues.Creator.dataValues.picture
          : "https://vignette.wikia.nocookie.net/protagonists/images/d/d7/Alex.jpg/revision/latest?cb=20180206200812",
      region: {
        ...regions[edifice.dataValues.region],
        key: edifice.dataValues.region
      }
    }
  });
};

exports.getAll = async function(req, res) {
  res.send("Des édifices ?");
};
