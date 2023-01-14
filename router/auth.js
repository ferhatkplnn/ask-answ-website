const router = require("express").Router();

const {
    postRegister,
    getRegister,
    login,
    renderLoginPage,
    logout,
} = require("../controller/authController");

router.post("/register", postRegister);
router.get("/register", getRegister);
router.post("/login", login);
router.get("/login", renderLoginPage);
router.get("/logout", logout);

module.exports = router;
