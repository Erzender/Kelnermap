const data = require("../_model");
const checkIsNationCitizen = require("../utils/citizenship")
  .checkIsNationCitizen;

exports.défier = async (client, message, args, player) => {
  if (!checkIsNationCitizen(player)) {
    return message.channel.send("Ce n'est pas en ton pouvoir.");
  }
  if (args.length < 3) {
    return message.channel.send(
      "Il faut définir une nation à attaquer, wallou."
    );
  }
  let nation = await data.Nation.findByPk(args[2]);
  let playerNation = await player.getIdentity();
  if (playerNation.dataValues.id === nation.dataValues.id) {
    return message.channel.send(
      "Tu vas pas attaquer ta propre nation, abruti."
    );
  }
  if (!playerNation.dataValues.stronghold || playerNation.dataValues.stronghold === "") {
    return message.channel.send(
      "La nation n'a pas de bastion et ne peut donc pas participer. Il faut `$nation changer bastion`"
    );
  }
  console.log(nation);
};
