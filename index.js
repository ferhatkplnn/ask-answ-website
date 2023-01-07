const path = require("path");
const express = require("express");
require("dotenv").config();

const routers = require("./router/index");
const PORT = 4000 || process.env.PORT;

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use("/", routers);

app.listen(PORT, () => {
    console.log(`App started on http://localhost:${PORT}`);
});
