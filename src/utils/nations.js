const data = require("../_model");

exports.getNationRawList = async () => {
  const nations = await data.Nation.findAll();
  return nations.map(nation => ({
    id: nation.dataValues.id,
    name: nation.dataValues.name,
    regions: nation.dataValues.regions,
    color: nation.dataValues.color
  }));
};

exports.nationDesc = async id => {
  const nation = await data.Nation.findByPk(id);
  if (!nation) return null;
  const citizens = await data.Player.findAll({
    include: [
      {
        model: data.Nation,
        as: "Homelands",
        where: { id: nation.dataValues.id }
      }
    ]
  });
  return {
    id: nation.dataValues.id,
    name: nation.dataValues.name,
    desc: nation.dataValues.desc,
    color: nation.dataValues.color,
    pic: nation.dataValues.pic,
    hymne: nation.dataValues.hymne,
    stronghold: nation.dataValues.stronghold,
    citizens: citizens.map(citizen =>
      citizen.dataValues.picture !== null && citizen.dataValues.picture.length
        ? citizen.dataValues.picture
        : "https://vignette.wikia.nocookie.net/protagonists/images/d/d7/Alex.jpg/revision/latest?cb=20180206200812"
    )
  };
};
