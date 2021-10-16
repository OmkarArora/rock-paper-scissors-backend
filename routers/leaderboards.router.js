const express = require("express");
const router = express.Router();
const { Leaderboard } = require("../models/leaderboard.model");

router.route("/").get(async (req, res) => {
  try {
    let leaderboard = await Leaderboard.find().populate({
      path: "games",
      populate: {
        path: "user",
        select: {
          name: 1,
          username: 1,
          profileImage: 1,
        },
      },
    });
    leaderboard = leaderboard[0];
    return res.json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to get leaderboard",
      errorMessage: error.message,
    });
  }
});

module.exports = router;
