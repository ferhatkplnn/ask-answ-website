const path = require("path");
const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");

const routers = require("./router/index");
const connectDatabase = require("./helpers/database/connectDatabase");

const PORT = 4000 || process.env.PORT;

connectDatabase();
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", routers);

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
    console.log(`App started on http://localhost:${PORT}`);
});
