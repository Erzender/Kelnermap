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
  reputationPool: { type: Sequelize.INTEGER, defaultValue: 0 },
  regions: { type: Sequelize.STRING, defaultValue: "" }
});

const Battle = db.sequelize.define("battle", {
  status: { type: Sequelize.STRING, defaultValue: "initialized" }, // initialized, started, victory, defeat
  regionTarget: Sequelize.STRING,
  stronghold: Sequelize.STRING,
  date: Sequelize.DATE
});

Player.belongsTo(Nation, { as: "Identity" });
Player.belongsToMany(Nation, { as: "Homelands", through: "Citizenship" });
Battle.belongsTo(Nation, {
  as: "Belligerent",
  onDelete: "cascade",
  foreignKey: {
    allowNull: false
  }
});
Battle.belongsTo(Nation, {
  as: "Target",
  onDelete: "cascade",
  foreignKey: {
    allowNull: false
  }
});
Battle.belongsToMany(Player, { as: "Invaders", through: "Invasion" });
Battle.belongsToMany(Player, { as: "Defenders", through: "Defense" });

exports.Player = Player;
exports.Nation = Nation;
exports.Battle = Battle;
