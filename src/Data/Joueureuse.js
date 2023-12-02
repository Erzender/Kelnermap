const obtenirJoueuse = async (c, nom = "") => {
  let [joueuse, f] = await c.query("SELECT * FROM Joueureuse WHERE nom = ?;", [
    nom
  ]);
  if (joueuse.length <= 0) {
    await c.query(
      "INSERT INTO Joueureuse (nom, x, z, inventaire) VALUES(?, 0, 0, ?)",
      [nom, "ressource"]
    );
    [joueuse, f] = await c.query("SELECT * FROM Joueureuse WHERE nom = ?;", [
      nom
    ]);
  }
  return joueuse[0];
};

const majCoordonnees = async (c, id = 0, x = 0, y = 0, z = 0) => {
  await c.query("UPDATE Joueureuse SET x = ?, y = ?, z = ? WHERE id = ?;", [x, y, z, id]);
};

exports.obtenirJoueuse = obtenirJoueuse;
exports.majCoordonnees = majCoordonnees;
