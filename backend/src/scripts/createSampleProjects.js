// backend/src/scripts/createSampleProjects.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSampleProjects() {
  try {
    console.log('🎯 Création de projets exemple...');

    // Vérifier si un chercheur existe, sinon en créer un
    let researcher = await prisma.user.findFirst({
      where: { role: 'RESEARCHER' }
    });

    if (!researcher) {
      researcher = await prisma.user.create({
        data: {
          email: 'dr.lambert@institut-curie.fr',
          password: 'temp123',
          name: 'Dr. Marie Lambert',
          role: 'RESEARCHER',
          company: 'Institut Curie',
          isVerified: true
        }
      });
      console.log('✅ Chercheur créé:', researcher.name);
    }

    // Liste des projets à créer
    const sampleProjects = [
      {
        title: "Immuno-Thérapie CAR-T Personnalisée",
        description: "Développement de thérapies CAR-T personnalisées pour le cancer du sein triple négatif. Approche innovante ciblant les cellules cancéreuses résistantes aux traitements conventionnels.",
        budget: 2100000,
        duration: 36,
        funding: 35,
        domain: "IMMUNOTHERAPY",
        stage: "CLINICAL_TRIALS_PHASE_1",
        status: "ACTIVE",
        investmentType: "EQUITY",
        location: "Paris, France",
        score: 92,
        isFeatured: true,
        innovationLevel: "BREAKTHROUGH",
        ownerId: researcher.id,
        tags: ["immunothérapie", "CAR-T", "personnalisé", "sein"]
      },
      {
        title: "IA de Diagnostic Précoce par Imagerie 3D",
        description: "Plateforme d'intelligence artificielle pour la détection précoce des cancers par imagerie médicale 3D. Algorithmes avancés de computer vision pour une précision diagnostique inégalée.",
        budget: 1800000,
        duration: 24,
        funding: 25,
        domain: "AI_DIAGNOSTIC",
        stage: "PRE_CLINICAL",
        status: "ACTIVE",
        investmentType: "EQUITY",
        location: "Boston, USA",
        score: 88,
        isFeatured: true,
        innovationLevel: "BREAKTHROUGH",
        ownerId: researcher.id,
        tags: ["IA", "diagnostic", "imagerie", "3D", "précoce"]
      },
      {
        title: "Plateforme de Radiomique Avancée",
        description: "Solution de radiomique pour l'analyse quantitative des images médicales. Intégration AI pour la prédiction de réponse au traitement et le suivi personnalisé des patients.",
        budget: 1500000,
        duration: 30,
        funding: 40,
        domain: "AI_DIAGNOSTIC",
        stage: "CLINICAL_TRIALS_PHASE_2",
        status: "ACTIVE",
        investmentType: "EQUITY",
        location: "Lyon, France",
        score: 85,
        isFeatured: false,
        innovationLevel: "PLATFORM",
        ownerId: researcher.id,
        tags: ["radiomique", "analyse", "quantitative", "suivi"]
      },
      {
        title: "Thérapie Génique Ciblée BRCA",
        description: "Développement d'une thérapie génique innovante ciblant spécifiquement les mutations BRCA pour le traitement des cancers héréditaires.",
        budget: 2500000,
        duration: 48,
        funding: 20,
        domain: "GENOMICS",
        stage: "BASIC_RESEARCH",
        status: "ACTIVE",
        investmentType: "EQUITY",
        location: "Londres, UK",
        score: 90,
        isFeatured: true,
        innovationLevel: "DISRUPTIVE",
        ownerId: researcher.id,
        tags: ["thérapie génique", "BRCA", "génétique", "ciblée"]
      },
      {
        title: "Nanoparticules Intelligentes pour Chimiothérapie",
        description: "Développement de nanoparticules capables de délivrer spécifiquement les agents chimiothérapeutiques aux cellules cancéreuses, réduisant les effets secondaires.",
        budget: 1200000,
        duration: 28,
        funding: 45,
        domain: "TARGETED_THERAPY",
        stage: "PRE_CLINICAL",
        status: "ACTIVE",
        investmentType: "EQUITY",
        location: "Zurich, Suisse",
        score: 87,
        isFeatured: false,
        innovationLevel: "BREAKTHROUGH",
        ownerId: researcher.id,
        tags: ["nanoparticules", "chimiothérapie", "ciblage", "intelligent"]
      },
      {
        title: "Plateforme de Médecine Personnalisée Oncologie",
        description: "Solution complète de médecine personnalisée intégrant données génomiques, cliniques et d'imagerie pour des traitements sur mesure.",
        budget: 3000000,
        duration: 36,
        funding: 30,
        domain: "PERSONALIZED_MEDICINE",
        stage: "CLINICAL_TRIALS_PHASE_1",
        status: "ACTIVE",
        investmentType: "EQUITY",
        location: "San Francisco, USA",
        score: 89,
        isFeatured: true,
        innovationLevel: "PLATFORM",
        ownerId: researcher.id,
        tags: ["médecine personnalisée", "génomique", "intégrative", "sur-mesure"]
      },
      {
        title: "Découverte de Biomarqueurs Prédictifs",
        description: "Identification et validation de nouveaux biomarqueurs pour prédire la réponse aux immunothérapies dans les cancers avancés.",
        budget: 900000,
        duration: 24,
        funding: 55,
        domain: "EARLY_DETECTION",
        stage: "CLINICAL_TRIALS_PHASE_2",
        status: "ACTIVE",
        investmentType: "GRANT",
        location: "Montréal, Canada",
        score: 83,
        isFeatured: false,
        innovationLevel: "INCREMENTAL",
        ownerId: researcher.id,
        tags: ["biomarqueurs", "prédictif", "immunothérapie", "validation"]
      },
      {
        title: "IA pour Optimisation des Protocoles de Traitement",
        description: "Système d'IA analysant les données patients en temps réel pour optimiser les protocoles de traitement et améliorer l'efficacité thérapeutique.",
        budget: 1600000,
        duration: 30,
        funding: 35,
        domain: "AI_DIAGNOSTIC",
        stage: "CLINICAL_TRIALS_PHASE_1",
        status: "ACTIVE",
        investmentType: "EQUITY",
        location: "Berlin, Allemagne",
        score: 86,
        isFeatured: false,
        innovationLevel: "PLATFORM",
        ownerId: researcher.id,
        tags: ["IA", "optimisation", "protocole", "temps réel"]
      }
    ];

    const createdProjects = [];
    
    // Créer chaque projet avec ses tags
    for (const projectData of sampleProjects) {
      const { tags, ...projectInfo } = projectData;
      
      const project = await prisma.project.create({
        data: {
          ...projectInfo,
          tags: {
            create: tags.map(tag => ({ tag }))
          }
        }
      });
      
      createdProjects.push(project);
      console.log(`✅ Projet créé: ${project.title} (ID: ${project.id})`);
    }

    console.log('\n🎉 Tous les projets créés avec succès!');
    console.log(`📊 Total: ${createdProjects.length} projets`);
    
    // Afficher le résumé
    console.log('\n📋 Résumé des projets créés:');
    createdProjects.forEach(project => {
      console.log(`   • ${project.title} - ${project.domain} - Score: ${project.score}`);
    });

    return createdProjects;
    
  } catch (error) {
    console.error('❌ Erreur création projets:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
createSampleProjects()
  .then(() => {
    console.log('\n✨ Script terminé avec succès!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erreur lors de l\'exécution du script:', error);
    process.exit(1);
  });