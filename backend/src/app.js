import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


// Routes
import projectRoutes from './routes/projectRoutes.js';
import sponsorsRoutes from './routes/sponsors.js';
import userRoutes from './routes/userRoutes.js';
import testAI from "./routes/testAI.js";
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();
const app = express();

// --- Middlewares ---
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"], // autorise les deux frontends
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", testAI);

// --- Routes ---
app.use('/api/projects', projectRoutes);
app.use('/api/sponsors', sponsorsRoutes);
app.use('/api/users', userRoutes);

// --- Health check ---
app.use('/api/ai', aiRoutes);
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'PinkHope Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// --- Root route ---
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur PinkHope Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      projects: '/api/projects',
      sponsors: '/api/sponsors',
    },
  });
});
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
  });
});

export default app;
