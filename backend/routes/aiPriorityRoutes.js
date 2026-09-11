const express = require("express");
const { runHybridEngine } = require("../services/hybridAiService");

const router = express.Router();

router.get("/ai-priority", async (req, res) => {
  try {
    const result = await runHybridEngine();
    res.json({
      success: true,
      data: result.tasks,
      schedule: result.schedule,
      model: result.model,
      optimizer: result.optimizer,
    });
  } catch (err) {
    console.error("AI priority route error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load priority tasks",
    });
  }
});

module.exports = router;