// Load dotenv only if available (safe for production)
try {
  require("dotenv").config();
} catch (e) {
  console.log("dotenv not loaded (running without .env)");
}

const express = require("express");
const app = express();

app.use(express.json());

/* =========================
   ENV CONFIG
========================= */
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || "Task API";
const NODE_ENV = process.env.NODE_ENV || "development";
const USER_ENV = process.env.ENV_USER || "Unknown";

console.log("Starting server...");
console.log("PORT:", PORT);
console.log("Environment:", NODE_ENV);
console.log("Task API:", APP_NAME);
console.log("USER:", USER_ENV);
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
   REQUEST LOGGER
========================= */
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} | ${req.method} ${req.originalUrl}`
  );
  next();
});

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
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
