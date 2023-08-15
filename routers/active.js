const router = require("express").Router();
const Auth = require("../middlewares/auth.js");
const ActiveController = require('../controllers/activeDay');

router.post('/', Auth, ActiveController.addActive);

router.post('/:day', Auth, ActiveController.getDay);

module.exports = router;

