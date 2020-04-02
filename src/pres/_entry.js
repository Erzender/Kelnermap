const express = require("express");
const router = express.Router();

const edifice = require("./edifice");
const region = require("./region");
const player = require("./player");

router.get("/", function(req, res) {
  res.send("ta race");
});

router.get("/edifices", edifice.getAll);
router.get("/edifices/editeur", edifice.getEditor);
router.post("/edifices/editeur", edifice.postEditor);
router.get("/edifices/:id", edifice.get);

router.get("/regions", region.getAll);
router.get("/regions/:id", region.get);

router.get("/joueurs/:id", player.get);

module.exports = router;
