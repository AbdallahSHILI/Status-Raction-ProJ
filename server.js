const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/config.env" });
const app = require("./app");

//Connect to DB
const DB = process.env.DATABASE;
mongoose.connect(DB).then(() => {
  console.log("Db Connection successfully ! ");
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`server running on port ${port} ! `);
});
