// controllers/historyController.js
const History = require("../models/History");

exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id; // assuming auth middleware adds req.user
    const history = await History.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Server error" });
  }
};
