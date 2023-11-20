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

class Commander {
  constructor(db = {}) {
    this.db = db;
  }

  execCommand(command) {
    console.log(command);
  }

  async exec() {
    let res = await this.db.query("SELECT * FROM request;");

    if (res.length > 0) {
      await this.db.query("TRUNCATE TABLE request;");
      let commands = [];
      for (let command of res) {
        let obj = JSON.parse(command.content);
        commands.push({
          joueur: cleanPseudo(command.sender),
          type: obj.type,
          monde: obj.world,
          x: Math.floor(Number(obj.x)),
          y: Math.floor(Number(obj.y)),
          z: Math.floor(Number(obj.z)),
          command: obj.command.replace("[", "").replace("]", "").split(", ")
        });
      }
      for (let command of commands) {
        this.execCommand(command);
      }
    }
  }
}

exports.Commander = Commander;
