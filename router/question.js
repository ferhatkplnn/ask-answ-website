const router = require("express").Router();
const { getAllQuestions } = require("../controller/questionController");

router.get("/", getAllQuestions);

module.exports = router;
