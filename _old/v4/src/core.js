const { db } = require("./data");
const { MapWatcher } = require("./dynmap");
const { obtenirJoueuse } = require("./Data/Joueureuse");
const { CronJob } = require("cron");

let { CacheK } = require("./cache");

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
  constructor() {
    const job = new CronJob(
      "* * * * * *", // cronTime
      () => {
        this.exec();
      }, // onTick
      null, // onComplete
      true, // start
      "Europe/Paris" // timeZone
    );
    this.c = db.c;
    this.locked = false;
    this.map = new MapWatcher();
    this.joueuses = {};
    this.onCommand = () => {};
  }

  command(func) {
    this.onCommand = func;
  }

  async exec() {
    if (!db.c) {
      return;
    }
    let [res, f] = await db.c.query("SELECT * FROM request;");

    if (res.length > 0) {
      await db.c.query(
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
        this.onCommand(command);
      }
    }
    this.locked = false;
  }
}
module.exports = new Commander();
