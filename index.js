const express = require("express");
require("dotenv").config();

const routers = require("./router/index");
app.use("/", routers);

const app = express();

const PORT = 4000 || process.env.PORT;

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, () => {
    console.log(`App started on http://localhost:${PORT}`);
});
