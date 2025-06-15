const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    response: { type: String, required: true }, // ✅ This MUST be present
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", historySchema);