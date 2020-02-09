const Sequelize = require("sequelize");

const db = {
  type: "sqlite",
  sqlitePath: "./database.sqlite",
  database: "lekelner"
};

const sequelize = new Sequelize(db.database, "", "", {
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

sequelize.query("PRAGMA case_sensitive_like=ON;");

exports.sequelize = sequelize;
