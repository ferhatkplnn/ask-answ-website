const router = require("express").Router();
const auth = require("./auth");
const questions = require("./question");
const user = require("./user");

const { getUserSessionInfo } = require("../middlewares/authorization/auth");

router.use(getUserSessionInfo);
router.use("/questions", questions);
router.use("/auth", auth);
router.use("/users", user);

router.get("/", (req, res, next) => {
    res.render("index");
});

module.exports = router;
