const { nouveauBatiment, travail } = require("../Data/Batiment");
let { CacheK } = require("../cache");

const creerBatiment = async (c = {}, cmd = {}) => {
  if (cmd.monde !== process.env.OVERWORLD) return;
  await nouveauBatiment(
    c,
    cmd.command[2],
    cmd.command[3],
    cmd.command.slice(4, cmd.length - 1),
    cmd.x,
    cmd.y,
    cmd.z
  );
};

const commencerTravail = async (c = {}, cmd = {}) => {
  console.log(CacheK);
  if (cmd.monde !== process.env.OVERWORLD) return;
  await travail(c, cmd.x, cmd.y, cmd.z);
};

const CmdBatiment = async (c = {}, discord = {}, cmd = {}, joueuse = {}) => {
  // if (cmd.command[0] === "travail") {
  //   await commencerTravail(c, cmd);
  // }
  if (cmd.command.length >= 4 && cmd.command[1] === "+") {
    await creerBatiment(c, cmd);
  }
};

exports.CmdBatiment = CmdBatiment;
