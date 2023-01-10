const User = require("../models/user");
const sendJwtToClient = require("../helpers/authorization/tokenHelpers");

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

        res.status(200).json({
            success: true,
        });
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

module.exports = {
    postRegister,
    getRegister,
};
