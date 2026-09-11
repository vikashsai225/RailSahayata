const fs = require("fs");
const path = require("path");
const express = require("express");

const router = express.Router();
const filePath = path.join(__dirname, "../data/supportRequests.json");

router.post("/support-requests", (req, res) => {
  const { name, email, category, priority, subject, description } = req.body || {};
  if (!name || !email || !category || !priority || !subject || !description) {
    return res.status(400).json({ success: false, message: "All support request fields are required" });
  }

  try {
    const requests = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const request = {
      id: `RS-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      name, email, category, priority, subject, description,
      status: "Open",
      createdAt: new Date().toISOString(),
    };
    requests.push(request);
    fs.writeFileSync(filePath, `${JSON.stringify(requests, null, 2)}\n`);
    return res.status(201).json({ success: true, data: request });
  } catch (error) {
    console.error("Support request error:", error);
    return res.status(500).json({ success: false, message: "Unable to save support request" });
  }
});

module.exports = router;
