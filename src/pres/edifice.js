const data = require("../_model");
const regions = require("../regionInfo.json");
const mastodonUtils = require("../utils/mastodon");

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
    return res
      .status(404)
      .render("index", { route: "404", embedTitle: "404", embedImage: "" });
  }
  let mastodon = await mastodonUtils.getComments(edifice.dataValues.mastodon);

  res.render("index", {
    route: "edifice",
    embedTitle: edifice.dataValues.name,
    embedImage: edifice.dataValues.pic,
    mastodon,
    edifice: {
      ...edifice.dataValues,
      edit: "/lekelner/explorer/edifices/editeur?id=" + edifice.dataValues.id,
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

exports.getEditor = async function(req, res) {
  let fields = {
    id: -1,
    title: "Créer un nouvel édifice :",
    name: "",
    description: "",
    picture: "",
    region: req.query.region ? req.query.region : "1",
    mastodon: "",
    command: ""
  };
  if (req.query.id) {
    let edifice = await data.Edificio.findByPk(req.query.id, {
      include: [
        {
          model: data.Player,
          as: "Creator"
        }
      ]
    });

    if (edifice === null) {
      return res
        .status(404)
        .render("index", { route: "404", embedTitle: "404", embedImage: "" });
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
    fields,
    regions: Object.keys(regions).map(key => ({ key, value: regions[key].n }))
  });
};

exports.postEditor = async function(req, res) {
  S;
  let command = "$édifice ";
  command += req.body.id >= 0 ? "changer " + req.body.id + " " : "créer ";
  command +=
    '"' +
    req.body.name +
    '" "' +
    req.body.description +
    '" "' +
    req.body.picture +
    '" "' +
    req.body.region +
    '" "' +
    req.body.mastodon +
    '"';
  if (req.body.delete === "on") {
    command = "$édifice supprimer " + req.body.id;
  }
  let fields = { ...req.body, command };
  res.render("index", {
    route: "edificeEdit",
    embedTitle: "Editeur",
    embedImage: "",
    fields,
    regions: Object.keys(regions).map(key => ({ key, value: regions[key].n }))
  });
};
