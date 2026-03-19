// Load dotenv only if available
try {
  require("dotenv").config();
} catch (e) {
  console.log("dotenv not loaded");
}

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

function renderHomePage() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Advance Eid Mubarak | Nasir Mehmood</title>
  <meta name="description" content="A beautiful Eid Mubarak page for family." />
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --bg-1: #081225;
      --bg-2: #0f172a;
      --bg-3: #111827;
      --card: rgba(255, 255, 255, 0.08);
      --card-border: rgba(255, 255, 255, 0.16);
      --text: #f8fafc;
      --muted: #cbd5e1;
      --accent: #fbbf24;
      --accent-2: #22c55e;
      --shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      min-height: 100vh;
      color: var(--text);
      background:
        radial-gradient(circle at top left, rgba(251, 191, 36, 0.15), transparent 28%),
        radial-gradient(circle at top right, rgba(34, 197, 94, 0.10), transparent 28%),
        radial-gradient(circle at bottom center, rgba(59, 130, 246, 0.12), transparent 30%),
        linear-gradient(135deg, var(--bg-1), var(--bg-2), var(--bg-3));
      overflow-x: hidden;
      position: relative;
    }

    .stars {
      position: fixed;
      inset: 0;
      pointer-events: none;
      opacity: 0.45;
      background-image:
        radial-gradient(2px 2px at 40px 60px, rgba(255,255,255,0.9), transparent),
        radial-gradient(1.5px 1.5px at 180px 100px, rgba(255,255,255,0.7), transparent),
        radial-gradient(2px 2px at 340px 180px, rgba(255,255,255,0.8), transparent),
        radial-gradient(1.5px 1.5px at 520px 70px, rgba(255,255,255,0.6), transparent),
        radial-gradient(2px 2px at 760px 130px, rgba(255,255,255,0.7), transparent),
        radial-gradient(1.5px 1.5px at 980px 90px, rgba(255,255,255,0.8), transparent),
        radial-gradient(2px 2px at 1200px 170px, rgba(255,255,255,0.6), transparent);
      background-repeat: repeat;
      background-size: 1300px 340px;
    }

    .container {
      width: min(1180px, 92%);
      margin: 0 auto;
      padding: 36px 0 50px;
      position: relative;
      z-index: 2;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 18px;
      margin-bottom: 28px;
      flex-wrap: wrap;
    }

    .brand {
      font-size: clamp(1.8rem, 4vw, 3.2rem);
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #ffffff;
      text-shadow: 0 0 18px rgba(255,255,255,0.08);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 18px;
      border-radius: 999px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.14);
      color: var(--muted);
      font-size: 0.95rem;
      backdrop-filter: blur(12px);
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
      border-radius: 28px;
      box-shadow: var(--shadow);
      backdrop-filter: blur(16px);
    }

    .message-card {
      padding: 36px;
    }

    .eyebrow {
      display: inline-block;
      margin-bottom: 14px;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--accent);
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    h1 {
      font-size: clamp(2rem, 4vw, 3.8rem);
      line-height: 1.1;
      margin-bottom: 18px;
      font-weight: 800;
    }

    .subtitle {
      color: var(--muted);
      font-size: 1.06rem;
      line-height: 1.8;
      margin-bottom: 24px;
      max-width: 720px;
    }

    .divider {
      height: 1px;
      background: linear-gradient(to right, rgba(255,255,255,0.24), rgba(255,255,255,0.05));
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
      right: 18px;
      top: 4px;
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
      gap: 22px;
    }

    .small-card {
      padding: 30px 24px;
      text-align: center;
      min-height: 260px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .small-card h3 {
      font-size: 1.1rem;
      margin-bottom: 12px;
      color: #fff;
    }

    .small-card p {
      color: var(--muted);
      line-height: 1.8;
      font-size: 1rem;
      max-width: 290px;
      margin: 0 auto;
    }

    .icon {
      font-size: 2rem;
      margin-bottom: 14px;
      display: block;
    }

    .footer {
      text-align: center;
      margin-top: 30px;
      color: var(--muted);
      font-size: 0.98rem;
    }

    @media (max-width: 920px) {
      .hero {
        grid-template-columns: 1fr;
      }

      .bottom-grid {
        grid-template-columns: 1fr;
      }

      .message-card,
      .urdu-card,
      .small-card {
        padding: 24px;
      }

      .poetry {
        font-size: 1.3rem;
        line-height: 2;
      }

      .small-card {
        min-height: auto;
      }
    }
  </style>
</head>
<body>
  <div class="stars"></div>

  <div class="container">
    <div class="topbar">
      <div class="brand">Nasir Mehmood</div>
      <div class="badge">🌙 Eid Special</div>
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
        <p>Allah kare is Eid te har ghar wich sukoon, rehmat te barkat hove.</p>
      </div>

      <div class="card small-card">
        <span class="icon">🏡</span>
        <h3>Family</h3>
        <p>Chahe fasla kinna vi hove, Eid di اصل khushi hamesha family naal hondi ae.</p>
      </div>

      <div class="card small-card">
        <span class="icon">✨</span>
        <h3>Togetherness</h3>
        <p>Pardes wich vi duawan te yaadan apneyan nu dil de qareeb rakhdiyaan ne.</p>
      </div>
    </section>

    <div class="footer">
      Eid Mubarak from Nasir Mehmood
    </div>
  </div>
</body>
</html>
  `;
}

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(renderHomePage());
});

app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>404</title>
      <style>
        body {
          margin: 0;
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #0f172a;
          color: white;
          font-family: Arial, Helvetica, sans-serif;
        }
        .box {
          text-align: center;
          padding: 30px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 20px;
          background: rgba(255,255,255,0.05);
        }
        a {
          color: #fbbf24;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="box">
        <h1>404</h1>
        <p>Page not found</p>
        <a href="/">Go back home</a>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
