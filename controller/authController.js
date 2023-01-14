const asyncErrorWrapper = require("express-async-handler");

const User = require("../models/user");
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers");
const { validateUserInput } = require("../helpers/input/inputHelpers");
const { comparePassword } = require("../helpers/input/inputHelpers");

const postRegister = async (req, res, next) => {
    try {
        const { name, password, email } = req.body;
        console.log(req.body);

        const user = await User.create({
            name,
            email,
            password,
        });

        sendJwtToClient(user, res);

        const token = user.generateJwtFromUser();
        console.log(token);

        res.redirect("/");
    } catch (error) {
        if (error.code === 11000) {
            res.render("register", {
                mailError: "This email address is already in use.",
            });
        } else {
            return next(error);
        }
    }
};

const getRegister = async (req, res, next) => {
    res.render("register");
};

const login = asyncErrorWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(req.body);

    if (!validateUserInput(email, password)) {
        return next(new CustomError("Please check your inputs", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    console.log(user);

    //check mail
    if (!user) {
        res.render("login", {
            mailError: "Please check your e-mail address.",
        });
    }

    //check password
    if (!comparePassword(password, user.password)) {
        res.render("login", {
            passwordError: "Please check your password.",
        });
    }

    sendJwtToClient(user, res);

    res.status(200).json({
        success: true,
    });
});

const renderLoginPage = async (req, res, next) => {
    res.render("login");
};

const logout = asyncErrorWrapper(async (req, res, next) => {
    return res.status(200).clearCookie("access_token").redirect("/");
});

module.exports = {
    postRegister,
    getRegister,
    login,
    renderLoginPage,
    logout,
};
