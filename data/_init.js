require("dotenv").load();
const Sequelize = require("sequelize");
console.log(process.env.DB_TYPE)
const db = {
	type: process.env.DB_TYPE || "sqlite",
	sqlitePath: process.env.DB_SQLITE_PATH || "./database.sqlite",
	database: process.env.DB || "database",
	username: process.env.DB_USERNAME || "username",
	password: process.env.DB_PASSWORD || "password",
	host: process.env.DATABASE_HOST || "localhost",
	port: process.env.DATABASE_PORT || "3000"
};

exports.sequelize = new Sequelize(db.database, db.username, db.password, {
	host: db.host,
	port: db.port,
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
