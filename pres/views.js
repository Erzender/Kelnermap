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
    return res.redirect("/");
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

exports.nations = async function(req, res) {
  let player = false;
  if (req.session.player) {
    player = await data.nations.getNation(req.session.player);
  }
  nations = await data.nations.getNations();
  res.render("index", {
    route: "nations",
    player: player[0],
    nations: nations
      .map(nation => ({
        name: nation.name,
        color: nation.color,
        player: nation.player,
        soutiens: nations.filter(nat =>
          nat.soutiens.find(soutien => soutien === nation.id)
        ).length,
        inhabitants: nations.filter(
          nat => nat.soutiens[0] && nat.soutiens[0] === nation.id
        ).length
      }))
      .sort((a, b) => a.inhabitants < b.inhabitants)
  });
};
