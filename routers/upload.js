const router = require('express').Router();

const multer = require('multer');
const upload = multer({
  storage: multer.diskStorage({}),
});
const verifyFile = require('../middlewares/verifyFile');

const Auth = require('../middlewares/auth');

router.post('/image/avatar/', Auth, upload.single('avatar'), verifyFile, require('../controllers/upload/upload'));

router.post('/audio/ticking/', Auth, upload.single('ticking-audio'), verifyFile, require('../controllers/upload/upload'));
router.post('/audio/alarm/', Auth, upload.single('alarm-audio'), verifyFile, require('../controllers/upload/upload'));
router.post('/audio/click/', Auth, upload.single('click-audio'), verifyFile, require('../controllers/upload/upload'));

module.exports = router;
