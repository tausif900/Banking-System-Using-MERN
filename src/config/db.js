const mongoose = require("mongoose");

const connectToDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connection to the DB established");
    })
    .catch((error) => {
      console.log("Not Connected to DB");
      process.exit(1);
    });
};

module.exports = connectToDB;
