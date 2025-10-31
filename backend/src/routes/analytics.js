// backend/src/routes/analytics.js
import express from 'express';
import { getPlatformStats } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/platform-stats', getPlatformStats);

export default router;