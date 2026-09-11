const express = require("express");
const cors = require("cors");
const path = require("path");
const aiPriorityRoutes = require("./routes/aiPriorityRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const supportRoutes = require("./routes/supportRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", aiPriorityRoutes);
app.use("/api", maintenanceRoutes);
app.use("/api", supportRoutes);

const frontendDist = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDist));

app.get(/.*/, (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }

  res.sendFile(path.join(frontendDist, "index.html"), (error) => {
    if (error) {
      next(error);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
