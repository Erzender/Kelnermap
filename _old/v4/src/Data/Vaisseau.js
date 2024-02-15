let { CacheK } = require("../cache");

const VAISSEAU_TYPES_RESSOURCES = {
  8: 1,
  16: 4,
  32: 16,
  64: 64,
  128: 256
};

const nouveauVaisseau = async (
  c,
  joueureuse,
  type = "",
  nom = "",
  specification = [],
  x = 0,
  z = 0
) => {
  let [
    bat,
    f
  ] = await c.query(
    'SELECT Batiment.id as BId, Batiment.nom as BNom, Vaisseau.id as VId, Vaisseau.nom as VNom, Vaisseau.type as VType, SQRT(POW(Batiment.x - ?, 2) + POW(? - Batiment.z, 2)) AS distance FROM Batiment LEFT JOIN Vaisseau ON Batiment.id = Vaisseau.plateforme WHERE Batiment.type = "plateforme" HAVING distance < 5 ORDER BY distance DESC LIMIT 1;',
    [x, z]
  );
  if (bat.length <= 0) {
    CacheK.discord.send(
      "tellraw " +
        joueureuse.nom +
        ` {"text":"Approcher du centre d'une plateforme disponible pour créer un vaisseau !","color":"yellow"}`
    );
    return;
  }
  if (bat[0].VId !== null) {
    CacheK.discord.send(
      "tellraw " +
        joueureuse.nom +
        " " +
        JSON.stringify([
          { text: "Plateforme occupée par un vaisseau : ", color: "red" },
          {
            text: bat[0].VNom,
            color: "white",
            underlined: "true",
            hoverEvent: { action: "show_text", value: "Type " + bat[0].VType }
          }
        ])
    );
    return;
  }
  if (!Object.keys(VAISSEAU_TYPES_RESSOURCES).includes(type)) {
    CacheK.discord.send(
      `tellraw ${joueureuse.nom} ${JSON.stringify({
        text: "Les types de vaisseaux valides sont : 8, 16, 32, 64, 128",
        color: "red"
      })}`
    );

    return;
  }

  let [
    res,
    f2
  ] = await c.query(
    "INSERT INTO Vaisseau (nom, type, plateforme) VALUES(?, ?, ?)",
    [nom, type, bat[0].BId]
  );

  CacheK.discord.send(
    `mvtp ${joueureuse.nom} e:${process.env.VAISSEAU}:${res.insertId *
      2000},${-60},${0}`
  );

  await c.query("UPDATE Joueureuse SET vaisseau = ? WHERE id = ?;", [
    res.insertId,
    joueureuse.id
  ]);
  console.log(res.insertId);
};

exports.nouveauVaisseau = nouveauVaisseau;
