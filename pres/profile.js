const dictionnary = require("./dictionnary");
const data = require("../data/_model");

exports.profile = async function(req, res, id) {
  let profile = { edit: false, picture: "", name: "" };
  if (id) {
    let player = await data.Player.findById(id);
    profile.picture = player.dataValues.picture || ""
    profile.name = player.dataValues.name
  }
  res.render("index", {
    route: "profile",
    player: req.session.player || false,
    profileInfo: {
      edit: req.session.player && id === req.session.player.id,
      name: profile.name,
      picture: profile.picture
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
