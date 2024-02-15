const { majCoordonnees } = require("../Data/Joueureuse");
let { CacheK } = require("../cache");

const CmdRefuge = async (c = {}, cmd = {}, joueuse = {}) => {
  console.log(joueuse);
  if (cmd.monde === process.env.OVERWORLD) {
    await majCoordonnees(c, joueuse.id, cmd.x, cmd.y, cmd.z);
    CacheK.discord.send("mvtp " + joueuse.nom + " " + process.env.REFUGE);
    // CacheK.discord.send(
    //     "tellraw " + joueuse.nom + ' {"text":"I am blue","color":"blue"}'
    //   );
  } else {
    CacheK.discord.send(
      `mvtp ${joueuse.nom} e:${process.env
        .OVERWORLD}:${joueuse.x},${joueuse.y},${joueuse.z}`
    );
  }
};

exports.CmdRefuge = CmdRefuge;
