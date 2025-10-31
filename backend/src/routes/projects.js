// backend/src/routes/projects.js
import express from 'express';
import { getProjects, getProjectById, getProjectsStats } from '../controllers/projectController.js';

const router = express.Router();

// Routes pour ProjectsMarketplace
router.get('/', getProjects);           // GET /api/projects
router.get('/stats', getProjectsStats); // GET /api/projects/stats
router.get('/:id', getProjectById);     // GET /api/projects/:id

export default router;