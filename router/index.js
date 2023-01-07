const router = require("express").Router();
const auth = require("./auth");
const questions = require("./question");

router.use("/questions", questions);
router.use("/auth", auth);
router.use("/", (req, res, next) => {
    res.render("index");
});

module.exports = router;
