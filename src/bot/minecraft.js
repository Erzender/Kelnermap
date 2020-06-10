const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const regions = require("../../config/regionInfo.json");
const data = require("../_model");
const mc = require("../utils/minecraft");

exports.SERPILLER = async (client, message, args, player) => {
  message.channel.send("weather Theia clear");
  message.channel.send(
    `tellraw @a ["",{"text":"["},{"text":"SERPILLER","bold":true,"color":"dark_red"},{"text":">","bold":true},{"text":" A","obfuscated":true,"color":"gold"},{"text":"QUE LA LUMIERE SAUCE !","color":"gold"},{"text":"A","obfuscated":true,"color":"gold"}]`
  );
};

exports.ZAAPER = async (client, message, args, player) => {
  let cities = Object.keys(regions)
    .filter((elem) => regions[elem].city && regions[elem].city.governor)
    .map((elem) => ({ ...regions[elem].city, id: elem }));
  if (args.length < 2) {
    return message.channel.send(
      ` tellraw ${
        player.dataValues.minecraft
      } ["",{"text":"["},{"text":"ZAAPER","bold":true,"color":"dark_red"},{"text":"> ","bold":true},{"text":"Jeune fouf, tu as oublié de choisir une de nos destinations GENIALES : ${cities.reduce(
        (prev, elem) => prev + elem.tag + ", ",
        ""
      )}","color":"gold"}]`
    );
  }
  if (cities.findIndex((city) => city.tag === args[1]) < 0)
    return message.channel.send(
      `tellraw ${
        player.dataValues.minecraft
      } ["",{"text":"["},{"text":"ZAAPER","bold":true,"color":"dark_red"},{"text":">","bold":true},{"text":" Hihohaha, mais cette destination n'existe PAS. On a juste : ${cities.reduce(
        (prev, elem) => prev + elem.tag + ", ",
        ""
      )}","color":"gold"}]`
    );
  let city = cities.find((elem) => elem.tag === args[1]);
  let governor = await data.Player.findByPk(city.governor, {
    include: [
      {
        model: data.Nation,
        as: "Identity",
      },
    ],
  });
  if (!governor) return;
  let whiteliste = await data.Diplomacy.findAll(
    {
      where: { originId: governor.dataValues.IdentityId, type: "FRIENDLY" },
    },
    { include: [{ model: data.Nation, as: "target" }] }
  );
  whiteliste = whiteliste.map((elem) => elem.dataValues.targetId);
  whiteliste.push(governor.dataValues.IdentityId);
  let whitelisted = await data.Player.findOne({
    where: { discord: player.dataValues.discord },
    include: [
      {
        model: data.Nation,
        as: "Homelands",
        through: "Citizenship",
        where: { id: { [Op.in]: whiteliste } },
      },
    ],
  });
  let inhabitant = await data.Player.findOne({
    where: {
      discord: player.dataValues.discord,
      identityId: { [Op.in]: whiteliste },
    },
  });
  if (whitelisted === null && inhabitant === null)
    return message.channel.send(
      `tellraw ${player.dataValues.minecraft} ["",{"text":"["},{"text":"ZAAPER","bold":true,"color":"dark_red"},{"text":">","bold":true},{"text":" La Nation du gouverneur de cette ville n'autorise pas ton déplacement. Olala, ce n'est pas possible !","color":"gold"}]`
    );
  let edifices = (await data.Edificio.findAll({ where: { region: city.id } }))
    .length;
  let arts = (
    await data.Art.findAll({
      include: [
        { model: data.Edificio, as: "Place", where: { region: city.id } },
      ],
    })
  ).length;
  let conquista = await data.Nation.findOne({
    where: {
      regions: {
        [Op.substring]:
          "[" + (regions[city.id].suze ? regions[city.id].suze : city.id) + "]",
      },
    },
  });
  conquista = {
    name: conquista ? conquista.dataValues.name : "Territoire libre",
    color: conquista ? conquista.dataValues.color : "#FFFFFF",
  };
  message.channel.send("mvtp " + player.dataValues.minecraft + " Refuge");
  message.channel.send(
    "tp " +
      player.dataValues.minecraft +
      " " +
      city.coor[0] +
      " 150 " +
      city.coor[1]
  );
  message.channel.send(`title ${player.dataValues.minecraft} times 20 200 20`);
  message.channel.send(
    `title ${player.dataValues.minecraft} subtitle ["",{"text":"${
      governor.dataValues.minecraft
        ? "Gouverneur : " + governor.dataValues.minecraft + " |"
        : ""
    }"},{"text":" Edifices : ${edifices}","color":"dark_aqua"},{"text":" | Oeuvres : ${arts}","color":"dark_purple"},{"text":" ${
      regions[city.id].suze
        ? "| Région : " + regions[regions[city.id].suze].n
        : ""
    }","color":"gold"}]`
  );
  message.channel.send(
    `title ${player.dataValues.minecraft} title {"text":"${
      regions[city.id].n
    } - ${conquista.name}","color":"${mc.convertColor(conquista.color)[1]}"}`
  );
};
