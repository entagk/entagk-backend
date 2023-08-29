const router = require("express").Router();

const getLeaderboard = require("../controllers/leaderboard/getLeaderboard");

router.get('/', getLeaderboard);

module.exports = router;
