const CustomError = require("../../helpers/error/CustomError");
const jwt = require("jsonwebtoken");
const {
    isTokenIncluded,
    getAcessTokenFromCookie,
} = require("../../helpers/authorization/tokenHelpers");
const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/user");

const getAccessToRoute = (req, res, next) => {
    if (!isTokenIncluded(req)) {
        return next(
            new CustomError("You are not authorized to access this router", 401)
        );
    }

    const { JWT_SECRET_KEY } = process.env;
    const accessToken = getAcessTokenFromCookie(req);

    jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return next(new CustomError("You are not authorization.", 401));
        }

        req.user = {
            id: decoded.id,
            name: decoded.name,
        };

        console.log(decoded);
        next();
    });
};

const getUserSessionInfo = (req, res, next) => {
    if (!isTokenIncluded) {
        return next();
    }

    const { JWT_SECRET_KEY } = process.env;
    const accessToken = getAcessTokenFromCookie(req);

    jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return next();
        }

        res.locals.userSession = {
            id: decoded.id,
            name: decoded.name,
        };

        console.log(decoded);
        next();
    });
};

const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.user;

    const user = await User.findById(id);

    if (user.role !== "admin") {
        return next(new CustomError("Only admins can access this route", 403));
    }
    next();
});

module.exports = { getAccessToRoute, getUserSessionInfo, getAdminAccess };
