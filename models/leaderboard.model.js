const mongoose = require("mongoose");
require("mongoose-type-url");

const LeaderboardSchema = new mongoose.Schema(
  {
    games: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);
module.exports = { Leaderboard };
