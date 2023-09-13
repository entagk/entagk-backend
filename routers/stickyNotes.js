const router = require("express").Router();
const AuthWS = require("../middlewares/authWS.js");
const Auth = require("../middlewares/auth.js");
const noteController = require('../controllers/stickyNotes');


// get notes
router.get('/', Auth, noteController.getNotes);
// get opened notes
router.get('/open/', Auth, noteController.getOpenedNotes);

// create note or update note
router.ws('/:id', AuthWS, noteController.modifyNote);

// get single note
router.get('/:id', Auth, noteController.getSingleNote);

// delete note
router.delete('/:id', Auth, noteController.deleteNote);


module.exports = router;
