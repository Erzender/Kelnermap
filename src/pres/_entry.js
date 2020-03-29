const express = require("express");
const router = express.Router();

const edifice = require("./edifice");
const region = require("./region");

router.get("/", function(req, res) {
  res.send("ta race");
});

router.get("/edifices", edifice.getAll);
router.get("/edifices/:id", edifice.get);

router.get("/regions", region.getAll);
router.get("/regions/:id", region.get);

module.exports = router;
