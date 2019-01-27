const dictionnary = require("./dictionnary")
const data = require("../data");

exports.nations = async function(req, res) {
  nations = await data.nations.getNations();
  res.render("index", {
    route: "nations",
    player: !!req.session.player,
    T:
      dictionnary[
        req.locale ||
        req.headers["accept-language"].split(";")[0].split(",")[0] === "fr"
          ? "fr"
          : "en"
      ],
    nations: nations
      .map(nation => ({
        name: nation.name,
        color: nation.color,
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
