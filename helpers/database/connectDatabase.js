const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose.set("strictQuery", true);
    mongoose
        .connect(process.env.MONGO_URL)
        .then(() => {
            console.log("Mongodb connection successful");
        })
        .catch((err) => {
            console.error(err);
        });
};

module.exports = connectDatabase;
