const data = require("../_model");
const regions = require("../../config/regionInfo.json");

exports.get = async function (req, res) {
  let player = await data.Player.findByPk(req.params.id, {
    include: [
      {
        model: data.Nation,
        as: "Identity",
      },
      { model: data.Nation, as: "Homelands", through: "Citizenship" },
    ],
  });
  if (player === null) {
    return res.status(404).render("index", {
      route: "404",
      embedTitle: "404",
      embedImage: "",
      embedDesc: "",
    });
  }
  let edifices = await data.Edificio.findAll({
    where: { CreatorDiscord: player.dataValues.discord },
  });
  let players = await data.Player.findAll({
    include: [
      {
        model: data.Nation,
        as: "Identity",
      },
    ],
  });
  let ranking =
    players
      .map((p) => ({
        id: p.dataValues.discord,
        reputation: p.dataValues.reputation,
      }))
      .sort((p1, p2) => p1.reputation < p2.reputation)
      .findIndex((p) => p.id === player.dataValues.discord) + 1;

  let info = {
    edit: "/lekelner/explorer/joueurs/editeur?id=" + player.dataValues.discord,
    link: "/lekelner/explorer/joueurs/" + player.dataValues.discord,
    name: player.dataValues.minecraft,
    picture:
      player.dataValues.picture !== null && player.dataValues.picture.length
        ? player.dataValues.picture
        : "/lekelner/asset/Alex.webp",
    desc: player.dataValues.desc.split("\n") || [],
    nationId: player.Identity && player.Identity.dataValues.id,
    nationName: player.Identity && player.Identity.dataValues.name,
    nationPic: player.Identity && player.Identity.dataValues.pic,
    nationColor: player.Identity && player.Identity.dataValues.color,
    citizenship: player.Homelands.map((citizenship) => citizenship.name),
    pvpScore: player.dataValues.reputation,
    pvpRanking: ranking,
    edificesNum: edifices.length,
    edifices: Object.keys(regions)
      .map((key) => ({
        region: { ...regions[key], key },
        edifices: edifices
          .filter((elem) => elem.dataValues.region === key)
          .map((elem) => ({
            name: elem.dataValues.name,
            link: "/lekelner/explorer/edifices/" + elem.dataValues.id,
          })),
      }))
      .filter((elem) => elem.edifices.length > 0)
      .sort((a, b) => {
        return b.edifices.length - a.edifices.length;
      }),
  };
  res.render("index", {
    route: "player",
    embedTitle: "Joueur : " + info.name,
    embedImage: info.picture,
    embedDesc: player.dataValues.desc,
    info,
  });
};

exports.getEditor = async function (req, res) {
  let fields = {
    id: -1,
    title: "Modifier le profil",
    name: "",
    description: "",
    picture: "",
    command: "",
  };
  if (req.query.id) {
    let player = await data.Player.findByPk(req.query.id);

    if (player === null) {
      return res.status(404).render("index", {
        route: "404",
        embedTitle: "404",
        embedImage: "",
        embedDesc: "",
      });
    }

    fields.id = player.dataValues.id;
    fields.title =
      (player.dataValues.minecraft ? player.dataValues.minecraft + "| " : "") +
      "Modifier le profil";
    fields.name = player.dataValues.minecraft || "";
    fields.description = player.dataValues.desc;
    fields.picture = player.dataValues.picture;
  }

  res.render("index", {
    route: "playerEdit",
    embedTitle: "Editeur",
    embedImage: "",
    embedDesc: "",
    fields,
  });
};

exports.postEditor = async function (req, res) {
  let command = "$profil changer ";
  command +=
    '"' +
    req.body.name +
    '" "' +
    req.body.description +
    '" "<' +
    req.body.picture +
    '>"';
  let fields = { ...req.body, command };
  res.render("index", {
    route: "playerEdit",
    embedTitle: "Editeur",
    embedImage: "",
    embedDesc: "",
    fields,
  });
};
