const data = require("../_model");
const mastodonUtils = require("../utils/mastodon");

exports.get = async function (req, res) {
  let art = await data.Art.findByPk(req.params.id, {
    include: [
      {
        model: data.Player,
        as: "Artist",
      },
      {
        model: data.Edificio,
        as: "Place",
      },
    ],
  });
  if (art === null) {
    return res.status(404).render("index", {
      route: "404",
      embedTitle: "404",
      embedImage: "",
      embedDesc: "",
    });
  }
  let mastodon = await mastodonUtils.getComments(art.dataValues.mastodon);

  res.render("index", {
    route: "art",
    embedTitle: art.dataValues.name,
    embedImage: art.dataValues.pic,
    embedDesc: art.dataValues.desc,
    mastodon,
    art: {
      ...art.dataValues,
      edit: "/lekelner/explorer/oeuvres/editeur?id=" + art.dataValues.id,
      desc: art.dataValues.desc.split("\n") || [],
      playerPicture:
        art.dataValues.Artist.dataValues.picture !== null &&
        art.dataValues.Artist.dataValues.picture.length
          ? art.dataValues.Artist.dataValues.picture
          : "/lekelner/asset/Alex.webp",
    },
  });
};

exports.getAll = async function (req, res) {
  res.send("Des oeuvres ?");
};

exports.getEditor = async function (req, res) {
  let fields = {
    id: -1,
    title: "Enregistrer une nouvelle oeuvre :",
    name: "",
    description: "",
    picture: "",
    mastodon: "",
    command: "",
  };
  if (req.query.id) {
    let art = await data.Art.findByPk(req.query.id, {
      include: [
        {
          model: data.Player,
          as: "Artist",
        },
        {
          model: data.Edificio,
          as: "Place",
        },
      ],
    });

    if (art === null) {
      return res.status(404).render("index", {
        route: "404",
        embedTitle: "404",
        embedImage: "",
        embedDesc: "",
      });
    }

    fields.id = art.dataValues.id;
    fields.title = "Modifier l'oeuvre " + art.dataValues.name + " :";
    fields.name = art.dataValues.name;
    fields.description = art.dataValues.desc;
    fields.picture = art.dataValues.pic;
    fields.edifice = art.Place.dataValues.id;
    fields.mastodon = art.dataValues.mastodon;
  }

  res.render("index", {
    route: "artEdit",
    embedTitle: "Editeur",
    embedImage: "",
    embedDesc: "",
    fields,
    edifices: (await data.Edificio.findAll())
      .map((edifice) => ({
        id: edifice.dataValues.id,
        name: edifice.dataValues.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  });
};

exports.postEditor = async function (req, res) {
  let command = "$oeuvre ";
  command += req.body.id >= 0 ? "changer " + req.body.id + " " : "créer ";
  command +=
    '"' +
    req.body.name +
    '" "' +
    req.body.description +
    '" "<' +
    req.body.picture +
    '>" "' +
    req.body.edifice +
    '" "<' +
    req.body.mastodon +
    '>"';
  if (req.body.delete === "on") {
    command = "$oeuvre supprimer " + req.body.id;
  }
  let fields = { ...req.body, command };
  res.render("index", {
    route: "command",
    embedTitle: "Editeur",
    embedImage: "",
    embedDesc: "",
    command: { text: command },
  });
};
