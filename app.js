const bodyParser = require("body-parser");

const express = require("express");

const userRouter = require("./Routes/userRoutes");
const statusRouter = require("./Routes/statusRoutes");
const messageRouter = require("./Routes/messageRoutes");

app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use("/Status-Reaction/Users", userRouter);
app.use("/Status-Reaction/Status", statusRouter);
app.use("/Status-Reaction/Messages", messageRouter);

module.exports = app;
