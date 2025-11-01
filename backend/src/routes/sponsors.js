import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// --- GET all sponsors ---
router.get('/', async (req, res) => {
  try {
    const sponsors = await prisma.sponsor.findMany({
      include: { sponsorships: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: sponsors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// --- GET sponsor by ID ---
router.get('/:id', async (req, res) => {
  try {
    const sponsor = await prisma.sponsor.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { sponsorships: true }
    });
    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor introuvable' });
    res.json({ success: true, data: sponsor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// --- GET all sponsored items ---
router.get('/items/all', async (req, res) => {
  try {
    const items = await prisma.sponsorship.findMany({
      include: { sponsor: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// --- POST new sponsorship request ---
router.post('/request', async (req, res) => {
  try {
    const data = req.body;
    const newRequest = await prisma.sponsorshipRequest.create({
      data: {
        companyName: data.companyName,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || null,
        message: data.message,
        requestedType: data.requestedType || null,
        requestedAmount: data.requestedAmount ? parseFloat(data.requestedAmount) : null,
        categories: data.categories || [],
      }
    });
    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    console.error('Erreur création demande sponsor:', error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
});

// --- GET stats overview ---
router.get('/stats/overview', async (req, res) => {
  try {
    const totalSponsors = await prisma.sponsor.count();
    const totalItems = await prisma.sponsorship.count();
    const totalFundingResult = await prisma.sponsor.aggregate({
      _sum: { totalAmount: true }
    });

    res.json({
      success: true,
      data: {
        totalSponsors,
        totalItems,
        totalFunding: totalFundingResult._sum.totalAmount || 0
      }
    });
  } catch (error) {
    console.error('Erreur stats:', error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
});

export default router;
