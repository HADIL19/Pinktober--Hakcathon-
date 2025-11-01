// backend/src/scripts/createSampleDashboardData.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSampleDashboardData() {
  try {
    // Trouver un projet existant
    const project = await prisma.project.findFirst();
    
    if (!project) {
      console.log('Aucun projet trouvé, créez d\'abord des projets');
      return;
    }

    // Créer des milestones
    const milestones = await prisma.projectMilestone.createMany({
      data: [
        {
          projectId: project.id,
          name: "Étude préclinique terminée",
          description: "Validation des résultats en laboratoire",
          dueDate: new Date('2024-03-01'),
          completed: true,
          completedAt: new Date('2024-02-28')
        },
        {
          projectId: project.id,
          name: "Recrutement patients Phase 1",
          description: "Recrutement de 50 patients pour les essais cliniques",
          dueDate: new Date('2024-06-01'),
          completed: false
        },
        {
          projectId: project.id,
          name: "Analyse résultats intermédiaires",
          dueDate: new Date('2024-09-01'),
          completed: false
        },
        {
          projectId: project.id,
          name: "Soumission réglementaire",
          description: "Soumission auprès des autorités de santé",
          dueDate: new Date('2025-01-01'),
          completed: false
        }
      ]
    });

    // Créer des KPIs
    const kpis = await prisma.projectKPI.createMany({
      data: [
        {
          projectId: project.id,
          name: "Taux de réponse positif",
          value: 78,
          target: 70,
          unit: "%"
        },
        {
          projectId: project.id,
          name: "Délai de traitement",
          value: 4.2,
          target: 5,
          unit: "semaines"
        },
        {
          projectId: project.id,
          name: "Coût par traitement",
          value: 42000,
          target: 45000,
          unit: "€"
        }
      ]
    });

    // Créer les données de progression
    const progress = await prisma.projectProgress.create({
      data: {
        projectId: project.id,
        overall: 65,
        timeline: 70,
        budget: 60,
        milestones: 25 // 1 sur 4 milestones complétées = 25%
      }
    });

    // Créer les données financières
    const financials = await prisma.projectFinancial.create({
      data: {
        projectId: project.id,
        totalBudget: project.budget || 2000000,
        spent: 850000,
        remaining: 1150000,
        fundingProgress: 42.5
      }
    });

    console.log('✅ Données de dashboard créées avec succès');
    console.log(`📊 Projet: ${project.title}`);
    console.log(`📈 ${milestones.count} milestones créées`);
    console.log(`🎯 ${kpis.count} KPIs créés`);
    
  } catch (error) {
    console.error('❌ Erreur création données dashboard:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleDashboardData();