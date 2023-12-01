const obtenirJoueuse = async (c, nom) => {
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

exports.obtenirJoueuse = obtenirJoueuse;
