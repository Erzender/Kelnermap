const nouvelleJoueuse = async (c, nom) => {
  await c.query("INSERT INTO Joueureuse (nom, x, z) VALUES(?, 0, 0)", nom);
  let [joueuse, f] = await c.query("SELECT * FROM Joueureuse WHERE nom = ?;", [
    nom
  ]);
  return joueuse;
};

exports.nouvelleJoueuse = nouvelleJoueuse;
