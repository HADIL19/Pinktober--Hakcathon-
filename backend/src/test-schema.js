// src/test-schema.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🧪 Test de connexion à la base de données...');
    
    // Test 1: Connexion basique
    const users = await prisma.user.findMany();
    console.log('✅ Connexion réussie');
    console.log(`📊 Nombre d'utilisateurs: ${users.length}`);
    
    // Afficher les utilisateurs s'il y en a
    if (users.length > 0) {
      users.forEach(user => {
        console.log(`   - ${user.name} (${user.email}) - ${user.role}`);
      });
    }
    
    // Test 2: Relations User -> Projects
    const usersWithProjects = await prisma.user.findMany({
      include: {
        projectsOwned: true
      }
    });
    console.log(`👥 Utilisateurs avec projets: ${usersWithProjects.length}`);
    
    // Test 3: Relations Project -> Investments
    const projects = await prisma.project.findMany({
      include: {
        owner: {
          select: { name: true, email: true }
        },
        investments: true,
        tags: true
      }
    });
    
    console.log(`📈 Nombre de projets: ${projects.length}`);
    
    projects.forEach(project => {
      console.log(`   - ${project.title}: ${project.investments.length} investissements, ${project.tags.length} tags`);
    });
    
    // Test 4: Vérifier les nouvelles tables
    const messages = await prisma.message.findMany();
    const notifications = await prisma.notification.findMany();
    
    console.log(`💬 Messages: ${messages.length}`);
    console.log(`🔔 Notifications: ${notifications.length}`);
    
    console.log('\n🎉 Tous les tests sont passés ! Votre schéma est fonctionnel.');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    console.error('Détails:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le test
testConnection();