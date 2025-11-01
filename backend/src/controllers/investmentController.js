// backend/src/controllers/investmentController.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// === FONCTIONS HELPER - DOIVENT ÊTRE DÉFINIES AVANT LEUR UTILISATION ===

// Helper pour mapper les statuts
const mapInvestmentStatus = (status) => {
  const statusMap = {
    'PENDING': 'EN ATTENTE',
    'UNDER_REVIEW': 'EN ATTENTE', 
    'APPROVED': 'ACTIF',
    'COMPLETED': 'TERMINÉ',
    'REJECTED': 'ANNULÉ'
  };
  return statusMap[status] || 'EN ATTENTE';
};

// Helper pour calculer le ROI
const calculateROI = (investmentAmount, projectBudget) => {
  if (!projectBudget || projectBudget === 0) return 'N/A';
  
  // Calcul fictif pour la démo
  const baseROI = (investmentAmount / projectBudget) * 100;
  const performance = (baseROI * 0.3) + (Math.random() * 10);
  
  return `+${performance.toFixed(1)}%`;
};

// === CONTROLLERS ===

export const getMyInvestments = async (req, res) => {
  console.log('📥 Requête reçue pour /api/investments/my-investments');
  
  try {
    // Pour le moment, on récupère tous les investissements
    const investments = await prisma.investment.findMany({
      include: {
        project: {
          select: {
            id: true,
            title: true,
            domain: true,
            stage: true,
            status: true,
            budget: true,
            funding: true,
            description: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 ${investments.length} investissements trouvés`);

    // Formater les données pour le frontend
    const formattedInvestments = investments.map(inv => ({
      id: inv.id,
      amount: inv.amount,
      createdAt: inv.createdAt,
      displayStatus: mapInvestmentStatus(inv.status), // Fonction maintenant définie
      roi: calculateROI(inv.amount, inv.project?.budget), // Fonction maintenant définie
      project: {
        id: inv.project?.id,
        title: inv.project?.title || 'Projet inconnu',
        category: inv.project?.domain || 'Non catégorisé',
        description: inv.project?.description,
        stage: inv.project?.stage,
        status: inv.project?.status
      }
    }));

    res.json({
      success: true,
      data: formattedInvestments
    });

  } catch (error) {
    console.error('❌ Erreur détaillée getMyInvestments:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des investissements',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const createInvestment = async (req, res) => {
  try {
    const { projectId, amount, investor, contactEmail, phone, message, terms } = req.body;

    const investment = await prisma.investment.create({
      data: {
        amount: parseFloat(amount),
        investor: investor || 'Investisseur Anonyme',
        contactEmail,
        phone,
        message,
        terms,
        projectId: parseInt(projectId),
        status: 'PENDING',
        type: 'EQUITY'
      },
      include: {
        project: {
          select: {
            title: true,
            domain: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: investment,
      message: 'Investissement créé avec succès'
    });
  } catch (error) {
    console.error('Erreur createInvestment:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de l\'investissement',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getInvestmentById = async (req, res) => {
  try {
    const { id } = req.params; // Récupérer l'ID depuis les paramètres d'URL

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID manquant dans la requête'
      });
    }

    const investment = await prisma.investment.findUnique({
      where: { 
        id: parseInt(id) // Convertir en nombre
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            description: true,
            domain: true,
            stage: true,
            budget: true,
            funding: true,
            owner: {
              select: {
                name: true,
                email: true,
                company: true
              }
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

    res.json({
      success: true,
      data: investment
    });
  } catch (error) {
    console.error('Erreur getInvestmentById:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

export const updateInvestmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes, reviewedBy } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID manquant'
      });
    }

    const investment = await prisma.investment.update({
      where: { 
        id: parseInt(id) 
      },
      data: {
        status,
        reviewNotes,
        reviewedBy: reviewedBy ? parseInt(reviewedBy) : null,
        reviewedAt: status !== 'PENDING' ? new Date() : null
      }
    });

    res.json({
      success: true,
      data: investment,
      message: 'Statut de l\'investissement mis à jour'
    });
  } catch (error) {
    console.error('Erreur updateInvestmentStatus:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du statut'
    });
  }

  
};
export const submitInvestment = async (req, res) => {
  try {
    const { projectId, amount, investor, contactEmail, phone, message, terms } = req.body;

    console.log('📥 Données reçues pour soumission:', {
      projectId,
      amount,
      investor,
      contactEmail,
      phone,
      message
    });

    // Vérifier que le projet existe
    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Projet non trouvé'
      });
    }

    const investment = await prisma.investment.create({
      data: {
        amount: parseFloat(amount),
        investor: investor || 'Investisseur Anonyme',
        contactEmail,
        phone,
        message,
        terms: terms || 'acceptés',
        projectId: parseInt(projectId),
        status: 'PENDING',
        type: 'EQUITY'
      },
      include: {
        project: {
          select: {
            title: true,
            domain: true,
            owner: {
              select: {
                name: true,
                email: true,
                id: true
              }
            }
          }
        }
      }
    });

    console.log('✅ Investissement soumis avec ID:', investment.id);

    // Créer une notification pour le propriétaire du projet
    await prisma.notification.create({
      data: {
        type: 'INVESTMENT',
        title: 'Nouvelle demande d\'investissement',
        message: `Nouvelle demande d'investissement de ${amount}€ pour votre projet "${investment.project.title}"`,
        userId: investment.project.owner.id,
        entityType: 'investment',
        entityId: investment.id
      }
    });

    res.json({
      success: true,
      data: investment,
      message: 'Demande d\'investissement soumise avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur submitInvestment:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la soumission de l\'investissement',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
export const getProjectDashboard = async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer l'investissement avec les détails du projet
    const investment = await prisma.investment.findUnique({
      where: { id: parseInt(id) },
      include: {
        project: {
          include: {
            owner: {
              select: {
                name: true,
                email: true
              }
            },
            documents: true,
            tags: true
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

    // Calculer les métriques dynamiques
    const project = investment.project;
    
    // Métriques de progression (basées sur la durée et le budget)
    const startDate = new Date(project.createdAt);
    const now = new Date();
    const totalDuration = project.duration || 24; // mois
    const elapsedMonths = (now - startDate) / (30 * 24 * 60 * 60 * 1000);
    
    const timelineProgress = Math.min(100, (elapsedMonths / totalDuration) * 100);
    const budgetProgress = project.budget ? (project.funding || 0) : 0;
    
    // Calculer l'avancement global (moyenne pondérée)
    const overallProgress = Math.round((timelineProgress + budgetProgress) / 2);

    // Générer les jalons dynamiquement basés sur la durée du projet
    const milestones = generateDynamicMilestones(project, startDate, totalDuration);

    // KPIs basés sur le type de projet et l'avancement
    const kpis = generateDynamicKPIs(project, overallProgress);

    // Données financières réelles
    const financials = {
      totalBudget: project.budget || 0,
      spent: project.budget ? (project.budget * (project.funding || 0) / 100) : 0,
      remaining: project.budget ? (project.budget * (100 - (project.funding || 0)) / 100) : 0,
      fundingProgress: project.funding || 0
    };

    const dashboardData = {
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        domain: project.domain,
        stage: project.stage,
        status: project.status,
        createdAt: project.createdAt
      },
      investment: {
        amount: investment.amount,
        status: investment.status,
        createdAt: investment.createdAt
      },
      progress: {
        overall: overallProgress,
        timeline: Math.round(timelineProgress),
        budget: Math.round(budgetProgress),
        milestones: calculateMilestoneProgress(milestones)
      },
      milestones,
      financials,
      kpis,
      researcher: project.owner,
      documents: project.documents,
      tags: project.tags
    };

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('❌ Erreur getProjectDashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du dashboard',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fonctions helper pour générer des données dynamiques
const generateDynamicMilestones = (project, startDate, totalDuration) => {
  const milestones = [];
  const stages = [
    { name: "Recherche fondamentale", weight: 0.2 },
    { name: "Développement prototype", weight: 0.3 },
    { name: "Tests pré-cliniques", weight: 0.2 },
    { name: "Essais cliniques Phase I", weight: 0.15 },
    { name: "Essais cliniques Phase II", weight: 0.1 },
    { name: "Approval réglementaire", weight: 0.05 }
  ];

  let accumulatedTime = 0;
  
  stages.forEach((stage, index) => {
    const stageDuration = totalDuration * stage.weight;
    const milestoneDate = new Date(startDate);
    milestoneDate.setMonth(milestoneDate.getMonth() + accumulatedTime + stageDuration);
    
    // Déterminer si le jalon est complété basé sur la date actuelle
    const now = new Date();
    const isCompleted = now >= milestoneDate;
    
    milestones.push({
      name: stage.name,
      completed: isCompleted,
      date: milestoneDate.toISOString(),
      weight: stage.weight
    });
    
    accumulatedTime += stageDuration;
  });

  return milestones;
};

const calculateMilestoneProgress = (milestones) => {
  const completed = milestones.filter(m => m.completed).length;
  return Math.round((completed / milestones.length) * 100);
};

const generateDynamicKPIs = (project, overallProgress) => {
  const baseKPIs = [
    { name: "Avancement global", target: "100%" },
    { name: "Respect délais", target: "95%" },
    { name: "Utilisation budget", target: "90%" },
    { name: "Qualité recherche", target: "85%" }
  ];

  return baseKPIs.map(kpi => {
    let value, status;
    
    switch(kpi.name) {
      case "Avancement global":
        value = `${overallProgress}%`;
        status = overallProgress >= 80 ? "exceeded" : overallProgress >= 60 ? "good" : "warning";
        break;
      case "Respect délais":
        const timelineScore = Math.min(100, overallProgress + Math.random() * 20);
        value = `${Math.round(timelineScore)}%`;
        status = timelineScore >= 90 ? "exceeded" : timelineScore >= 70 ? "good" : "warning";
        break;
      case "Utilisation budget":
        const budgetScore = Math.min(100, overallProgress + Math.random() * 15);
        value = `${Math.round(budgetScore)}%`;
        status = budgetScore >= 85 ? "exceeded" : budgetScore >= 65 ? "good" : "warning";
        break;
      default:
        const qualityScore = Math.min(100, overallProgress + Math.random() * 25);
        value = `${Math.round(qualityScore)}%`;
        status = qualityScore >= 80 ? "exceeded" : qualityScore >= 60 ? "good" : "warning";
    }
    
    return { ...kpi, value, status };
  });
};
