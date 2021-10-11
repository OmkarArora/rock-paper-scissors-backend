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
      user: { type: Number, default: 0 },
      cpu: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("Game", GameSchema);
module.exports = { Game };
