// routes/history.js
const express = require("express");
const router = express.Router();
const { getHistory } = require("../controllers/historyController");
const authMiddleware = require("../middleware/authMiddleware"); // assuming JWT auth

router.get("/", authMiddleware, getHistory);

module.exports = router;
