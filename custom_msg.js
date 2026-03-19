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

console.log("Starting server...");
console.log("Environment:", NODE_ENV);

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
  console.log(`${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
  next();
});

/* =========================
   HTML PAGE
========================= */
function renderHomePage() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Advance Eid Mubarak | Nasir Developer</title>
  <meta
    name="description"
    content="A beautiful Eid Mubarak message for family with Punjabi poetry."
  />
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --bg-1: #0f172a;
      --bg-2: #111827;
      --card: rgba(255, 255, 255, 0.08);
      --card-border: rgba(255, 255, 255, 0.18);
      --text: #f8fafc;
      --muted: #cbd5e1;
      --accent: #f59e0b;
      --accent-2: #22c55e;
      --shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      min-height: 100vh;
      color: var(--text);
      background:
        radial-gradient(circle at top left, rgba(245, 158, 11, 0.18), transparent 30%),
        radial-gradient(circle at top right, rgba(34, 197, 94, 0.14), transparent 28%),
        linear-gradient(135deg, var(--bg-1), var(--bg-2));
      overflow-x: hidden;
    }

    .stars {
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.8), transparent),
        radial-gradient(2px 2px at 140px 80px, rgba(255,255,255,0.6), transparent),
        radial-gradient(1.5px 1.5px at 300px 160px, rgba(255,255,255,0.7), transparent),
        radial-gradient(2px 2px at 500px 50px, rgba(255,255,255,0.5), transparent),
        radial-gradient(1.5px 1.5px at 700px 120px, rgba(255,255,255,0.7), transparent),
        radial-gradient(2px 2px at 900px 60px, rgba(255,255,255,0.6), transparent),
        radial-gradient(1.5px 1.5px at 1100px 200px, rgba(255,255,255,0.65), transparent);
      background-repeat: repeat;
      background-size: 1200px 320px;
      opacity: 0.55;
    }

    .container {
      width: min(1100px, 92%);
      margin: 0 auto;
      padding: 32px 0 48px;
      position: relative;
      z-index: 1;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 28px;
      flex-wrap: wrap;
    }

    .brand {
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.4px;
      color: #fff;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 999px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      color: var(--muted);
      font-size: 0.92rem;
      backdrop-filter: blur(10px);
    }

    .hero {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 24px;
      align-items: stretch;
    }

    .card {
      background: var(--card);
      border: 1px solid var(--card-border);
      border-radius: 24px;
      box-shadow: var(--shadow);
      backdrop-filter: blur(16px);
    }

    .message-card {
      padding: 34px;
    }

    .eyebrow {
      display: inline-block;
      margin-bottom: 14px;
      font-size: 0.92rem;
      font-weight: 700;
      color: var(--accent);
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    h1 {
      font-size: clamp(2rem, 4vw, 3.6rem);
      line-height: 1.1;
      margin-bottom: 18px;
      font-weight: 800;
    }

    .subtitle {
      color: var(--muted);
      font-size: 1.05rem;
      line-height: 1.8;
      margin-bottom: 24px;
      max-width: 720px;
    }

    .divider {
      height: 1px;
      background: linear-gradient(to right, rgba(255,255,255,0.25), rgba(255,255,255,0.05));
      margin: 24px 0;
      border: none;
    }

    .english-message {
      font-size: 1.08rem;
      line-height: 1.95;
      color: #f8fafc;
    }

    .english-message p {
      margin-bottom: 12px;
    }

    .urdu-card {
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .urdu-card::before {
      content: "☪";
      position: absolute;
      right: 20px;
      top: 10px;
      font-size: 120px;
      opacity: 0.06;
      color: #fff;
    }

    .urdu-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--accent-2);
      margin-bottom: 16px;
      letter-spacing: 0.6px;
      text-transform: uppercase;
    }

    .poetry {
      direction: rtl;
      text-align: right;
      font-size: 1.55rem;
      line-height: 2.1;
      color: #ffffff;
      font-weight: 600;
    }

    .poetry p {
      margin-bottom: 10px;
    }

    .bottom-grid {
      margin-top: 24px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .small-card {
      padding: 22px;
      text-align: center;
    }

    .small-card h3 {
      font-size: 1.08rem;
      margin-bottom: 10px;
      color: #fff;
    }

    .small-card p {
      color: var(--muted);
      line-height: 1.7;
      font-size: 0.96rem;
    }

    .icon {
      font-size: 1.9rem;
      margin-bottom: 12px;
      display: block;
    }

    .footer {
      text-align: center;
      margin-top: 28px;
      color: var(--muted);
      font-size: 0.95rem;
    }

    .footer a {
      color: #fff;
      text-decoration: none;
      border-bottom: 1px dashed rgba(255,255,255,0.4);
    }

    @media (max-width: 900px) {
      .hero {
        grid-template-columns: 1fr;
      }

      .bottom-grid {
        grid-template-columns: 1fr;
      }

      .message-card,
      .urdu-card {
        padding: 24px;
      }

      .poetry {
        font-size: 1.3rem;
        line-height: 2;
      }
    }
  </style>
</head>
<body>
  <div class="stars"></div>

  <div class="container">
    <div class="topbar">
      <div class="brand">Nasir Developer</div>
      <div class="badge">🌙 Eid Special Page</div>
    </div>

    <section class="hero">
      <div class="card message-card">
        <div class="eyebrow">Eid Greetings</div>
        <h1>Advance Eid Mubarak to my lovely family! 🌙✨</h1>
        <p class="subtitle">
          A warm Eid wish filled with duas, love, togetherness, and the feeling of home even from far away.
        </p>

        <hr class="divider" />

        <div class="english-message">
          <p>May Allah fill our home with happiness, peace, and endless blessings 🤍</p>
          <p>May your Eid be full of love, laughter, and of course… lots of delicious food 😄🍽️</p>
        </div>
      </div>

      <div class="card urdu-card">
        <div class="urdu-title">Eid in Pardes</div>
        <div class="poetry">
          <p>پردیس دی عید وی عید تے ہوندی اے…</p>
          <p>پر اوہ گل نئیں جیہڑی اپنےآں دے نال ہوندی اے</p>
          <p>ہنسدے چہرے وی اداس لگدے نیں…</p>
          <p>جدوں گھر دی یاد دل وچ وسدی اے</p>
        </div>
      </div>
    </section>

    <section class="bottom-grid">
      <div class="card small-card">
        <span class="icon">🤲</span>
        <h3>Blessings</h3>
        <p>May this Eid bring peace, mercy, and barakah to every home and every heart.</p>
      </div>

      <div class="card small-card">
        <span class="icon">🏡</span>
        <h3>Family</h3>
        <p>No matter the distance, family remains the most beautiful part of every Eid.</p>
      </div>

      <div class="card small-card">
        <span class="icon">✨</span>
        <h3>Togetherness</h3>
        <p>Even in pardes, prayers and memories keep loved ones close to the soul.</p>
      </div>
    </section>

    <div class="footer">
      Made with care by <a href="https://nasirdeveloper.com">nasirdeveloper.com</a>
    </div>
  </div>
</body>
</html>
  `;
}

/* =========================
   BASIC ROUTES
========================= */

// Beautiful HTML homepage
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(renderHomePage());
});

// Keep a JSON status route too
app.get("/api", (req, res) => {
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