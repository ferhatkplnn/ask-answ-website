const multer = require("multer");
const path = require("path");
const CustomError = require("../errors/customErrorHandler");

const storage = multer.diskStorage({
    destination: function (req, file, callBack) {
        const rootDir = path.dirname(require.main.filename); // finding main directory
        callBack(null, path.join(rootDir, "/public/uploads")); // target directory
    },
    filename: function (req, file, callBack) {
        // File - Mimetype - image / png
        const extencion = file.mimetype.split("/")[1]; // get extension
        req.savedProfileImage = "image_" + req.user.id + "." + extencion;
        callBack(null, req.savedProfileImage);
    },
});

const fileFilter = (req, file, callBack) => {
    let allowedMineTypes = [
        "image/jpg",
        "image/gif",
        "image/jpeg",
        "image/png",
    ];

    if (!allowedMineTypes.includes(file.mimetype)) {
        return callBack(
            new CustomError("Please provide a valid image file", 400),
            false
        );
    }
    return callBack(null, true);
};

const profileImageUpload = multer({ storage, fileFilter });

module.exports = profileImageUpload;
