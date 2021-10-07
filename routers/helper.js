const { User } = require("../models/user.model");
const getPopulatedUserFromId = async (userId, res) => {
  try {
    const user = await User.findById(userId).populate("games");
    user.__v = undefined;
    user.password = undefined;
    return user;
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while retreiving user",
      errorMessage: error.message,
    });
  }
};

const getPopulatedUserFromUsername = async (username, res) => {
  try {
    const user = await User.findOne({ username }).populate("games");
    user.__v = undefined;
    user.password = undefined;
    return user;
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while retreiving user",
      errorMessage: error.message,
    });
  }
};

module.exports = { getPopulatedUserFromId, getPopulatedUserFromUsername };
