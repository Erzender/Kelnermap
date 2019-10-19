exports.checkIsNationCitizen = player => {
  return (
    player.Identity !== null &&
    Object.keys(player.Citizenship).length > 0 &&
    Object.keys(player.Citizenship).map(
      i => player.Citizenship[i].dataValues.id === player.Identity.dataValues.id
    )
  );
};
