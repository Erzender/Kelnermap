const data = require("../_model");
const moment = require("moment");

moment.locale("fr");
const getDateFormatted = date => moment(date).format("dddd d MMMM à LT");

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
