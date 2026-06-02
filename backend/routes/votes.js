const express = require("express");
const votesController = require("../controllers/votesController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/:id/vote", auth, votesController.voteForCar);
router.get("/:id/votes", votesController.getVotesByCar);

module.exports = router;
