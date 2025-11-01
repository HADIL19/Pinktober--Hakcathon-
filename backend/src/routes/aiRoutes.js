import express from 'express';
import aiController from '../controllers/aiController.js';

const router = express.Router();

// Simplify medical text
router.post('/simplify', aiController.simplifyMedicalText);

// Get breast cancer information
router.post('/info', aiController.getBreastCancerInfo);

export default router;