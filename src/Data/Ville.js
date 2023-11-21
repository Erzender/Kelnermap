const nouvelleVille = async (c, nom = "", x = 0, z = 0) => {
  let [
    proche,
    f
  ] = await c.query(
    "SELECT id, x, z, SQRT(POW(x - ?, 2) + POW(? - z, 2)) AS distance FROM Ville HAVING distance < 10000;",
    [x, z]
  );
  let admin = true;
  if (proche.length > 0) {
    admin = false;
  }

  await c.query("INSERT INTO Ville (nom, x, z, admin) VALUES(?, ?, ?, ?)", [
    nom,
    x,
    z,
    admin
  ]);
};

const enleverVille = async (c, id = 0) => {
  await c.query("DELETE FROM Ville WHERE id = ?", [id]);
};

exports.nouvelleVille = nouvelleVille;
exports.enleverVille = enleverVille;
