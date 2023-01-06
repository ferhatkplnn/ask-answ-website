const router = require("express").Router();

router.get("/", (req, res, next) => {
    res.send("Questions home page");
});

module.exports = router;
