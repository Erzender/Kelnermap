const Sequelize = require("sequelize");
const db = require("./_init");

const Player = db.sequelize.define("player", {
  discordId: Sequelize.STRING,
  name: { type: Sequelize.STRING, unique: true },
  desc: Sequelize.TEXT,
  password: Sequelize.STRING,
  picture: Sequelize.STRING,
  rank: Sequelize.STRING
});

const Nation = db.sequelize.define("nation", {
  name: { type: Sequelize.STRING, unique: true },
  desc: Sequelize.TEXT,
  color: Sequelize.STRING
});

const Tile = db.sequelize.define("tile", {
  x: Sequelize.INTEGER,
  z: Sequelize.INTEGER
});

const City = db.sequelize.define("city", {
  name: Sequelize.STRING,
  desc: Sequelize.TEXT,
  x: Sequelize.INTEGER,
  z: Sequelize.INTEGER
});

const Building = db.sequelize.define("building", {
  name: Sequelize.STRING,
  desc: Sequelize.TEXT,
  x: Sequelize.INTEGER,
  z: Sequelize.INTEGER
});

const Shop = db.sequelize.define("shop", {
  buying: Sequelize.BOOLEAN,
  item: Sequelize.STRING
});

const Art = db.sequelize.define("art", {
  name: Sequelize.STRING,
  desc: Sequelize.TEXT,
  type: Sequelize.STRING
});

const Craft = db.sequelize.define("craft", {
  name: Sequelize.STRING,
  desc: Sequelize.TEXT,
  picture: Sequelize.STRING,
  price: Sequelize.INTEGER
});

const Order = db.sequelize.define("order", {
  x: Sequelize.INTEGER,
  z: Sequelize.INTEGER
});

const Thread = db.sequelize.define("thread", {
  name: Sequelize.STRING,
  desc: Sequelize.STRING
});

const Message = db.sequelize.define("message", {
  content: Sequelize.TEXT
});

const Translation = db.sequelize.define("translation", {
  content: Sequelize.TEXT
});

// Player -> Nation -> Tiles
Nation.belongsTo(Player);
Player.hasOne(Nation);
Nation.hasMany(Tile);
Tile.belongsTo(Nation);

// Player -> Soutiens
Player.hasMany(Nation, { as: "Soutiens" });

// Cities -> Buildings -> Arts
City.hasMany(Building);
Building.hasMany(Art);
// Building -> Shops
Building.hasMany(Shop);

// Craft -> Orders
Craft.hasMany(Order);

// Player -> Buildings | Arts | Crafts | Orders
Player.hasMany(Building);
Building.belongsTo(Player);
Player.hasMany(Art);
Art.belongsTo(Player);
Player.hasMany(Craft);
Craft.belongsTo(Player);
Player.hasMany(Order);
Order.belongsTo(Player);

// Thread -> Messages -> Translations
Thread.hasMany(Message);
Message.belongsTo(Thread);
Message.hasMany(Translation);
Translation.belongsTo(Message);

// Player -> Messages | Translations
Message.hasOne(Player, { as: "Author" });
Translation.hasOne(Player, { as: "Author" });

exports.Player = Player;
exports.Nation = Nation;
exports.Tile = Tile;
exports.City = City;
exports.Building = Building;
exports.Shop = Shop;
exports.Art = Art;
exports.Craft = Craft;
exports.Order = Order;
exports.Thread = Thread;
exports.Message = Message;
exports.Translation = Translation;
