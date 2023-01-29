const asyncErrorWrapper = require("express-async-handler");

const User = require("../models/user");
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers");
const { validateUserInput } = require("../helpers/input/inputHelpers");
const { comparePassword } = require("../helpers/input/inputHelpers");
const CustomError = require("../helpers/error/CustomError");
const sendEmail = require("../helpers/libraries/sendEmail");

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

const getRegister = asyncErrorWrapper(async (req, res, next) => {
    res.render("register");
});

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
        return next();
    }

    //check password
    if (!comparePassword(password, user.password)) {
        res.render("login", {
            passwordError: "Please check your password.",
        });
        return next();
    }

    sendJwtToClient(user, res);

    res.status(200).json({
        success: true,
    });
});

const renderLoginPage = asyncErrorWrapper(async (req, res, next) => {
    res.render("login");
});

const logout = asyncErrorWrapper(async (req, res, next) => {
    return res.status(200).clearCookie("access_token").redirect("/");
});

const imageUpload = asyncErrorWrapper(async (req, res, next) => {
    console.log(req.user.id);
    const user = await User.findByIdAndUpdate(
        req.user.id,
        {
            profile_image: req.savedProfileImage,
        },
        {
            new: true,
            runValidators: true,
        }
    );
    res.status(200).json({
        success: true,
        message: "Image Upload Successfull",
    });
});

const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
    const resetEmail = req.body.email;

    const user = await User.findOne({ email: resetEmail }).select("+password");

    if (!user) {
        res.status(400).render("forgotPassword", {
            mailError: "There is no use with that e-mail.",
        });
        return next();
    }

    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    await user.save();

    const resetPasswordUrl =
        process.env.NODE_ENV === "development"
            ? `http://localhost:${process.env.PORT}/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`
            : `http://${req.hostname}/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

    console.log(resetPasswordUrl);
    const emailTemplate = `
    <h3>Reset Your Password</h3>
    <p> This <a href = '${resetPasswordUrl}' target='_blank'>link</a> will expire in 1 hour</p>
    `;

    try {
        await sendEmail({
            from: process.env.SMTP_USER,
            to: resetEmail,
            subject: "Reset Your Password",
            html: emailTemplate,
        });

        return res.status(200).json({
            success: true,
            message: "Token Sent To Your Email",
        });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return next(new CustomError("Email Could Not Be Sent", 500));
    }
});

const renderForgotPasswordPage = asyncErrorWrapper(async (req, res, next) => {
    res.render("forgotPassword");
});

const resetPassword = asyncErrorWrapper(async (req, res, next) => {
    const { resetPasswordToken } = req.query;
    const { password } = req.body;
    console.log("hello");

    if (!resetPasswordToken) {
        return next(new CustomError("Please provide a valid token", 400));
    }

    let user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new CustomError("Invalid Token or Session Expired", 400));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Reset password Process Successful",
    });
});

const renderResetPasswordPage = asyncErrorWrapper(async (req, res, next) => {
    console.log(req.query.resetPasswordToken);
    res.render("resetPassword", {
        resetPasswordToken: req.query.resetPasswordToken,
    });
});

const editDetails = asyncErrorWrapper(async (req, res, next) => {
    const editInformation = req.body;

    const user = await User.findByIdAndUpdate(req.user.id, editInformation, {
        new: true,
        runValidators: true,
    });

    return res.status(200).json({
        success: true,
        data: user,
    });
});

module.exports = {
    postRegister,
    getRegister,
    login,
    renderLoginPage,
    logout,
    imageUpload,
    forgotPassword,
    renderForgotPasswordPage,
    resetPassword,
    renderResetPasswordPage,
    editDetails,
};
