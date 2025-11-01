// backend/src/routes/init-db.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Route pour initialiser la base de données avec des projets
router.post('/init-projects', async (req, res) => {
  try {
    console.log('🚀 Initialisation de la base de données...');

    // Vérifier si un chercheur existe
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

    // Projets avec les bons enums Prisma
    const sampleProjects = [
      {
        title: "Immuno-Thérapie CAR-T Personnalisée",
        description: "Développement de thérapies CAR-T personnalisées pour le cancer du sein triple négatif. Approche innovante ciblant les cellules cancéreuses résistantes aux traitements conventionnels avec un taux de réponse de 85%.",
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
        tags: ["CAR-T", "immunothérapie", "personnalisé", "sein", "cancer"]
      },
      {
        title: "IA de Diagnostic Précoce par Imagerie 3D",
        description: "Plateforme d'intelligence artificielle pour la détection précoce des cancers par imagerie médicale 3D. Algorithmes avancés de computer vision pour une précision diagnostique inégalée avec réduction de 40% des faux positifs.",
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
        tags: ["IA", "diagnostic", "imagerie", "3D", "précoce", "machine learning"]
      },
      {
        title: "Plateforme de Radiomique Avancée",
        description: "Solution de radiomique pour l'analyse quantitative des images médicales. Intégration AI pour la prédiction de réponse au traitement et le suivi personnalisé des patients avec une précision de 94%.",
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
        tags: ["radiomique", "analyse", "quantitative", "suivi", "imagerie"]
      },
      {
        title: "Thérapie Génique Ciblée BRCA",
        description: "Développement d'une thérapie génique innovante ciblant spécifiquement les mutations BRCA pour le traitement des cancers héréditaires avec approche CRISPR avancée.",
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
        tags: ["thérapie génique", "BRCA", "génétique", "ciblée", "CRISPR"]
      },
      {
        title: "Nanoparticules Intelligentes pour Chimiothérapie",
        description: "Développement de nanoparticules capables de délivrer spécifiquement les agents chimiothérapeutiques aux cellules cancéreuses, réduisant les effets secondaires de 60%.",
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
        tags: ["nanoparticules", "chimiothérapie", "ciblage", "intelligent", "delivery"]
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
        },
        include: {
          tags: true,
          owner: true
        }
      });
      createdProjects.push(project);
      console.log(`✅ Projet créé: ${project.title} (ID: ${project.id})`);
    }

    console.log(`🎉 ${createdProjects.length} projets créés avec succès!`);

    res.json({
      success: true,
      message: `Base de données initialisée avec ${createdProjects.length} projets`,
      projects: createdProjects.map(p => ({
        id: p.id,
        title: p.title,
        domain: p.domain,
        stage: p.stage,
        tags: p.tags.map(t => t.tag)
      }))
    });

  } catch (error) {
    console.error('❌ Erreur initialisation base de données:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Route pour vérifier l'état de la base
router.get('/status', async (req, res) => {
  try {
    const projectCount = await prisma.project.count();
    const userCount = await prisma.user.count();
    
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        domain: true,
        stage: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    res.json({
      success: true,
      data: {
        projectCount,
        userCount,
        recentProjects: projects,
        database: 'Prisma MySQL'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;