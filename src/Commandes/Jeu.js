const { majCoordonnees } = require("../Data/Joueureuse");

const CmdRefuge = async (c = {}, discord = {}, cmd = {}, joueuse = {}) => {
  console.log(joueuse);
  if (cmd.monde === process.env.OVERWORLD) {
    await majCoordonnees(c, joueuse.id, cmd.x, cmd.y, cmd.z);
    discord.send("mvtp " + joueuse.nom + " " + process.env.REFUGE);
    // discord.send(
    //     "tellraw " + joueuse.nom + ' {"text":"I am blue","color":"blue"}'
    //   );
  } else {
    discord.send(
      `mvtp ${joueuse.nom} e:${process.env
        .OVERWORLD}:${joueuse.x},${joueuse.y},${joueuse.z}`
    );
  }
};

exports.CmdRefuge = CmdRefuge;
