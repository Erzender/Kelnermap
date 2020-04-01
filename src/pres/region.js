const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const data = require("../_model");
const regions = require("../regionInfo.json");

exports.get = async function(req, res) {
  let region = regions[req.params.id];
  if (!region) {
    return res.status(404).render("index", { route: "404" });
  }
  let info = { region: { ...region, key: req.params.id } };
  info.domination = await data.Nation.findOne({
    where: { regions: { [Op.substring]: req.params.id } }
  });
  info.domination =
    info.domination === null
      ? { name: "Aucune", color: "none" }
      : {
          name: info.domination.dataValues.name,
          color: info.domination.dataValues.color
        };
  let edifices = await data.Edificio.findAll({
    where: { region: req.params.id },
    include: [
      {
        model: data.Player,
        as: "Creator"
      }
    ]
  });
  info.edifices = edifices.map(edifice => ({
    name: edifice.name,
    link: "/lekelner/explorer/edifices/" + edifice.id,
    player:
      edifice.dataValues.Creator.dataValues.picture !== null &&
      edifice.dataValues.Creator.dataValues.picture.length
        ? edifice.dataValues.Creator.dataValues.picture
        : "https://vignette.wikia.nocookie.net/protagonists/images/d/d7/Alex.jpg/revision/latest?cb=20180206200812"
  }));
  res.render("index", {
    route: "region",
    info,
    embedTitle: info.region.n,
    embedImage: ""
  });
};

exports.getAll = async function(req, res) {
  res.send("Des régions ?");
};