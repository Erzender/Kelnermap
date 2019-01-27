const dictionnary = require("./dictionnary")
const data = require("../data/_model");

exports.settings = async function(req, res) {
    res.render("index", {
      route: "settings",
      player: req.session.player || false,
      T: dictionnary[req.locale || req.headers["accept-language"].split(";")[0].split(",")[0] === "fr" ? "fr" : "en"]
    });
  };
  