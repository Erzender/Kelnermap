const { obtenirJoueuse } = require("./Data/Joueureuse");
const { CmdVille } = require("./Commandes/Ville");
const { CmdBatiment } = require("./Commandes/Batiment");

const commandes = {
  ville: CmdVille,
  bat: CmdBatiment,
  batiment: CmdBatiment
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
  constructor(db = {}) {
    this.c = db.c;
    this.locked = false;
  }

  async execCommand(command) {
    let joueureuse = await obtenirJoueuse(this.c, command.joueureuse);
    if (command.command.length > 0 && commandes[command.command[0]]) {
      try {
        await commandes[command.command[0]](this.c, command, joueureuse);
      } catch (err) {
        console.error(err);
      }
    }
  }

  async exec() {
    if (this.locked) return;
    this.locked = true;
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
