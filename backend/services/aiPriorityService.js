const fs = require("fs");
const path = require("path");

const computePriorityScore = (task) => {
  const safety = Number(task.safetyRisk || 0);
  const delayImpact = Number(task.delayImpact || 0);
  const criticality = Number(task.assetCriticality || 0);
  const urgency = Number(task.maintenanceUrgency || 0);
  const resource = Number(task.resourceAvailability || 0);

  const score =
    (safety * 30 +
    delayImpact * 25 +
    criticality * 20 +
    urgency * 15 +
    resource * 10) / 100;

  return Math.min(100, Math.max(0, score));
};

const rankTasks = (tasks) => {
  return tasks
    .map((task) => {
      const aiPriorityScore = computePriorityScore(task);
      return {
        ...task,
        aiPriorityScore,
        aiPriorityLabel:
          aiPriorityScore >= 75
            ? "Critical"
            : aiPriorityScore >= 50
            ? "High"
            : aiPriorityScore >= 25
            ? "Medium"
            : "Low",
      };
    })
    .sort((a, b) => b.aiPriorityScore - a.aiPriorityScore);
};

const getPriorityTasks = () => {
  const filePath = path.join(__dirname, "../data/priorityTasks.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const tasks = JSON.parse(raw);
  return rankTasks(tasks);
};

module.exports = { computePriorityScore, rankTasks, getPriorityTasks };
