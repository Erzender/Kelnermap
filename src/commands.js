const { MapWatcher } = require("./dynmap");
const { obtenirJoueuse } = require("./Data/Joueureuse");
const { CmdVille } = require("./Commandes/Ville");
const { CmdBatiment } = require("./Commandes/Batiment");
const { CmdRefuge } = require("./Commandes/Jeu");
let { CacheK } = require("./cache");

const commandes = {
  ville: CmdVille,
  bat: CmdBatiment,
  batiment: CmdBatiment,
  refuge: CmdRefuge,
  travail: CmdBatiment
};

const cleanPseudo = (string = "") => {
  let pseudo = "";
  let escape = false;
  for (let char in string) {
    if (!escape && string.charAt(char) !== "§") {
      pseudo += string.charAt(char);
    } else if (string.charAt(char) === "§") {
      escape = true;
    } else {
      escape = false;
    }
  }
  return pseudo;
};

const fixJsonShit = string => {
  let first = string.indexOf("[");
  let last = string.indexOf("]");

  let parts = [
    string.substring(0, first - 1),
    string.substring(first + 1, last).replaceAll(", ", " "),
    string.substring(last + 2)
  ];

  let reworked = [];
  let word = "";
  let opened = false;
  for (let char of parts[1]) {
    if (char === " " && !opened) {
      reworked.push(word);
      word = "";
    } else if (char === '"' && opened) {
      opened = false;
      reworked.push(word);
      word = "";
    } else if (char === '"' && !opened) {
      opened = true;
    } else {
      word += char;
    }
  }
  if (word.length > 0) reworked.push(word);
  return parts[0] + JSON.stringify(reworked) + parts[2];
};

class Commander {
  constructor(db = {}, client = {}) {
    this.c = db.c;
    this.discord = client;
    this.locked = false;
    this.map = new MapWatcher();
    this.joueuses = {};
  }

  async execCommand(command) {
    let joueureuse = await obtenirJoueuse(this.c, command.joueureuse);
    if (command.command.length > 0 && commandes[command.command[0]]) {
      try {
        await commandes[command.command[0]](
          this.c,
          this.discord.channels.cache.get(process.env.DISCORD_COMMAND_CHANNEL),
          command,
          joueureuse
        );
      } catch (err) {
        console.error(err);
      }
    }
  }

  async positionEvent() {
    let recalculerBatiments = false;
    if (CacheK["joueuses"] === undefined) {
      CacheK["joueuses"] = {};
    }
    for (joueuse of Object.keys(this.joueuses)) {
      if (CacheK["joueuses"][joueuse] === undefined)
        CacheK["joueuses"][joueuse] = {};
      let position = {
        monde: this.joueuses[joueuse].monde,
        tuile: {
          x: Math.round(this.joueuses[joueuse].x / 1000),
          z: Math.round(this.joueuses[joueuse].z / 1000)
        }
      };
      if (CacheK["joueuses"][joueuse].position !== position) {
        CacheK["joueuses"][joueuse]["position"] = position;
        recalculerBatiments = true;
      }
    }
    console.log(joueuses);
  }

  async exec() {
    if (this.locked) return;
    this.locked = true;
    let joueuses = await this.map.info();
    if (joueuses !== null && Object.keys(joueuses).length <= 0) return;
    if (
      joueuses !== null &&
      JSON.stringify(joueuses) !== JSON.stringify(this.joueuses)
    ) {
      this.joueuses = joueuses;
      // positionEvent();
    }

    let [res, f] = await this.c.query("SELECT * FROM request;");

    if (res.length > 0) {
      await this.c.query(
        "DELETE FROM request WHERE id IN (" +
          res.map(req => req.id).toString() +
          ")"
      );
      let commands = [];
      for (let command of res) {
        let obj = JSON.parse(fixJsonShit(command.content));
        commands.push({
          joueureuse: cleanPseudo(command.sender),
          type: obj.type,
          monde: obj.world,
          x: Math.floor(Number(obj.x)),
          y: Math.floor(Number(obj.y)),
          z: Math.floor(Number(obj.z)),
          command: obj.command
        });
      }
      for (let command of commands) {
        try {
          await this.execCommand(command);
        } catch (err) {
          console.error(err);
        }
      }
    }
    this.locked = false;
  }
}

exports.Commander = Commander;
