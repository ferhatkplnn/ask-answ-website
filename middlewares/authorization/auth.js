const CustomError = require("../../helpers/error/CustomError");
const jwt = require("jsonwebtoken");
const {
    isTokenIncluded,
    getAcessTokenFromCookie,
} = require("../../helpers/authorization/tokenHelpers");

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
            return next(
                new CustomError(
                    "You are not authorization to access this route.",
                    401
                )
            );
        }

        console.log(decoded);
        next();
    });
};

module.exports = { getAccessToRoute };
