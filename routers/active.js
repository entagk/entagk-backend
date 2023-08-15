const router = require("express").Router();
const Auth = require("../middlewares/auth.js");
const ActiveController = require('../controllers/activeDay');

router.post('/', Auth, ActiveController.addActive);

module.exports = router;

