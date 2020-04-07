const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const data = require("../_model");
const tiles = require("../../config/regions.json");

exports.get = async function (req, res) {
  let nation = await data.Nation.findByPk(req.params.id);
  if (nation === null) {
    return res.status(404).render("index", {
      route: "404",
      embedTitle: "404",
      embedImage: "",
      embedDesc: "",
    });
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
    edit: "./editeur?id=" + nation.dataValues.id,
    pic: nation.dataValues.pic,
    name: nation.dataValues.name,
    desc: nation.dataValues.desc.split("\n") || [],
    color: nation.dataValues.color,
    size:
      tiles
        .flat()
        .filter((elem) => elem !== "0" && nation.regions.indexOf(elem) >= 0)
        .length * 0.25,
    anthem:
      nation.dataValues.hymne && nation.dataValues.hymne.length
        ? "https://www.invidio.us/embed/" + nation.dataValues.hymne
        : null,
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
    command: "$nation rejoindre " + nation.dataValues.id,
  };

  res.render("index", {
    route: "nation",
    embedTitle: "Nation : " + nation.dataValues.name,
    embedImage: nation.dataValues.pic,
    embedDesc: nation.dataValues.desc,
    info,
  });
};

exports.getEditor = async function (req, res) {
  let fields = {
    id: -1,
    title: "Fonder une nation :",
    name: "",
    description: "",
    picture: "",
    color: "",
    anthem: "",
    x: 0,
    y: 0,
    z: 0,
    command: "",
  };

  if (req.query.id) {
    let nation = await data.Nation.findByPk(req.query.id);

    if (nation === null) {
      return res.status(404).render("index", {
        route: "404",
        embedTitle: "404",
        embedImage: "",
        embedDesc: "",
      });
    }

    let citizens = await data.Player.findAll({
      include: [
        {
          model: data.Nation,
          as: "Homelands",
          through: "Citizenship",
          where: { id: nation.dataValues.id },
        },
      ],
    });
    let nonCitizens = await data.Player.findAll({
      where: {
        discord: {
          [Op.notIn]: citizens.map((citizen) => citizen.dataValues.discord),
        },
      },
    });

    fields.id = nation.dataValues.id;
    fields.title =
      (nation.dataValues.name ? nation.dataValues.name + " | " : "") +
      "Modifier la nation";
    fields.name = nation.dataValues.name || "";
    fields.description = nation.dataValues.desc;
    fields.picture = nation.dataValues.pic;
    fields.color = nation.dataValues.color;
    fields.anthem = nation.dataValues.hymne;
    fields.citizenship = {
      citizens: citizens.map((player) => ({
        id: player.dataValues.discord,
        name: player.dataValues.minecraft,
      })),
      nonCitizens: nonCitizens.map((player) => ({
        id: player.dataValues.discord,
        name: player.dataValues.minecraft,
      })),
    };
    if (nation.dataValues.stronghold) {
      let coors = nation.dataValues.stronghold.split(" | ");
      fields.x = coors[0].split(" X")[0];
      fields.y = coors[1].split(" Y")[0];
      fields.z = coors[2].split(" Z")[0];
    }
  }

  res.render("index", {
    route: "nationEdit",
    embedTitle: "Editeur",
    embedImage: "",
    embedDesc: "",
    fields,
  });
};

exports.postEditor = async function (req, res) {
  let command = "$nation ";
  command += req.body.id >= 0 ? "changer " + req.body.id + " " : "fonder ";
  command +=
    '"' +
    req.body.name +
    '" "' +
    req.body.description +
    '" "<' +
    req.body.picture +
    '>" "' +
    req.body.color +
    '" "<' +
    req.body.anthem +
    '>" "' +
    req.body.x +
    '" "' +
    req.body.y +
    '" "' +
    req.body.z +
    '"';
  if (req.body.delete === "on") {
    command = "$édifice supprimer " + req.body.id;
  }
  let fields = {
    ...req.body,
    command,
  };
  if (req.body.citizenship)
    fields.citizenship = JSON.parse(req.body.citizenship);
  res.render("index", {
    route: "nationEdit",
    embedTitle: "Editeur",
    embedImage: "",
    embedDesc: "",
    fields,
  });
};

exports.postExpell = async function (req, res) {
  res.render("index", {
    route: "command",
    embedTitle: "Editeur",
    embedImage: "",
    embedDesc: "",
    command:
      "$nation radier " +
      req.body.player +
      (req.body.nation ? " " + req.body.nation : ""),
  });
};

exports.postCitizen = async function (req, res) {
  res.render("index", {
    route: "command",
    embedTitle: "Editeur",
    embedImage: "",
    embedDesc: "",
    command:
      "$nation naturaliser " +
      req.body.player +
      (req.body.nation ? " " + req.body.nation : ""),
  });
};
