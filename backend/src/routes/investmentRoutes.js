// backend/src/routes/investmentRoutes.js
import express from 'express';
import {
  getMyInvestments,
  createInvestment,
  getInvestmentById,
  updateInvestmentStatus,
  submitInvestment,
  getProjectDashboard
} from '../controllers/investmentController.js';

const router = express.Router();

// Routes des investissements
router.get('/my-investments', getMyInvestments);
router.post('/', createInvestment);
router.post('/submit', submitInvestment);
router.get('/:id', getInvestmentById);
router.put('/:id/status', updateInvestmentStatus);
router.get('/:id/dashboard', getProjectDashboard); 


export default router;