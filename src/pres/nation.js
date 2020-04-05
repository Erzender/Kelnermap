const data = require("../_model");
const tiles = require("../../config/regions.json");

exports.get = async function (req, res) {
  let nation = await data.Nation.findByPk(req.params.id);
  if (nation === null) {
    return res
      .status(404)
      .render("index", { route: "404", embedTitle: "404", embedImage: "", embedDesc: "" });
  }

  const citizens = await data.Player.findAll({
    include: [
      {
        model: data.Nation,
        as: "Homelands",
        where: { id: nation.dataValues.id },
      },
    ],
  });
  const inhabs = await data.Player.findAll({
    include: [
      {
        model: data.Nation,
        as: "Identity",
        where: { id: nation.dataValues.id },
      },
    ],
  });

  let info = {
    id: nation.dataValues.id,
    pic: nation.dataValues.pic,
    name: nation.dataValues.name,
    desc: nation.dataValues.desc.split("\n") || [],
    color: nation.dataValues.color,
    size:
      tiles
        .flat()
        .filter((elem) => elem !== "0" && nation.regions.indexOf(elem) >= 0)
        .length * 0.25,
    anthem: "https://www.invidio.us/embed/" + nation.dataValues.hymne,
    citizens: citizens.map((citizen) => ({
      id: citizen.dataValues.discord,
      pic:
        citizen.dataValues.picture !== null && citizen.dataValues.picture.length
          ? citizen.dataValues.picture
          : "/lekelner/asset/Alex.webp",
    })),
    inhabs: inhabs.map((citizen) => ({
      id: citizen.dataValues.discord,
      pic:
        citizen.dataValues.picture !== null && citizen.dataValues.picture.length
          ? citizen.dataValues.picture
          : "/lekelner/asset/Alex.webp",
    })),
  };

  res.render("index", {
    route: "nation",
    embedTitle: "Nation : " + nation.dataValues.name,
    embedImage: nation.dataValues.pic,
    embedDesc: nation.dataValues.desc,
    info,
  });
};
