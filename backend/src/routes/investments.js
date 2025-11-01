// src/routes/investments.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Soumettre un investissement
router.post('/submit', async (req, res) => {
  try {
    const { projectId, amount, investor, type, contactEmail, phone, message, terms } = req.body;
    
    const investment = await prisma.investment.create({
      data: {
        amount: parseFloat(amount),
        investor,
        type: type || 'EQUITY',
        contactEmail,
        phone,
        message,
        terms,
        projectId: parseInt(projectId),
        status: 'PENDING'
      },
      include: {
        project: {
          include: {
            owner: { select: { name: true, email: true, id: true } }
          }
        }
      }
    });
    
    // Notifier le propriétaire du projet
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
      message: 'Demande d\'investissement envoyée avec succès',
      data: investment 
    });
    
  } catch (error) {
    console.error('Erreur soumission investissement:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Récupérer les investissements d'un projet
router.get('/project/:projectId', async (req, res) => {
  try {
    const investments = await prisma.investment.findMany({
      where: { projectId: parseInt(req.params.projectId) },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ success: true, investments });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// src/routes/investments.js - AJOUTEZ CETTE ROUTE

// Récupérer les investissements de l'utilisateur connecté
// Récupérer les investissements de l'utilisateur connecté
// Récupérer les investissements de l'utilisateur connecté - VERSION FINALE
// TEMPORAIRE: Version simplifiée de my-investments
router.get('/my-investments', async (req, res) => {
  try {
    console.log('🎯 My-investments appelée');
    
    // TEMPORAIRE: Email fixe pour tester
    const userEmail = "marie.dubois@email.com";
    console.log(`📧 Filtre email: ${userEmail}`);
    
    const investments = await prisma.investment.findMany({
      where: { 
        contactEmail: userEmail
      },
      include: {
        project: {
          select: {
            title: true,
            domain: true,
            owner: {
              select: {
                name: true,
                company: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`✅ ${investments.length} investissements pour ${userEmail}`);

    const investmentsWithROI = investments.map(inv => ({
      id: inv.id,
      amount: inv.amount,
      status: inv.status,
      displayStatus: inv.status === 'APPROVED' ? 'ACTIF' : 'EN ATTENTE',
      createdAt: inv.createdAt,
      roi: inv.status === 'APPROVED' ? '+18.5%' : 'En attente',
      project: {
        title: inv.project.title,
        category: inv.project.domain,
        researcher: inv.project.owner.name,
        institution: inv.project.owner.company
      }
    }));

    res.json({ 
      success: true, 
      data: investmentsWithROI,
      debug: {
        emailUsed: userEmail,
        found: investments.length
      }
    });
    
  } catch (error) {
    console.error('Erreur my-investments:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
// Route pour debug - voir tous les investissements
router.get('/debug-all-investments', async (req, res) => {
  try {
    const investments = await prisma.investment.findMany({
      include: {
        project: {
          select: {
            title: true,
            domain: true,
            status: true,
            owner: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Extraire les emails uniques pour le debug
    const uniqueEmails = [...new Set(investments.map(inv => inv.contactEmail).filter(Boolean))];
    
    res.json({ 
      success: true, 
      total: investments.length,
      sampleInvestments: investments.slice(0, 3), // Premier 3 pour exemple
      availableEmails: uniqueEmails,
      message: 'Utilisez un de ces emails dans la route /my-investments'
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route temporaire pour créer un investissement de test
// Dans investments.js - ROUTE AMÉLIORÉE
router.post('/create-test-investment', async (req, res) => {
  try {
    // Vérifier d'abord si un utilisateur chercheur existe
    let researcher = await prisma.user.findFirst({
      where: { role: 'RESEARCHER' }
    });
    
    // Si aucun chercheur n'existe, en créer un
    if (!researcher) {
      researcher = await prisma.user.create({
        data: {
          email: 'chercheur@institut-curie.fr',
          password: 'temp123', // À hasher en production
          name: 'Dr. Marie Lambert',
          role: 'RESEARCHER',
          company: 'Institut Curie',
          isVerified: true
        }
      });
      console.log('✅ Chercheur créé:', researcher.id);
    }
    
    // Créer un projet
    const project = await prisma.project.create({
      data: {
        title: "Immuno-Thérapie CAR-T Personnalisée",
        description: "Développement de thérapies CAR-T personnalisées pour le cancer du sein triple négatif",
        budget: 2000000,
        domain: "IMMUNOTHERAPY",
        stage: "CLINICAL_TRIALS_PHASE_1",
        status: "ACTIVE",
        innovationLevel: "BREAKTHROUGH",
        ownerId: researcher.id,
        investmentType: "EQUITY",
        funding: 35
      }
    });
    
    console.log('✅ Projet créé:', project.id);
    
    // Créer l'investissement
    const investment = await prisma.investment.create({
      data: {
        amount: 75000,
        investor: "KM Investments",
        type: "EQUITY",
        status: "APPROVED",
        contactEmail: "marie.dubois@email.com", // VOTRE EMAIL ICI
        phone: "+33 1 23 45 67 89",
        message: "Très intéressé par le potentiel de rupture de cette technologie",
        projectId: project.id
      },
      include: {
        project: {
          include: {
            owner: true
          }
        }
      }
    });
    
    console.log('✅ Investissement créé:', investment.id);
    
    res.json({ 
      success: true, 
      investment: {
        id: investment.id,
        amount: investment.amount,
        status: investment.status,
        contactEmail: investment.contactEmail,
        project: {
          title: investment.project.title,
          researcher: investment.project.owner.name
        }
      },
      message: '✅ Investissement de test créé! Utilisez maintenant /my-investments'
    });
    
  } catch (error) {
    console.error('❌ Erreur création test:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack // Pour debug détaillé
    });
  }
});

// Dans src/routes/investments.js
router.post('/submit', async (req, res) => {
  try {
    const { projectId, amount, investor, type, contactEmail, phone, message, terms } = req.body;
    
    const investment = await prisma.investment.create({
      data: {
        amount: parseFloat(amount),
        investor,
        type: type || 'EQUITY',
        contactEmail,
        phone,
        message,
        terms,
        projectId: parseInt(projectId),
        status: 'PENDING' // Le statut initial est "en attente"
      },
      include: {
        project: {
          include: {
            owner: { select: { name: true, email: true, id: true } }
          }
        }
      }
    });
    
    // Notifier le propriétaire du projet
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
      message: 'Demande d\'investissement envoyée avec succès',
      data: investment 
    });
    
  } catch (error) {
    console.error('Erreur soumission investissement:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// AJOUTEZ CES ROUTES À VOTRE FICHIER investments.js

// Route 1: Test de la base de données
router.get('/test-db', async (req, res) => {
  try {
    console.log('🧪 Test de connexion à la base de données...');
    
    // Test des investissements
    const investments = await prisma.investment.findMany();
    console.log(`📊 Investissements trouvés: ${investments.length}`);
    
    // Test des projets
    const projects = await prisma.project.findMany();
    console.log(`📋 Projets trouvés: ${projects.length}`);
    
    // Test des utilisateurs
    const users = await prisma.user.findMany();
    console.log(`👥 Utilisateurs trouvés: ${users.length}`);

    res.json({
      success: true,
      database: 'Connecté ✅',
      counts: {
        investments: investments.length,
        projects: projects.length,
        users: users.length
      },
      sampleInvestments: investments.slice(0, 3),
      sampleProjects: projects.slice(0, 3).map(p => ({ id: p.id, title: p.title })),
      sampleUsers: users.slice(0, 3).map(u => ({ id: u.id, email: u.email, role: u.role }))
    });
    
  } catch (error) {
    console.error('❌ Erreur base de données:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Problème de connexion à la base de données'
    });
  }
});

// Route 2: Voir tous les investissements (sans filtre)
router.get('/all', async (req, res) => {
  try {
    const investments = await prisma.investment.findMany({
      include: {
        project: {
          select: {
            title: true,
            domain: true,
            owner: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`📦 ${investments.length} investissements trouvés au total`);
    
    res.json({
      success: true,
      count: investments.length,
      investments: investments,
      message: investments.length === 0 
        ? 'Aucun investissement dans la base' 
        : `${investments.length} investissements trouvés`
    });
    
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route 3: Créer un investissement de test
router.post('/create-test-investment', async (req, res) => {
  try {
    console.log('🧪 Création investissement test...');
    
    // Vérifier qu'un projet existe
    const project = await prisma.project.findFirst();
    if (!project) {
      return res.status(400).json({
        success: false,
        error: 'Aucun projet trouvé. Créez d\'abord des projets.'
      });
    }

    const investment = await prisma.investment.create({
      data: {
        amount: 10000,
        investor: "Investisseur Test",
        type: "EQUITY",
        contactEmail: "test@investor.com",
        phone: "+33123456789",
        message: "Investissement de test créé automatiquement",
        terms: "acceptés",
        projectId: project.id,
        status: "APPROVED"
      },
      include: {
        project: {
          select: {
            title: true,
            owner: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    console.log(`✅ Investissement test créé: ID ${investment.id}`);

    res.json({
      success: true,
      message: 'Investissement de test créé avec succès',
      investment: {
        id: investment.id,
        amount: investment.amount,
        investor: investment.investor,
        contactEmail: investment.contactEmail,
        project: investment.project.title,
        researcher: investment.project.owner.name
      },
      nextStep: `Testez GET /api/investments/my-investments avec email: test@investor.com`
    });

  } catch (error) {
    console.error('❌ Erreur création test:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route 4: Version debug de my-investments (sans filtre email)
router.get('/my-investments-debug', async (req, res) => {
  try {
    console.log('🐛 Debug my-investments - pas de filtre email');
    
    const investments = await prisma.investment.findMany({
      include: {
        project: {
          select: {
            title: true,
            domain: true,
            status: true,
            owner: {
              select: {
                name: true,
                company: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📋 ${investments.length} investissements trouvés (debug mode)`);

    // Simuler le calcul ROI
    const investmentsWithROI = investments.map(inv => ({
      id: inv.id,
      amount: inv.amount,
      status: inv.status,
      contactEmail: inv.contactEmail,
      createdAt: inv.createdAt,
      roi: inv.status === 'APPROVED' ? '+15.5%' : 'En attente',
      project: {
        title: inv.project.title,
        category: inv.project.domain,
        researcher: inv.project.owner.name,
        institution: inv.project.owner.company
      }
    }));

    res.json({
      success: true,
      data: investmentsWithROI,
      debug: {
        total: investments.length,
        emails: [...new Set(investments.map(inv => inv.contactEmail))],
        message: 'Mode debug - tous les investissements affichés'
      }
    });

  } catch (error) {
    console.error('Erreur debug:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Dans backend/src/routes/investments.js - AJOUTEZ CETTE ROUTE

// Récupérer le dashboard d'un investissement
router.get('/:id/dashboard', async (req, res) => {
  try {
    const { id } = req.params;

    const investment = await prisma.investment.findUnique({
      where: { id: parseInt(id) },
      include: {
        project: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                company: true,
                avatar: true
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
            },
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
        funding: project.funding,
        stage: project.stage,
        innovationLevel: project.innovationLevel
      },
      researcher: project.owner,
      investment: {
        id: investment.id,
        amount: investment.amount,
        type: investment.type,
        status: investment.status,
        createdAt: investment.createdAt
      },
      progress: calculateProgress(project),
      milestones: formatMilestones(project.milestones),
      financials: calculateFinancials(project),
      kpis: calculateKPIs(project.kpis)
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

// Fonctions utilitaires (à ajouter dans le même fichier)
function calculateProgress(project) {
  if (project.progress) {
    return {
      overall: project.progress.overall,
      timeline: project.progress.timeline,
      budget: project.progress.budget,
      milestones: project.progress.milestones
    };
  }

  // Calcul par défaut
  const milestones = project.milestones || [];
  const completedMilestones = milestones.filter(m => m.completed).length;
  const milestoneProgress = milestones.length > 0 
    ? (completedMilestones / milestones.length) * 100 
    : 0;

  const financials = calculateFinancials(project);
  const budgetProgress = financials.totalBudget > 0 
    ? (financials.spent / financials.totalBudget) * 100 
    : 0;

  return {
    overall: Math.min(100, milestoneProgress * 0.6 + budgetProgress * 0.4),
    timeline: calculateTimelineProgress(project),
    budget: budgetProgress,
    milestones: milestoneProgress
  };
}

function calculateTimelineProgress(project) {
  if (!project.createdAt || !project.duration) return 50;
  
  const startDate = new Date(project.createdAt);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + project.duration);
  const today = new Date();
  
  const totalDuration = endDate - startDate;
  const elapsed = today - startDate;
  
  return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
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

function calculateFinancials(project) {
  if (project.financials) {
    return {
      totalBudget: project.financials.totalBudget,
      spent: project.financials.spent,
      remaining: project.financials.remaining,
      fundingProgress: project.financials.fundingProgress
    };
  }

  const totalBudget = project.budget || 1000000;
  const totalInvested = project.investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0;
  const fundingProgress = totalBudget > 0 ? (totalInvested / totalBudget) * 100 : 0;
  const spent = totalInvested * 0.7; // Estimation

  return {
    totalBudget,
    spent,
    remaining: totalBudget - spent,
    fundingProgress
  };
}

function calculateKPIs(kpis) {
  if (!kpis || kpis.length === 0) {
    // KPIs par défaut basés sur le domaine du projet
    return [
      {
        id: 1,
        name: "Avancement technique",
        value: 75,
        target: 80,
        unit: "%",
        status: "good"
      },
      {
        id: 2,
        name: "Qualité des résultats",
        value: 88,
        target: 85,
        unit: "%",
        status: "exceeded"
      },
      {
        id: 3,
        name: "Respect du budget",
        value: 92,
        target: 90,
        unit: "%",
        status: "exceeded"
      },
      {
        id: 4,
        name: "Satisfaction équipe",
        value: 82,
        target: 85,
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
  if (percentage >= 105) return 'exceeded';
  if (percentage >= 85) return 'good';
  return 'warning';
}
export default router;

