const data = require("../_model");
const moment = require("moment");

moment.locale("fr");
const getDateFormatted = date => moment(date).format("dddd D MMMM à LT");

exports.getDateFormatted = getDateFormatted;

exports.getWar = async () => {
  const battle = await data.Battle.findOne({
    where: { status: "initialized" }
  });
  return battle
    ? {
        stronghold: {
          x: parseInt(battle.dataValues.stronghold.split(" X")[0]),
          z: parseInt(
            battle.dataValues.stronghold.split(" Z")[0].split("| ")[2]
          )
        },
        date: getDateFormatted(battle.dataValues.date)
      }
    : null;
};

exports.getLeaderBoard = async () => {
  let players = await data.Player.findAll({
    include: [
      {
        model: data.Nation,
        as: "Identity"
      }
    ]
  });
  let leaderBoard = players
    .map(player => ({
      picture:
        player.dataValues.picture !== null && player.dataValues.picture.length
          ? player.dataValues.picture
          : "https://vignette.wikia.nocookie.net/protagonists/images/d/d7/Alex.jpg/revision/latest?cb=20180206200812",
      desc: player.dataValues.desc,
      name: player.dataValues.minecraft,
      reputation: player.dataValues.reputation,
      nation: player.Identity && player.Identity.dataValues.pic,
      nationId: player.Identity && player.Identity.dataValues.id
    }))
    .sort((p1, p2) => p1.reputation < p2.reputation);
  return leaderBoard;
};
