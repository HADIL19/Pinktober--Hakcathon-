// src/seed.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  // Créer des utilisateurs de test
  const researcher = await prisma.user.create({
    data: {
      email: 'marie.curie@research.fr',
      password: 'hashedpassword',
      name: 'Marie Curie',
      role: 'RESEARCHER',
      company: 'Institut Curie'
    }
  });

  const project = await prisma.project.create({
    data: {
      title: 'Immuno-Thérapie CAR-T Personnalisée',
      description: 'Développement d\'une thérapie CAR-T personnalisée pour les cancers du sein triple-négatifs',
      budget: 2100000,
      duration: 36,
      funding: 85,
      domain: 'IMMUNOTHERAPY',
      stage: 'CLINICAL_TRIALS_PHASE_1',
      investmentType: 'EQUITY',
      location: 'Paris, France',
      score: 98,
      isFeatured: true,
      innovationLevel: 'BREAKTHROUGH',
      ownerId: researcher.id,
      tags: {
        create: [
          { tag: 'CAR-T' },
          { tag: 'Personnalisée' },
          { tag: 'Phase I' }
        ]
      }
    }
  });

  console.log('✅ Données de test créées !');
}

seed();