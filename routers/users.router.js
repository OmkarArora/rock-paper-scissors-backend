const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const {
  getPopulatedUserFromId,
  getPopulatedUserFromUsername,
} = require("./helper");

router.route("/signup").post(async (req, res) => {
  try {
    let user = req.body;
    if (!(user.email && user.password && user.name)) {
      return res
        .status(400)
        .json({ success: false, message: "Data not formatted properly" });
    }

    const userInDB = await User.findOne({ email: user.email });
    if (userInDB) {
      return res.status(403).json({
        success: false,
        message: "Email already registered",
        errorMessage: "Email already registered",
      });
    }

    let username = user.username;
    let name = user.name;
    if (!username) {
      username =
        name.split(" ").join("") + crypto.randomBytes(3).toString("hex");
      user.username = username;
    }
    const NewUser = new User(user);

    const salt = await bcrypt.genSalt(10);

    NewUser.password = await bcrypt.hash(NewUser.password, salt);

    const savedUser = await NewUser.save();

    const token = jwt.sign(
      { userId: savedUser._id, email: savedUser.email },
      process.env.JWT_SECRET
    );

    user = savedUser;
    user.password = undefined;
    user.__v = undefined;

    res.json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to register user",
      errorMessage: error.message,
    });
  }
});

router.route("/login").post(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email not found",
        errorMessage: "Email not found",
      });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
        },
        process.env.JWT_SECRET
      );
      const populatedUser = await getPopulatedUserFromId(user._id, res);
      return res.json({ success: true, user: populatedUser, token });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid password",
        errorMessage: "Invalid password",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "User not found",
      errorMessage: error.message,
    });
  }
});

router.route("/username").post(async (req, res) => {
  try {
    const { username } = req.body;
    const user = await getPopulatedUserFromUsername(username, res);
    return res.json({ success: true, user });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      errorMessage: error.message,
    });
  }
});

module.exports = router;
