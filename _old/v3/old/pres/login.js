const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const dictionnary = require("./dictionnary");
const data = require("../data/_model");

const dict = req =>
  dictionnary[
    req.locale ||
    req.headers["accept-language"].split(";")[0].split(",")[0] === "fr"
      ? "fr"
      : "en"
  ];

exports.login = async function(req, res) {
  res.render("index", {
    route: "login",
    player: false,
    T: dict(req),
    message: ""
  });
};

exports.post = async function(req, res) {
  let rend = message =>
    res.render("index", {
      route: "login",
      player: false,
      T: dict(req),
      message: message
    });
  this.message = "";
  if (
    !req.body ||
    !req.body.username ||
    !req.body.password ||
    req.body.username.length === 0 ||
    req.body.password.length === 0
  ) {
    return rend("Missing fields");
  }
  let player = await data.Player.findOne({
    where: { name: req.body.username }
  });
  if (!player) {
    return rend("The player doesn't exist");
  }
  let pass = await bcrypt.compare(
    req.body.password,
    player.dataValues.password
  );
  if (!pass) {
    return rend("Wrong password");
  }
  req.session.player = {
    id: player.dataValues.id,
    name: player.dataValues.name,
    picture: player.dataValues.picture
  };
  res.redirect("/");
};
