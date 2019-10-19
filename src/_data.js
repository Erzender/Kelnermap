const Sequelize = require("sequelize");

const db = {
  type: "sqlite",
  sqlitePath: "./database.sqlite",
  database: "lekelner"
};

exports.sequelize = new Sequelize(db.database, "", "", {
  dialect: db.type,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  storage: db.sqlitePath,

  operatorsAliases: false
});
