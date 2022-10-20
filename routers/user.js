const router = require("express").Router();
const UserController = require("../controllers/user");
const Auth = require("./../middlewares/auth");

router.post("/signin", UserController.signIn);

router.post("/signup", UserController.signUp);

router.get("/user_info", Auth, UserController.getUser);

router.post("/forgot_password", UserController.forgotPassword);

router.post("/reset_password", Auth, UserController.resetPassword);

router.patch("/update_user", Auth, UserController.updateUser);

router.delete("/delete_user", Auth, UserController.deleteAccount);

module.exports = router;