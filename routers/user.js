const router = require("express").Router();
const UserController = require("../controllers/user");
const Auth = require("./../middlewares/auth");
const VerifyResetToken = require('../middlewares/VerifyResetToken');

router.post("/signin", UserController.signIn);

router.post("/signup", UserController.signUp);

router.post('/google_login', UserController.googleLogin);

router.get("/user_info", Auth, UserController.getUser);

router.post("/forgot_password", UserController.forgotPassword);

router.post('/verify_reset_id', VerifyResetToken, UserController.verifyResetToken);

router.post("/reset_password", VerifyResetToken, UserController.resetPassword);

router.get("/refresh_token", Auth, UserController.getRefreshToken);

router.patch("/update_user", Auth, UserController.updateUser);

router.delete("/delete_user", Auth, UserController.deleteAccount);

module.exports = router;
