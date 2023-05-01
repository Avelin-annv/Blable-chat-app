const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    const ctn = await mongoose.connect(process.env.MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `MONGO DB connection has been initialized at ${ctn.connection.host}`
    );
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};
module.exports = connectToDB;
