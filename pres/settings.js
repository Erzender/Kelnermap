const dictionnary = require("./dictionnary");
const data = require("../data/_model");

exports.settings = async function(req, res) {
  if (!req.session.player || !req.session.player.id) {
    return res.redirect("/login");
  }
    let profile = { edit: false, desc: "", picture: "", name: "" };
  let player = await data.Player.findById(req.session.player.id);
  profile.picture = player.dataValues.picture || "";
    profile.name = player.dataValues.name;
    profile.desc = player.dataValues.desc || "";
  res.render("settings", {
    profileInfo: {
	picture: profile.picture,
	desc: profile.desc
    },
    message: "",
    T:
      dictionnary[
        req.locale ||
        req.headers["accept-language"].split(";")[0].split(",")[0] === "fr"
          ? "fr"
          : "en"
      ]
  });
};

exports.post = async function(req, res) {
  if (!req.session.player || !req.session.player.id) {
    return res.redirect("/login");
  }
  try {
      let player = await data.Player.findById(req.session.player.id);
      await player.update({ picture: req.body.picture, desc: req.body.desc });
    req.session.player = {
      id: player.dataValues.id,
      name: player.dataValues.name,
      picture: player.dataValues.picture
    };
  } catch (err) {
    console.log(err);
    return res.render("settings", {
      profileInfo: {
        ...req.body,
      },
      message: "",
      T:
        dictionnary[
          req.locale ||
          req.headers["accept-language"].split(";")[0].split(",")[0] === "fr"
            ? "fr"
            : "en"
        ]
    });
  }
  res.redirect("/profile");
};
