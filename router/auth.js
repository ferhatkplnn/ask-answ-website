const router = require("express").Router();

router.get("/", (req, res, next) => {
    res.send("Auth home page");
});

module.exports = router;
