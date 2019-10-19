const dictionnary = require("./dictionnary");
const data = require("../data/_model");
const marked = require("marked");

exports.profile = async function(req, res) {
    let profile = { edit: false, picture: "", name: "", desc: "" };
  if (req.params.id || req.session.player) {
    let player = await data.Player.findById(req.params.id || req.session.player.id);
    profile.picture = player.dataValues.picture || ""
      profile.name = player.dataValues.name
      profile.desc = player.dataValues.desc || ""
  }
  if (!req.params.id && !req.session.player) {
    return res.redirect("/login");
  }
  res.render("index", {
    route: "profile",
    player: req.session.player || false,
    profileInfo: {
      edit: !req.params.id || req.session.player && req.params.id === req.session.player.id,
      name: profile.name,
	picture: profile.picture,
	desc: marked(profile.desc || ""),
	discord: profile.discordId
    },
    T:
      dictionnary[
        req.locale ||
        req.headers["accept-language"].split(";")[0].split(",")[0] === "fr"
          ? "fr"
          : "en"
      ]
  });
};
