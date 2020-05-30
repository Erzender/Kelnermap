const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const data = require("../_model");
const regions = require("../../config/regionInfo.json");

exports.get = async function (req, res) {
  let region = regions[req.params.id];
  if (!region) {
    return res.status(404).render("index", {
      route: "404",
      embedTitle: "404",
      embedImage: "",
      embedDesc: "",
    });
  }
  let info = { region: { ...region, key: req.params.id } };
  info.cities = Object.keys(regions)
    .filter((key) => regions[key].city && regions[key].suze === info.region.key)
    .map((reg) => ({
      id: reg,
      link: "/lekelner/explorer/regions/" + reg,
      name: regions[reg].n,
    }));
  let edificios = await data.Edificio.findAll({
    where: { region: { [Op.in]: info.cities.map((city) => city.id) } },
  });
  info.cities.forEach(
    (city, i) =>
      (info.cities[i].edifices = edificios.filter(
        (elem) => elem.dataValues.region === city.id
      ).length)
  );

  info.suze = region.suze
    ? {
        name: regions[region.suze].n,
        link: "/lekelner/explorer/regions/" + region.suze,
      }
    : null;

  info.city =
    region.city && (governor = await data.Player.findByPk(region.city.governor))
      ? {
          governor: governor.dataValues.minecraft || "",
          governorId: region.city.governor,
          pic: governor.dataValues.picture || "/lekelner/asset/Alex.webp",
          tag: region.city.tag,
        }
      : null;

  info.domination = await data.Nation.findOne({
    where: {
      regions: {
        [Op.substring]: region.suze
          ? "[" + region.suze + "]"
          : "[" + req.params.id + "]",
      },
    },
  });
  info.domination =
    info.domination === null
      ? { name: "Aucune", color: "none" }
      : {
          name: info.domination.dataValues.name,
          color: info.domination.dataValues.color,
          pic: info.domination.dataValues.pic || "/lekelner/asset/unknown.png",
          id: info.domination.dataValues.id,
        };
  let edifices = await data.Edificio.findAll({
    where: { region: req.params.id },
    include: [
      {
        model: data.Player,
        as: "Creator",
      },
    ],
  });
  info.edifices = edifices.map((edifice) => ({
    name: edifice.name,
    link: "/lekelner/explorer/edifices/" + edifice.id,
    player:
      edifice.dataValues.Creator.dataValues.picture !== null &&
      edifice.dataValues.Creator.dataValues.picture.length
        ? edifice.dataValues.Creator.dataValues.picture
        : "/lekelner/asset/Alex.webp",
  }));
  res.render("index", {
    route: "region",
    info,
    embedTitle: info.region.n,
    embedImage: "",
    embedDesc: "",
  });
};

exports.getAll = async function (req, res) {
  res.send("Des régions ?");
};
