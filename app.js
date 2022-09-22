const bodyParser = require("body-parser");

const express = require("express");

const userRouter = require("./Routes/userRoutes");
const statusRouter = require("./Routes/statusRoutes");

app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use("/Reaction/Users", userRouter);
app.use("/Reaction/Status", statusRouter);

module.exports = app;
