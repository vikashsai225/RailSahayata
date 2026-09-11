const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const dataPath = path.join(__dirname, "../data/priorityTasks.json");
const enginePath = path.join(__dirname, "../ai_engine.py");

const runHybridEngine = () => new Promise((resolve, reject) => {
  const defaultPython = process.platform === "win32" ? "c:/python314/python.exe" : "python3";
  const python = spawn(process.env.PYTHON || defaultPython, [enginePath]);
  let output = "";
  let error = "";

  python.stdout.on("data", (chunk) => { output += chunk.toString(); });
  python.stderr.on("data", (chunk) => { error += chunk.toString(); });
  python.on("error", reject);
  python.on("close", (code) => {
    if (code !== 0) return reject(new Error(error || `AI engine exited with code ${code}`));
    try {
      return resolve(JSON.parse(output));
    } catch (parseError) {
      return reject(parseError);
    }
  });

  const tasks = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  python.stdin.end(JSON.stringify(tasks));
});

module.exports = { runHybridEngine };
