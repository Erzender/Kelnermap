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
  const nation = await data.Nation.findOne(id);
  if (!nation) return null;
  const citizens = await data.Player.findAll({
    include: [
      {
        model: data.Nation,
        as: "Homelands",
        where: { id: nation.dataValues.id }
      },
      {
        model: data.Nation,
        as: "Identity",
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
    stronghold: nation.dataValues.stronghold,
    citizens: citizens.map(citizen => citizen.dataValues.picture)
  };
};
