const dictionnary = require("./dictionnary")
const data = require("../data");

exports.home = async function(req, res) {
    res.render("index", {
      route: "home",
      player: req.session.player || false,
      T: dictionnary[req.locale || req.headers["accept-language"].split(";")[0].split(",")[0] === "fr" ? "fr" : "en"]
    });
  };
  