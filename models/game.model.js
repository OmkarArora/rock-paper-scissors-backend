const mongoose = require("mongoose");
require("mongoose-type-url");

const GameSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("Game", GameSchema);
module.exports = { Game };
