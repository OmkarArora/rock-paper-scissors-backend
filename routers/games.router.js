const express = require("express");
const router = express.Router();
const { User } = require("../models/user.model");
const { Game } = require("../models/game.model");
const { Leaderboard } = require("../models/leaderboard.model");
const { authVerify } = require("../middleware/authVerify");

router.use(authVerify);

router.route("/create").get(async (req, res) => {
  try {
    let user = req.user;
    user = await User.findById(user.userId);
    let game = { user: user._id };
    let NewGame = new Game(game);
    NewGame = await NewGame.save();
    NewGame.__v = undefined;

    if (user.games && user.games.length > 0)
      user.games = [...user.games, NewGame._id];
    else user.games = [NewGame._id];
    await user.save();

    return res.json({ success: true, game: NewGame });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to create game",
      errorMessage: error.message,
    });
  }
});

router.route("/score").post(async (req, res) => {
  try {
    let game = req.body;
    let gameFromDB = await Game.findById(game._id);
    gameFromDB.score = game.score;
    await gameFromDB.save();
    gameFromDB.__v = undefined;

    (async function () {
      let leaderboard = await Leaderboard.find().populate("games")[0];

      if (!leaderboard.games || leaderboard.games.length === 0) {
        leaderboard.games = [gameFromDB];
      } else if (leaderboard.games.length < leaderboard.size) {
        leaderboard.games.push(gameFromDB);
        leaderboard.games.sort((a, b) => b.score.user - a.score.user);
      } else {
        if (
          gameFromDB.score.user >
          leaderboard.games[leaderboard.games.length - 1].score.user
        ) {
          leaderboard.games[leaderboard.games.length - 1] = gameFromDB;
          leaderboard.games.sort((a, b) => b.score.user - a.score.user);
        }
      }
      await leaderboard.save();
    });

    return res.json({ success: true, game: gameFromDB });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while saving score",
      errorMessage: error.message,
    });
  }
});

module.exports = router;
