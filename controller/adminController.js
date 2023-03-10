const User = require("../models/user");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

const blockUser = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);

    user.blocked = !user.blocked;

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Block - Unblock Successufull",
    });
});

const deleteUser = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const user = User.findById(id);

    await user.remove();

    res.status(200).json({
        success: true,
        message: "Delete Operation Succesfull",
    });
});

module.exports = {
    blockUser,
    deleteUser,
};
