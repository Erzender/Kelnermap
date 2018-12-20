const jwt = require("jsonwebtoken");

const data = require("../data");

exports.login = async function(req, res) {
  let player = false;
  if (req.session.player) {
    player = await data.nations.getNation(req.session.player);
  }
  if (req.query.token) {
    try {
      var decoded = jwt.verify(req.query.token, "shhhhh");
    } catch (err) {
      console.error(err);
    }
  }
  if (decoded && decoded.player) {
    req.session.player = decoded.player;
    return res.redirect("/lekelner");
  }
  res.render("index", {
    route: "login",
    player: player[0]
  });
};

exports.home = async function(req, res) {
  let player = false;
  if (req.session.player) {
    player = await data.nations.getNation(req.session.player);
  }
  res.render("index", {
    route: "home",
    player: player[0]
  });
};

exports.map = async function(req, res) {
  let player = false;
  if (req.session.player) {
    player = await data.nations.getNation(req.session.player);
  }
  res.render("index", {
    route: "map",
    player: player[0]
  });
};
