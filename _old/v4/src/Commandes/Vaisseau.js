const { nouveauVaisseau } = require("../Data/Vaisseau");
let { CacheK } = require("../cache");

const creerVaisseau = async (c = {}, cmd = {}, joueuse = {}) => {
  if (cmd.monde !== process.env.OVERWORLD) return;
  await nouveauVaisseau(
    c,
    joueuse,
    cmd.command[2],
    cmd.command[3],
    cmd.command.slice(4, cmd.length),
    cmd.x,
    cmd.z
  );
};

const commencerTravail = async (c = {}, cmd = {}) => {
  console.log(CacheK);
  if (cmd.monde !== process.env.OVERWORLD) return;
  await travail(c, cmd.x, cmd.y, cmd.z);
};

const CmdVaisseau = async (c = {}, cmd = {}, joueuse = {}) => {
  if (cmd.command.length >= 4 && cmd.command[1] === "+") {
    await creerVaisseau(c, cmd, joueuse);
  }
};

exports.CmdVaisseau = CmdVaisseau;
