const express = require("express");
const router = express.Router();
const { debugCode } = require("../controllers/debugController");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Import auth middleware

router.post("/debug", authMiddleware, debugCode);

module.exports = router;
