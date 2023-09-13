const router = require("express").Router();
const AuthWS = require("../middlewares/authWS.js");
// const Auth = require("../middlewares/auth.js");
const noteController = require('../controllers/stickyNotes');

// get single note
// router.get('/:id', Auth, );

// get opened notes

// get notes

// create note or update note
router.ws('/:id', AuthWS, noteController.modifyNote)

module.exports = router;
