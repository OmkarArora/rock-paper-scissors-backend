const mongoose = require("mongoose");
const URI = process.env.RPS_DB_URI;

const initDBConnection = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlparser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connection successful");
  } catch (error) {
    console.log("Error connecting to DB\nLogs - ");
    console.error(error);
  }
};

module.exports = { initDBConnection };
