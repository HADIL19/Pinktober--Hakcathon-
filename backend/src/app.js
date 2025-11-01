import express from "express";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // ✅ Add this line
import investmentRoutes from './routes/investmentRoutes.js';
import messages from './routes/messages.js'
import dashboardRoutes from './routes/dashboard.js';
import investorRoutes from './routes/investor.js';
import projectPrismaRoutes from './routes/projects-prisma.js';
import initDbRoutes from './routes/init-db.js';

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
app.use('/api/investments', investmentRoutes);
app.use('/api/messages', messages);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/investor', investorRoutes);
app.use("/api/projects-prisma", projectPrismaRoutes);
app.use("/api/init", initDbRoutes);

export default app;
