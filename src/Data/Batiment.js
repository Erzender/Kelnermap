const { maisonsDisponiblesDansVille } = require("./Ville");

const nouveauBatiment = async (
  c,
  type = "",
  nom = "",
  specification = [],
  x = 0,
  y = 0,
  z = 0
) => {
  let [
    ville,
    f
  ] = await c.query(
    "SELECT id, nom, ressource, SQRT(POW(x - ?, 2) + POW(? - z, 2)) AS distance FROM Ville HAVING distance < 10000 ORDER BY distance DESC LIMIT 1;",
    [x, z]
  );
  if (ville.length <= 0) {
    console.log("Il n'y a pas de ville ici.");
    return;
  } else {
    ville = ville[0];
  }
  let maisonsDisponibles = await maisonsDisponiblesDansVille(c, ville.id);

  let consommation = { ressource: 0, netherite: 0 };
  switch (type) {
    case "maison":
      if (ville.ressource <= 0) {
        console.log(
          "Il faut au moins une ressource dans la ville pour construire une maison."
        );
        return;
      }
      consommation.ressource = 1;
      break;
    case "atelier":
      if (ville.ressource <= 0 || maisonsDisponibles <= 0) {
        console.log(
          "Il faut au moins une ressource dans la ville ainsi qu'une maison disponible pour construire un bâtiment d'atelier quelconque. Actuellement il y a : " +
            ville.ressource +
            " ressources et " +
            maisonsDisponibles +
            " maisons disponibles à " +
            ville.nom
        );
        return;
      }
      consommation.ressource = 1;
      break;
  }
  await c.query(
    "INSERT INTO Batiment (nom, x, y, z, type, ville) VALUES(?, ?, ?, ?, ?, ?)",
    [nom, x, y, z, type, ville.id]
  );

  await c.query(
    "UPDATE Ville SET ressource = ressource - ?, netherite = netherite - ? WHERE id = ?;",
    [consommation.ressource, consommation.netherite, ville.id]
  );
};

exports.nouveauBatiment = nouveauBatiment;
