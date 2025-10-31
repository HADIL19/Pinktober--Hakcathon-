// src/quick-seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function quickSeed() {
  try {
    console.log('🌱 Création des données de test...');

    // Créer un chercheur
    const researcher = await prisma.user.create({
      data: {
        email: 'dr.dupont@institut-curie.fr',
        password: 'password123',
        name: 'Dr. Sophie Dupont',
        role: 'RESEARCHER',
        company: 'Institut Curie',
        bio: 'Chercheuse spécialisée en immunothérapie'
      }
    });

    // Créer un investisseur
    const investor = await prisma.user.create({
      data: {
        email: 'contact@kminvestments.com',
        password: 'password123',
        name: 'Jean Martin',
        role: 'INVESTOR',
        company: 'KM Investments',
        bio: 'Investisseur en santé et biotechnologies'
      }
    });

    // Créer un projet
    const project = await prisma.project.create({
      data: {
        title: 'Immuno-Thérapie CAR-T Personnalisée',
        description: 'Développement d\'une thérapie CAR-T personnalisée pour les cancers du sein triple-négatifs avec ciblage de nouveaux antigènes spécifiques.',
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
            { tag: 'Immunothérapie' },
            { tag: 'Personnalisée' },
            { tag: 'Cancer Sein' }
          ]
        }
      }
    });

    console.log('🎉 DONNÉES CRÉÉES AVEC SUCCÈS !');
    console.log('================================');
    console.log('👨‍🔬 CHERCHEUR créé:');
    console.log('   ID:', researcher.id);
    console.log('   Nom:', researcher.name);
    console.log('   Email:', researcher.email);
    
    console.log('💼 INVESTISSEUR créé:');
    console.log('   ID:', investor.id);
    console.log('   Nom:', investor.name);
    console.log('   Email:', investor.email);
    
    console.log('📊 PROJET créé:');
    console.log('   ID:', project.id);
    console.log('   Titre:', project.title);
    console.log('   Propriétaire ID:', project.ownerId);
    
    console.log('\n📋 IDs À UTILISER DANS POSTMAN:');
    console.log('   receiverId (pour messages):', researcher.id);
    console.log('   projectId (pour investissements):', project.id);

  } catch (error) {
    console.error('❌ ERREUR lors de la création:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

quickSeed();