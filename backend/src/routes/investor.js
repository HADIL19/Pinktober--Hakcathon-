// backend/src/routes/investor.js - VERSION AMÉLIORÉE
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/profile', async (req, res) => {
  try {
    const userEmail = "marie.dubois@email.com";
    
    const investments = await prisma.investment.findMany({
      where: { contactEmail: userEmail },
      include: {
        project: {
          include: {
            owner: { select: { name: true, company: true } },
            progress: true,
            financials: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Statistiques avancées
    const totalProjects = investments.length;
    const totalAmount = investments.reduce((sum, inv) => sum + inv.amount, 0);
    
    const activeInvestments = investments.filter(inv => inv.status === 'APPROVED');
    const completedInvestments = investments.filter(inv => inv.status === 'COMPLETED');
    const pendingInvestments = investments.filter(inv => inv.status === 'PENDING');

    // Calcul du retour moyen basé sur la progression des projets
    let totalROI = 0;
    let projectsWithROI = 0;

    activeInvestments.forEach(inv => {
      if (inv.project.progress) {
        // Estimation du ROI basée sur la progression
        const progress = inv.project.progress.overall || 0;
        const estimatedROI = (progress / 100) * 25; // Jusqu'à 25% de ROI
        totalROI += estimatedROI;
        projectsWithROI++;
      }
    });

    const averageReturn = projectsWithROI > 0 ? 
      `+${Math.round(totalROI / projectsWithROI)}%` : "N/A";

    // Taux de succès basé sur le statut des projets
    const successfulProjects = completedInvestments.length + 
      activeInvestments.filter(inv => 
        inv.project.progress && inv.project.progress.overall > 70
      ).length;

    const successRate = totalProjects > 0 ? 
      Math.round((successfulProjects / totalProjects) * 100) + "%" : "0%";

    // Domaines d'investissement préférés (basés sur les projets investis)
    const domainCount = {};
    investments.forEach(inv => {
      const domain = inv.project.domain;
      if (domain) {
        domainCount[domain] = (domainCount[domain] || 0) + 1;
      }
    });

    const topDomains = Object.entries(domainCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([domain]) => domain);

    const profileData = {
      name: "Marie Dubois",
      email: userEmail,
      phone: "+33 6 12 34 56 78",
      location: "Paris, France",
      joinDate: "Janvier 2023",
      bio: "Investisseuse passionnée par l'innovation médicale et les technologies de santé. Je cherche à soutenir des projets prometteurs dans la lutte contre le cancer.",
      investmentFocus: topDomains.length > 0 ? topDomains : ["Immunothérapie", "IA Médicale", "Diagnostic Précoce"],
      riskTolerance: "Modéré",
      investmentRange: "50K€ - 200K€ par projet",
      investmentHorizon: "3-5 ans",
      portfolioHealth: calculatePortfolioHealth(investments)
    };

    res.json({
      success: true,
      data: {
        profile: profileData,
        investments: investments.map(inv => ({
          id: inv.id,
          projectName: inv.project.title,
          amount: inv.amount,
          date: inv.createdAt,
          status: inv.status,
          domain: inv.project.domain,
          progress: inv.project.progress?.overall || 0
        })),
        stats: {
          totalProjects,
          totalAmount,
          averageReturn,
          successRate,
          activeInvestments: activeInvestments.length,
          completedInvestments: completedInvestments.length,
          pendingInvestments: pendingInvestments.length
        }
      }
    });
    
  } catch (error) {
    console.error('Erreur récupération profil investisseur:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

function calculatePortfolioHealth(investments) {
  const activeProjects = investments.filter(inv => inv.status === 'APPROVED');
  if (activeProjects.length === 0) return "Excellent";

  const averageProgress = activeProjects.reduce((sum, inv) => 
    sum + (inv.project.progress?.overall || 0), 0) / activeProjects.length;

  if (averageProgress >= 80) return "Excellent";
  if (averageProgress >= 60) return "Bon";
  if (averageProgress >= 40) return "Modéré";
  return "À surveiller";
}

export default router;