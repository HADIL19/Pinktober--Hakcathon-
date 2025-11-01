// backend/src/routes/projects-prisma.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Route qui utilise UNIQUEMENT Prisma
router.get('/', async (req, res) => {
  try {
    console.log('🎯 Route /api/projects-prisma - FORCE Prisma uniquement');
    
    const projects = await prisma.project.findMany({
      include: {
        owner: {
          select: {
            name: true,
            company: true
          }
        },
        tags: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 ${projects.length} projets dans Prisma`);

    if (projects.length === 0) {
      return res.json({
        success: true,
        data: [],
        count: 0,
        message: "PRISMA: Base de données vide - aucun projet trouvé",
        source: "PRISMA_EMPTY"
      });
    }

    const transformedProjects = projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      budget: project.budget,
      duration: project.duration,
      domain: project.domain,
      stage: project.stage,
      funding: project.funding,
      tags: project.tags.map(tag => tag.tag),
      investmentType: project.investmentType,
      location: project.location,
      innovationLevel: project.innovationLevel,
      isFeatured: project.isFeatured,
      score: project.score,
      researcher: project.owner?.name || 'Chercheur inconnu',
      institution: project.owner?.company || 'Institution inconnue',
      createdAt: project.createdAt,
      source: "PRISMA_DATABASE"
    }));

    res.json({
      success: true,
      data: transformedProjects,
      count: transformedProjects.length,
      source: "PRISMA_DATABASE"
    });

  } catch (error) {
    console.error('❌ Erreur Prisma:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur base de données Prisma',
      source: "PRISMA_ERROR"
    });
  }
});

export default router;