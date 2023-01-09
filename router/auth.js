const router = require("express").Router();

const { postRegister, getRegister } = require("../controller/authController");

router.post("/register", postRegister);
router.get("/register", getRegister);

module.exports = router;
