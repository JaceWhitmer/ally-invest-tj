require("dotenv").config();
const mongoose = require("mongoose");

const connectMongo = async () => {
  mongoose.connect(
    process.env.MONGODB_URI,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
    () => {
      console.log("Connected to MongoDB");
    },
    (e) => console.log(e)
  );
};

module.exports = connectMongo;
