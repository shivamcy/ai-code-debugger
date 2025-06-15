const axios = require("axios");
const History = require("../models/History");

// POST /api/debug
exports.debugCode = async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required." });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "system",
            content: "You are an expert programmer that helps debug code."
          },
          {
            role: "user",
            content: `Debug this ${language} code and repond in plain texxt , no headingss , no underlines etc:\n\n${code}\n\nDo not use bold headings.`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://ai-code-debugger-amber.vercel.app", 
          "X-Title": "AI Code Debugger"
        }
      }
    );

    const reply = response?.data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      console.warn("AI reply was undefined or empty");
      return res.status(500).json({ error: "AI failed to generate a response." });
    }

    // Save history
    try {
      await History.create({
        user: req.user._id,
        language,
        code,
        response: reply
        
      });
    } catch (historyErr) {
      console.error("Error saving history:", historyErr.message);
    }

    res.json({ result: reply });
  } catch (err) {
    console.error("Debug Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to debug code" });
  }
};

// GET /api/history
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const history = await History.find({ user: userId }).sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    console.error("Fetch History Error:", err.message);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

// DELETE /api/history
exports.clearHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    await History.deleteMany({ user: userId });

    res.json({ message: "History cleared successfully" });
  } catch (err) {
    console.error("Clear History Error:", err.message);
    res.status(500).json({ error: "Failed to clear history" });
  }
};
