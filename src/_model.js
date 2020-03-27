const Sequelize = require("sequelize");
const db = require("./_data");

const Player = db.sequelize.define("player", {
  discord: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  minecraft: Sequelize.STRING,
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
  regions: { type: Sequelize.STRING, defaultValue: "" },
  hymne: { type: Sequelize.STRING }
});

const Battle = db.sequelize.define("battle", {
  status: { type: Sequelize.STRING, defaultValue: "initialized" }, // initialized, started, victory, defeat
  regionTarget: Sequelize.STRING,
  stronghold: Sequelize.STRING,
  date: Sequelize.DATE
});

const Edificio = db.sequelize.define("edificio", {
  name: Sequelize.STRING,
  desc: { type: Sequelize.TEXT, defaultValue: "" },
  pic: Sequelize.STRING,
  region: Sequelize.STRING
});

const Art = db.sequelize.define("art", {
  name: Sequelize.STRING,
  desc: { type: Sequelize.TEXT, defaultValue: "" },
  pic: Sequelize.STRING
});

const Shop = db.sequelize.define("shop", {
  name: Sequelize.STRING,
  desc: { type: Sequelize.TEXT, defaultValue: "" }
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

Edificio.belongsTo(Player, {
  as: "Creator"
});
Art.belongsTo(Player, {
  as: "Artist"
});
Art.belongsTo(Edificio, { as: "Place" });
Shop.belongsTo(Player, {
  as: "Seller",
  onDelete: "cascade",
  foreignKey: {
    allowNull: false
  }
});
Shop.belongsTo(Edificio, { as: "Place" });

exports.Player = Player;
exports.Nation = Nation;
exports.Battle = Battle;
exports.Edificio = Edificio;
exports.Art = Art;
exports.Shop = Shop;
