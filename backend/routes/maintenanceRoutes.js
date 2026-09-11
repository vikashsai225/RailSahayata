const fs = require("fs");
const path = require("path");
const express = require("express");

const router = express.Router();
const filePath = path.join(__dirname, "../data/maintenanceTasks.json");

const readTasks = () => JSON.parse(fs.readFileSync(filePath, "utf-8"));
const writeTasks = (tasks) => fs.writeFileSync(filePath, `${JSON.stringify(tasks, null, 2)}\n`);

router.get("/tasks", (req, res) => {
  try {
    return res.json(readTasks());
  } catch (error) {
    console.error("Maintenance task read error:", error);
    return res.status(500).json({ message: "Unable to load maintenance tasks" });
  }
});

router.post("/tasks", (req, res) => {
  const { id, department, asset, location, defect, criticality, due = "", duration = "" } = req.body || {};
  if (!department || !asset || !location || !defect || !criticality) {
    return res.status(400).json({ message: "Department, asset, location, defect and criticality are required" });
  }

  try {
    const tasks = readTasks();
    const task = {
      id: id || `TASK-${Date.now()}`,
      department,
      asset,
      location,
      defect,
      criticality,
      score: null,
      due,
      duration,
      status: "Pending",
    };
    tasks.unshift(task);
    writeTasks(tasks);
    return res.status(201).json({ task });
  } catch (error) {
    console.error("Maintenance task write error:", error);
    return res.status(500).json({ message: "Unable to save maintenance task" });
  }
});

module.exports = router;
