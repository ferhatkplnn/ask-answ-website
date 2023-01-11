const path = require("path");
const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const routers = require("./router/index");
const connectDatabase = require("./helpers/database/connectDatabase");
const customErrorHandller = require("./middlewares/errors/customErrorHandler");

const PORT = 4000 || process.env.PORT;

connectDatabase();
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", routers);

app.use(express.static(path.join(__dirname, "public")));

app.use(customErrorHandller);

app.listen(PORT, () => {
    console.log(`App started on http://localhost:${PORT}`);
});
