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

exports.register = async function(req, res) {
  res.render("index", {
      route: "register",
      player: false,
    T: dict(req),
    message: ""
  });
};

exports.post = async function(req, res) {
  console.log(req.body);
  let rend = message =>
    res.render("index", {
      route: "register",
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
  if (req.body.password.length < 8) {
    return rend("Password too short");
  }
  let test = await data.Player.findOne({
    where: { name: req.body.username }
  });
  if (test) {
    return rend("Username used already");
  }
  try {
    let hash = await bcrypt.hash(req.body.password, 10);
    let player = await data.Player.create({
      name: req.body.username,
      password: hash
    });
  } catch (err) {
    console.error(err);
    return res.send(dict(req)("Panic"));
  }
  return res.render("index", {
    route: "redirection",
    T: dict(req),
    player: false,
    message: "User created",
    dest: "/login",
    destLabel: "Back to login"
  });
};
