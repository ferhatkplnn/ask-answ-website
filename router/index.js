const router = require("express").Router();
const auth = require("./auth");
const questions = require("./question");

router.use("/questions", questions);
router.use("/auth", auth);

module.exports = router;
