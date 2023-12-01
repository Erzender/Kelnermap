const { nouveauBatiment } = require("../Data/Batiment");

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

const CmdBatiment = async (c = {}, cmd = {}, joueuse = {}) => {
  if (cmd.command.length >= 4 && cmd.command[1] === "+") {
    await creerBatiment(c, cmd);
  }
};

exports.CmdBatiment = CmdBatiment;
