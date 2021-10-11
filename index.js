require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { initDBConnection } = require("./db/db.connect");

const app = express();
app.use(bodyParser.json());
app.use(cors());

initDBConnection();

const usersRouter = require("./routers/user.router");
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Connected to Rock-Paper-Scissors server");
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log("Server started on port: ", PORT);
});
