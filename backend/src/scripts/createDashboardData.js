// backend/src/scripts/createDashboardData.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createDashboardData() {
  try {
    console.log('🎯 Création des données de dashboard...');

    // Récupérer tous les projets
    const projects = await prisma.project.findMany();
    
    if (projects.length === 0) {
      console.log('❌ Aucun projet trouvé. Créez d\'abord des projets.');
      return;
    }

    console.log(`📊 Création des données pour ${projects.length} projets...`);

    for (const project of projects) {
      console.log(`\n🔄 Traitement du projet: ${project.title}`);

      // Créer les milestones
      const milestones = await prisma.projectMilestone.createMany({
        data: [
          {
            projectId: project.id,
            name: "Étude préclinique terminée",
            description: "Validation des résultats en laboratoire",
            dueDate: new Date('2024-03-01'),
            completed: Math.random() > 0.3,
            completedAt: Math.random() > 0.3 ? new Date('2024-02-28') : null
          },
          {
            projectId: project.id,
            name: "Recrutement patients",
            description: "Recrutement des patients pour les essais cliniques",
            dueDate: new Date('2024-06-01'),
            completed: Math.random() > 0.7,
            completedAt: Math.random() > 0.7 ? new Date('2024-05-20') : null
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

      // Créer les KPIs
      const kpis = await prisma.projectKPI.createMany({
        data: [
          {
            projectId: project.id,
            name: "Taux de réussite expérimentale",
            value: Math.floor(Math.random() * 30) + 70, // 70-100%
            target: 80,
            unit: "%"
          },
          {
            projectId: project.id,
            name: "Délai de développement",
            value: Math.floor(Math.random() * 12) + 6, // 6-18 mois
            target: 12,
            unit: "mois"
          },
          {
            projectId: project.id,
            name: "Coût par patient",
            value: Math.floor(Math.random() * 20000) + 30000, // 30-50k€
            target: 40000,
            unit: "€"
          }
        ]
      });

      // Calculer la progression des milestones
      const projectMilestones = await prisma.projectMilestone.findMany({
        where: { projectId: project.id }
      });
      const completedMilestones = projectMilestones.filter(m => m.completed).length;
      const milestoneProgress = projectMilestones.length > 0 ? 
        (completedMilestones / projectMilestones.length) * 100 : 0;

      // Créer les données de progression
      const progress = await prisma.projectProgress.create({
        data: {
          projectId: project.id,
          overall: Math.min(100, milestoneProgress * 0.6 + (project.funding || 0) * 0.4),
          timeline: Math.floor(Math.random() * 40) + 30, // 30-70%
          budget: project.funding || 0,
          milestones: milestoneProgress
        }
      });

      // Créer les données financières
      const financials = await prisma.projectFinancial.create({
        data: {
          projectId: project.id,
          totalBudget: project.budget || 1000000,
          spent: (project.budget || 1000000) * (project.funding || 0) / 100 * 0.7,
          remaining: (project.budget || 1000000) - ((project.budget || 1000000) * (project.funding || 0) / 100 * 0.7),
          fundingProgress: project.funding || 0
        }
      });

      console.log(`✅ Données créées pour ${project.title}`);
      console.log(`   📈 Progression: ${Math.round(progress.overall)}%`);
      console.log(`   💰 Budget: ${financials.totalBudget.toLocaleString()}€`);
      console.log(`   🎯 Milestones: ${completedMilestones}/${projectMilestones.length} terminées`);
    }

    console.log('\n🎉 Toutes les données de dashboard créées avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur création données dashboard:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
createDashboardData()
  .then(() => {
    console.log('\n✨ Script dashboard terminé avec succès!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erreur lors de l\'exécution du script dashboard:', error);
    process.exit(1);
  });