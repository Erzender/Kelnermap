const data = require("../_model");
const regions = require("../../config/regionInfo.json");
const mastodonUtils = require("../utils/mastodon");

exports.get = async function (req, res) {
  let edifice = await data.Edificio.findByPk(req.params.id, {
    include: [
      {
        model: data.Player,
        as: "Creator",
      },
    ],
  });

  if (edifice === null) {
    return res.status(404).render("index", {
      route: "404",
      embedTitle: "404",
      embedImage: "",
      embedDesc: "",
    });
  }
  let mastodon = await mastodonUtils.getComments(edifice.dataValues.mastodon);
  let arts = await data.Art.findAll({
    where: { placeId: edifice.id },
    include: [
      {
        model: data.Player,
        as: "Artist",
      },
    ],
  }).map((art) => ({
    name: art.dataValues.name,
    artistPic: art.Artist.dataValues.picture || "/lekelner/asset/Alex.webp",
    link: "/lekelner/explorer/oeuvres/" + art.dataValues.id,
  }));

  res.render("index", {
    route: "edifice",
    embedTitle: edifice.dataValues.name,
    embedImage: edifice.dataValues.pic,
    embedDesc: edifice.dataValues.desc,
    mastodon,
    edifice: {
      ...edifice.dataValues,
      edit: "/lekelner/explorer/edifices/editeur?id=" + edifice.dataValues.id,
      desc: edifice.dataValues.desc.split("\n") || [],
      playerPicture:
        edifice.dataValues.Creator.dataValues.picture !== null &&
        edifice.dataValues.Creator.dataValues.picture.length
          ? edifice.dataValues.Creator.dataValues.picture
          : "/lekelner/asset/Alex.webp",
      region: {
        ...regions[edifice.dataValues.region],
        key: edifice.dataValues.region,
      },
      arts,
    },
  });
};

exports.getAll = async function (req, res) {
  res.send("Des édifices ?");
};

exports.getEditor = async function (req, res) {
  let fields = {
    id: -1,
    title: "Créer un nouvel édifice :",
    name: "",
    description: "",
    picture: "",
    region: req.query.region ? req.query.region : "1",
    mastodon: "",
    command: "",
  };
  if (req.query.id) {
    let edifice = await data.Edificio.findByPk(req.query.id, {
      include: [
        {
          model: data.Player,
          as: "Creator",
        },
      ],
    });

    if (edifice === null) {
      return res.status(404).render("index", {
        route: "404",
        embedTitle: "404",
        embedImage: "",
        embedDesc: "",
      });
    }

    fields.id = edifice.dataValues.id;
    fields.title = "Modifier l'édifice " + edifice.dataValues.name + " :";
    fields.name = edifice.dataValues.name;
    fields.description = edifice.dataValues.desc;
    fields.picture = edifice.dataValues.pic;
    fields.region = edifice.dataValues.region;
    fields.mastodon = edifice.dataValues.mastodon;
  }

  res.render("index", {
    route: "edificeEdit",
    embedTitle: "Editeur",
    embedImage: "",
    embedDesc: "",
    fields,
    regions: Object.keys(regions)
      .map((key) => ({
        key,
        value: regions[key].n,
      }))
      .sort((a, b) => a.value.localeCompare(b.value)),
  });
};

exports.postEditor = async function (req, res) {
  let command = "$édifice ";
  command += req.body.id >= 0 ? "changer " + req.body.id + " " : "créer ";
  command +=
    '"' +
    req.body.name +
    '" "' +
    req.body.description +
    '" "<' +
    req.body.picture +
    '>" "' +
    req.body.region +
    '" "<' +
    req.body.mastodon +
    '>"';
  if (req.body.delete === "on") {
    command = "$édifice supprimer " + req.body.id;
  }
  let fields = { ...req.body, command };
  res.render("index", {
    route: "edificeEdit",
    embedTitle: "Editeur",
    embedImage: "",
    embedDesc: "",
    fields,
    regions: Object.keys(regions).map((key) => ({
      key,
      value: regions[key].n,
    })),
  });
};
