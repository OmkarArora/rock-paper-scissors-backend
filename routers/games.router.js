const express = require("express");
const router = express.Router();
const { User } = require("../models/user.model");
const { Game } = require("../models/game.model");
const { authVerify } = require("../middleware/authVerify");

router.use(authVerify);

router.route("/create").get(async (req, res) => {
  try {
    let user = req.user;
    user = await User.findById(user.userId);
    let game = { user: user._id };
    let NewGame = new Game(game);
    return res.json({ success: true, game: NewGame });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to create game",
      errorMessage: error.message,
    });
  }
});

module.exports = router;
