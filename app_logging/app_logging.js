const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const env = require("./config/env");
const logger = require("./config/logger");

const app = express();

/* =========================
   ENSURE LOGS FOLDER EXISTS
========================= */
const logsDir = path.join(__dirname, "logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

/* =========================
   ENV CONFIG
========================= */
const { PORT, APP_NAME, NODE_ENV, ENV_USER } = env;

/* =========================
   STARTUP LOGS
========================= */
logger.info("Starting server...");
logger.info(`PORT: ${PORT}`);
logger.info(`Environment: ${NODE_ENV}`);
logger.info(`Task API: ${APP_NAME}`);
logger.info(`USER: ${ENV_USER}`);

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());

const accessLogStream = fs.createWriteStream(
  path.join(logsDir, "access.log"),
  { flags: "a" }
);

// Save request logs to file
app.use(morgan("combined", { stream: accessLogStream }));

// Show request logs in terminal
app.use(morgan("dev"));

/* =========================
   IN-MEMORY DATA
========================= */
let tasks = [
  {
    id: 1,
    title: "Launch EC2 instance",
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Configure Nginx reverse proxy",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

/* =========================
   BASIC ROUTES
========================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: `${APP_NAME} is running 🚀`,
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    ok: true,
    environment: NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   TASK ROUTES
========================= */

// GET all tasks
app.get("/tasks", (req, res) => {
  res.json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

// GET one task
app.get("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);

  if (Number.isNaN(taskId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid task id",
    });
  }

  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.json({
    success: true,
    data: task,
  });
});

// CREATE task
app.post("/tasks", (req, res) => {
  const { title, completed } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }

  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    title: title.trim(),
    completed: typeof completed === "boolean" ? completed : false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);

  logger.info(`Task created: id=${newTask.id}, title="${newTask.title}"`);

  res.status(201).json({
    success: true,
    message: "Task created",
    data: newTask,
  });
});

// UPDATE task
app.put("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);

  if (Number.isNaN(taskId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid task id",
    });
  }

  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  const { title, completed } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid title",
      });
    }
    task.title = title.trim();
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Completed must be boolean",
      });
    }
    task.completed = completed;
  }

  logger.info(`Task updated: id=${task.id}`);

  res.json({
    success: true,
    message: "Task updated",
    data: task,
  });
});

// DELETE task
app.delete("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);

  if (Number.isNaN(taskId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid task id",
    });
  }

  const index = tasks.findIndex((t) => t.id === taskId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  const deleted = tasks.splice(index, 1)[0];

  logger.info(`Task deleted: id=${deleted.id}`);

  res.json({
    success: true,
    message: "Task deleted",
    data: deleted,
  });
});

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);

  res.status(err.statusCode || 500).json({
    success: false,
    message:
      NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Internal server error",
  });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server running on port ${PORT}`);
});