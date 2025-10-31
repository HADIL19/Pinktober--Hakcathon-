const express = require('express');
const { getAllProjects, getProjectById } = require('../controllers/projectController');

const router = express.Router();

// Route pour la marketplace - GET /api/projects
router.get('/', getAllProjects);

// Route pour un projet spécifique - GET /api/projects/:id
router.get('/:id', getProjectById);

module.exports = router;