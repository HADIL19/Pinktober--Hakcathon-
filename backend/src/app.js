import express from "express";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // ✅ Add this line

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // vite default
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes); // ✅ Add this line

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "PinkHope Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur PinkHope Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      users: "/api/users",
      projects: "/api/projects",
    },
  });
});

export default app;
