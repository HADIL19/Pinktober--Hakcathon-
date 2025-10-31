const express = require('express');
const cors = require('cors');

// Routes
const projectRoutes = require('./routes/projectRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/projects', projectRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'PinkHope Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur PinkHope Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      projects: '/api/projects'
    }
  });
});

// Gestion des routes non trouvées - CORRECTION ICI
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

module.exports = app;