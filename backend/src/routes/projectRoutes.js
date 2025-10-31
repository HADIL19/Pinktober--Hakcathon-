import express from "express";
import { getAllProjects, getProjectById } from "../controllers/projectController.js";

const router = express.Router();

// Route pour la marketplace - GET /api/projects
router.get("/", getAllProjects);

// Route pour un projet spécifique - GET /api/projects/:id
router.get("/:id", getProjectById);

export default router;
