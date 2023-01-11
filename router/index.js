const router = require("express").Router();
const auth = require("./auth");
const questions = require("./question");
const { getAccessToRoute } = require("../middlewares/authorization/auth");

router.use("/questions", questions);
router.use("/auth", auth);
router.get("/", getAccessToRoute, (req, res, next) => {
    console.log("Cookies:", "access_token" in req.cookies);
    res.render("index");
});

module.exports = router;
