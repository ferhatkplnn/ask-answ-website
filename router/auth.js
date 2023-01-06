const router = require("express").Router();

const { register } = require("../controller/authController");

router.post("/register", register);

module.exports = router;
