// backend/src/routes/dashboard.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Récupérer les données du dashboard pour un projet
router.get('/project/:investmentId', async (req, res) => {
  try {
    const { investmentId } = req.params;

    // Récupérer l'investissement avec le projet associé
    const investment = await prisma.investment.findUnique({
      where: { id: parseInt(investmentId) },
      include: {
        project: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                company: true
              }
            },
            milestones: {
              orderBy: { dueDate: 'asc' }
            },
            kpis: true,
            progress: true,
            financials: true,
            investments: {
              where: { status: 'APPROVED' }
            }
          }
        }
      }
    });

    if (!investment) {
      return res.status(404).json({ 
        success: false, 
        error: 'Investissement non trouvé' 
      });
    }

    const { project } = investment;

    // Calculer les données du dashboard
    const dashboardData = {
      project: {
        id: project.id,
        title: project.title,
        domain: project.domain,
        status: project.status,
        description: project.description,
        budget: project.budget,
        duration: project.duration,
        funding: project.funding
      },
      researcher: project.owner,
      investment: {
        amount: investment.amount,
        type: investment.type,
        status: investment.status,
        createdAt: investment.createdAt
      },
      progress: await calculateProgress(project),
      milestones: await formatMilestones(project.milestones),
      financials: await calculateFinancials(project),
      kpis: await calculateKPIs(project.kpis)
    };

    res.json({ 
      success: true, 
      data: dashboardData 
    });

  } catch (error) {
    console.error('Erreur chargement dashboard:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Fonctions utilitaires
async function calculateProgress(project) {
  if (project.progress) {
    return {
      overall: project.progress.overall,
      timeline: project.progress.timeline,
      budget: project.progress.budget,
      milestones: project.progress.milestones
    };
  }

  // Calcul par défaut si pas de données spécifiques
  const milestones = project.milestones || [];
  const completedMilestones = milestones.filter(m => m.completed).length;
  const milestoneProgress = milestones.length > 0 
    ? (completedMilestones / milestones.length) * 100 
    : 0;

  return {
    overall: Math.min(100, milestoneProgress * 0.7 + (project.funding || 0) * 0.3),
    timeline: 45, // Valeur par défaut
    budget: project.financials ? 
      (project.financials.spent / project.financials.totalBudget) * 100 : 
      (project.funding || 0),
    milestones: milestoneProgress
  };
}

function formatMilestones(milestones) {
  return milestones.map(milestone => ({
    id: milestone.id,
    name: milestone.name,
    description: milestone.description,
    date: milestone.dueDate,
    completed: milestone.completed,
    completedAt: milestone.completedAt
  }));
}

async function calculateFinancials(project) {
  if (project.financials) {
    return {
      totalBudget: project.financials.totalBudget,
      spent: project.financials.spent,
      remaining: project.financials.remaining,
      fundingProgress: project.financials.fundingProgress
    };
  }

  // Calcul par défaut
  const totalBudget = project.budget || 0;
  const totalInvested = project.investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0;
  const fundingProgress = totalBudget > 0 ? (totalInvested / totalBudget) * 100 : 0;

  return {
    totalBudget,
    spent: totalInvested * 0.6, // Estimation
    remaining: totalBudget - (totalInvested * 0.6),
    fundingProgress
  };
}

function calculateKPIs(kpis) {
  if (!kpis || kpis.length === 0) {
    // KPIs par défaut
    return [
      {
        id: 1,
        name: "Taux de réussite expérimentale",
        value: 85,
        target: 80,
        unit: "%",
        status: "exceeded"
      },
      {
        id: 2,
        name: "Délai de développement",
        value: 12,
        target: 18,
        unit: "mois",
        status: "exceeded"
      },
      {
        id: 3,
        name: "Coût par patient",
        value: 45000,
        target: 50000,
        unit: "€",
        status: "good"
      },
      {
        id: 4,
        name: "Taux de rétention équipe",
        value: 92,
        target: 95,
        unit: "%",
        status: "warning"
      }
    ];
  }

  return kpis.map(kpi => ({
    id: kpi.id,
    name: kpi.name,
    value: kpi.value,
    target: kpi.target,
    unit: kpi.unit,
    status: calculateKPIStatus(kpi.value, kpi.target)
  }));
}

function calculateKPIStatus(value, target) {
  const percentage = (value / target) * 100;
  if (percentage >= 110) return 'exceeded';
  if (percentage >= 90) return 'good';
  return 'warning';
}

export default router;