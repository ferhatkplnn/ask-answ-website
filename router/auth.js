const router = require("express").Router();

const {
    postRegister,
    getRegister,
    login,
    renderLoginPage,
    logout,
    imageUpload,
} = require("../controller/authController");
const profileImageUpload = require("../middlewares/libraries/profileImageUpload");
const { getAccessToRoute } = require("../middlewares/authorization/auth");

router.post("/register", postRegister);
router.get("/register", getRegister);
router.post("/login", login);
router.get("/login", renderLoginPage);
router.get("/logout", logout);

router.post(
    "/upload",
    [getAccessToRoute, profileImageUpload.single("profile_image")],
    imageUpload
);
router.get("/upload", (req, res, next) => {
    res.render("imageUpload");
});

module.exports = router;
