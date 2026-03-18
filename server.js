require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

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
  console.log(`${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
  next();
});

/* =========================
   BASIC ROUTES
========================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: `${process.env.APP_NAME} is running 🚀`,
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    ok: true,
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   TASK ROUTES
========================= */

// GET all tasks
app.get("/tasks", (req, res) => {
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

// GET one task by id
app.get("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);

  if (Number.isNaN(taskId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid task id",
    });
  }

  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

// POST create task
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
    message: "Task created successfully",
    data: newTask,
  });
});

// PUT update task
app.put("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);

  if (Number.isNaN(taskId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid task id",
    });
  }

  const task = tasks.find((item) => item.id === taskId);

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
        message: "Title must be a non-empty string",
      });
    }
    task.title = title.trim();
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Completed must be a boolean",
      });
    }
    task.completed = completed;
  }

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
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

  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    data: deletedTask,
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
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});