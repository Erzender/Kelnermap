const express = require("express");
const router = express.Router();

const edifice = require("./edifice");
const region = require("./region");
const player = require("./player");
const nation = require("./nation");

router.get("/", function (req, res) {
  res.send("Ouais j'ai pas encore mis de page ici");
});

router.get("/edifices", edifice.getAll);
router.get("/edifices/editeur", edifice.getEditor);
router.post("/edifices/editeur", edifice.postEditor);
router.get("/edifices/:id", edifice.get);

router.get("/regions", region.getAll);
router.get("/regions/:id", region.get);

router.get("/joueurs/editeur", player.getEditor);
router.post("/joueurs/editeur/global", player.postEditor);
router.post("/joueurs/editeur/rejoindre", player.joinNation);
router.get("/joueurs/:id", player.get);

router.get("/nations/editeur", nation.getEditor);
router.post("/nations/editeur/global", nation.postEditor);
router.post("/nations/editeur/rm_citizen", nation.postExpell);
router.post("/nations/editeur/add_citizen", nation.postCitizen);
router.post("/nations/editeur/add_region", nation.addRegion);
router.post("/nations/editeur/rm_region", nation.delRegion);
router.post("/nations/editeur/dispatch", nation.dispatchReput);
router.get("/nations/:id", nation.get);

module.exports = router;
