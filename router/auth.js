const router = require("express").Router();

const {
    postRegister,
    getRegister,
    login,
    renderLoginPage,
} = require("../controller/authController");

router.post("/register", postRegister);
router.post("/login", login);
router.get("/login", renderLoginPage);
router.get("/register", getRegister);

module.exports = router;
