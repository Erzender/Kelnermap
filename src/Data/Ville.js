const nouvelleVille = async (c, nom = "", x = 0, z = 0) => {
  let [
    proche,
    f
  ] = await c.query(
    "SELECT id, admin, x, z, SQRT(POW(x - ?, 2) + POW(? - z, 2)) AS distance FROM Ville WHERE admin = true HAVING distance < 10000;",
    [x, z]
  );
  let admin = true;
  if (proche.length > 0) {
    admin = false;
  }

  let [
    mineProche,
    f2
  ] = await c.query(
    "SELECT id, extraction, x, z, SQRT(POW(x - ?, 2) + POW(? - z, 2)) AS distance FROM Ville WHERE extraction = true HAVING distance < 1000000;",
    [x, z]
  );
  let extraction = true;
  if (mineProche.length > 0) {
    extraction = false;
  }

  await c.query(
    "INSERT INTO Ville (nom, x, z, admin, extraction) VALUES(?, ?, ?, ?, ?)",
    [nom, x, z, admin, extraction]
  );
};

const enleverVille = async (c, id = 0) => {
  await c.query("DELETE FROM Ville WHERE id = ?", [id]);
};

const depot = async (c, cmd = {}, joueuse = {}) => {
  if (joueuse.inventaire === null) {
    console.log("Il n'y a rien dans l'inventaire à déposer.");
    return;
  }
  let [
    ville,
    f
  ] = await c.query(
    "SELECT id, x, z, SQRT(POW(x - ?, 2) + POW(? - z, 2)) AS distance FROM Ville HAVING distance < 100 ORDER BY distance DESC LIMIT 1;",
    [cmd.x, cmd.z]
  );
  if (ville.length <= 0) {
    console.log(
      "C'est bien trop loin du centre d'aucune ville pour y déposer quoi que ce soit."
    );
    return;
  }

  let ressource = joueuse.inventaire === "ressource" ? 1 : 0;
  let netherite = joueuse.inventaire === "netherite" ? 1 : 0;

  await c.query(
    "UPDATE Ville SET ressource = ressource + ?, netherite = netherite + ? WHERE id = ?;",
    [ressource, netherite, ville[0].id]
  );
  await c.query("UPDATE Joueureuse SET inventaire = NULL WHERE id = ?;", [
    joueuse.id
  ]);
};

const maisonsDisponiblesDansVille = async (c, idVille = 0) => {
  let [
    maisons
  ] = await c.query(
    'SELECT COUNT(Batiment.id) AS maisons FROM Batiment JOIN Ville on Batiment.ville = Ville.id WHERE Ville.id = ? AND Batiment.type = "maison";',
    [idVille]
  );
  let [
    autres
  ] = await c.query(
    'SELECT COUNT(Batiment.id) AS autres FROM Batiment JOIN Ville on Batiment.ville = Ville.id WHERE Ville.id = ? AND Batiment.type != "maison";',
    [idVille]
  );
  return maisons[0].maisons - autres[0].autres;
};

exports.nouvelleVille = nouvelleVille;
exports.enleverVille = enleverVille;
exports.depot = depot;
exports.maisonsDisponiblesDansVille = maisonsDisponiblesDansVille;
