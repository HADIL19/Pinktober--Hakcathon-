// backend/src/scripts/seedInvestments.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedInvestments() {
  try {
    // Créer quelques investissements de test
    const investments = [
      {
        amount: 75000,
        investor: "Marie Dubois",
        type: "EQUITY",
        status: "APPROVED",
        contactEmail: "marie.dubois@email.com",
        phone: "+33 6 12 34 56 78",
        projectId: 1, // Assurez-vous que ce projet existe
        message: "Intéressé par l'innovation en immunothérapie"
      },
      {
        amount: 50000,
        investor: "Marie Dubois", 
        type: "EQUITY",
        status: "PENDING",
        contactEmail: "marie.dubois@email.com",
        projectId: 2,
        message: "Projet prometteur en IA médicale"
      },
      {
        amount: 100000,
        investor: "Marie Dubois",
        type: "EQUITY", 
        status: "APPROVED",
        contactEmail: "marie.dubois@email.com",
        projectId: 3,
        message: "Investissement dans la plateforme de radiomique"
      }
    ];

    for (const investmentData of investments) {
      await prisma.investment.create({
        data: investmentData
      });
    }

    console.log('✅ Investissements de test créés avec succès');
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le seeding
seedInvestments();