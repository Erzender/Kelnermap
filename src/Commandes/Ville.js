const { nouvelleVille, enleverVille } = require("../Data/Ville");

const creerVille = async (c = {}, cmd = {}) => {
  if (cmd.monde !== process.env.OVERWORLD) return;
  await nouvelleVille(c, cmd.command[2], cmd.x, cmd.z);
};

const supprimerVille = async (c = {}, cmd = {}) => {
  if (cmd.monde !== process.env.OVERWORLD) return;
  await enleverVille(c, Number(cmd.command[2]));
};

const CmdVille = async (c = {}, cmd = {}, joueuse = {}) => {
  if (cmd.command.length >= 3 && cmd.command[1] === "+") {
    await creerVille(c, cmd);
  }
  if (cmd.command.length >= 3 && cmd.command[1] === "-") {
    await supprimerVille(c, cmd);
  }
};

exports.CmdVille = CmdVille;
