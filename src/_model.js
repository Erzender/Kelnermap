const Sequelize = require("sequelize");
const db = require("./_data");

const Player = db.sequelize.define("player", {
  discord: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  picture: Sequelize.STRING,
  desc: { type: Sequelize.TEXT, defaultValue: "" },
  reputation: { type: Sequelize.INTEGER, defaultValue: 0 }
});

const Nation = db.sequelize.define("nation", {
  name: { type: Sequelize.STRING, unique: true },
  color: { type: Sequelize.STRING, defaultValue: "#777777" },
  desc: { type: Sequelize.TEXT, defaultValue: "" },
  pic: Sequelize.STRING,
  stronghold: Sequelize.STRING,
  reputationPool: { type: Sequelize.INTEGER, defaultValue: 0 }
});

const Battle = db.sequelize.define("battle", {
  next: Sequelize.BOOLEAN,
});

Player.hasOne(Nation, { as: "Identity" });
Player.hasMany(Nation, { as: "Citizenship" });
Battle.belongsTo(Nation, { as: "Belligerent" });
Battle.belongsTo(Nation, { as: "Target" });
Player.hasOne(Nation, { as: "Favour" });

exports.Player = Player;
exports.Nation = Nation;
exports.Battle = Battle;
