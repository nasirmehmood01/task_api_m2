require("dotenv").config();

const env = {
  PORT: process.env.PORT || 3000,
  APP_NAME: process.env.APP_NAME || "Task API",
  NODE_ENV: process.env.NODE_ENV || "development",
  ENV_USER: process.env.ENV_USER || "Unknown",
};

module.exports = env;