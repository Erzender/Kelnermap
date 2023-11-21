const mysql = require("mysql2/promise");
let db = {};

const init = async () => {
  db["c"] = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT
  });
};

init();
exports.db = db;

/*

VILLE
- id*
- nom
- x
- z
- admin
- mine
- ressource
- netherite

BATIMENT
- id*
- nom
- x
- z
- taille => {x,z}
- type
- specification
- VILLE

MODELE
- nom*
- type
- entree => {x,y,z}
- modules => [{x1,y1,z1,x2,y2,z2,type}]

VAISSEAU
- id*
- nom
- modele
- x
- z
- entree => {x,y,z}
- modules => [{x1,y1,z1,x2,y2,z2,type,utilisation}]
- hyperdrive => bool
- ressource
- netherite
- plateforme => null | BATIMENT
- hangar => null | VAISSEAU
- hangarNo => null | Int
- itineraire => null | [{x,y,VILLE}]
- heureDepart

JOUEUREUSE
- nom*
- x
- z
- vaisseau => null | VAISSEAU
- habite => null | VILLE
- inventaire => null | "ressource" | "netherite"
- travail => null | {BATIMENT, debut, duree}

*/
