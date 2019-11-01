const data = require("../_model");

exports.checkIsNationCitizen = player => {
  return (
    player.Identity !== null &&
    Object.keys(player.Citizenship).length > 0 &&
    Object.keys(player.Citizenship).map(
      i => player.Citizenship[i].dataValues.id === player.Identity.dataValues.id
    )
  );
};

exports.getNationCitizens = async nation => {
  const citizens = await data.Player.findAll({
    include: [
      {
        model: data.Nation,
        as: "Citizenship",
        where: { id: nation.dataValues.id }
      },
      {
        model: data.Nation,
        as: "Identity",
        where: { id: nation.dataValues.id }
      }
    ]
  });
  return Object.keys(citizens).map(i => citizens[i].dataValues.discord);
};
