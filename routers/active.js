const router = require("express").Router();
const Auth = require("../middlewares/auth.js");
const ActiveController = require('../controllers/activeDay');

router.post('/', Auth, ActiveController.addActive);

router.get('/year', Auth, ActiveController.getYears);

router.get('/:day', Auth, ActiveController.getDay);

router.get('/', Auth, ActiveController.getDays);

module.exports = router;

