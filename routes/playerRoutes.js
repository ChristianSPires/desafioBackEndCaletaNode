// routes/playerRoutes.js
const express = require("express");
const bodyParser = require("body-parser");
const playerController = require("../controllers/playerController");

const router = express.Router();
router.use(bodyParser.json());

router.get("/balance/:playerId", playerController.getBalance);
router.post("/bet", playerController.placeBet);
router.post("/win", playerController.win);
router.post("/rollback", playerController.rollback);

module.exports = router;
