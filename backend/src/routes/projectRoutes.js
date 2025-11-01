import express from "express";
import { getAllProjects, getProjectById } from "../controllers/projectController.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);

export default router;
