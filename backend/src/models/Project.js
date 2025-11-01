// backend/src/routes/projects.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Route principale POUR PRISMA UNIQUEMENT
router.get('/', async (req, res) => {
  try {
    console.log('🎯 Route /api/projects - Récupération depuis PRISMA');
    
    const projects = await prisma.project.findMany({
      include: {
        owner: {
          select: {
            name: true,
            company: true
          }
        },
        tags: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 ${projects.length} projets trouvés dans PRISMA`);

    if (projects.length === 0) {
      console.log('⚠️ Base de données vide - aucun projet dans Prisma');
      return res.json({
        success: true,
        data: [],
        count: 0,
        message: "Aucun projet dans la base de données. Utilisez /create-sample-projects pour en créer."
      });
    }

    // Transformer les données PRISMA
    const transformedProjects = projects.map(project => {
      console.log('🔍 Projet Prisma:', {
        id: project.id,
        title: project.title,
        domain: project.domain, // Doit être en MAJUSCULES (IMMUNOTHERAPY)
        stage: project.stage,   // Doit être en MAJUSCULES (CLINICAL_TRIALS_PHASE_1)
        tags: project.tags.map(t => t.tag)
      });

      return {
        id: project.id,
        title: project.title,
        description: project.description,
        budget: project.budget,
        duration: project.duration,
        domain: project.domain, // VOS ENUMS PRISMA
        stage: project.stage,   // VOS ENUMS PRISMA  
        funding: project.funding,
        tags: project.tags.map(tag => tag.tag),
        investmentType: project.investmentType, // VOS ENUMS PRISMA
        location: project.location,
        innovationLevel: project.innovationLevel, // VOS ENUMS PRISMA
        isFeatured: project.isFeatured,
        score: project.score,
        researcher: project.owner?.name || 'Chercheur inconnu',
        institution: project.owner?.company || 'Institution inconnue',
        createdAt: project.createdAt
      };
    });

    res.json({
      success: true,
      data: transformedProjects,
      count: transformedProjects.length,
      source: 'PRISMA_DATABASE'
    });

  } catch (error) {
    console.error('❌ Erreur récupération projets Prisma:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur base de données',
      details: error.message
    });
  }
});

// Route pour vider et recréer les projets
router.post('/reset-projects', async (req, res) => {
  try {
    console.log('🔄 Reset des projets...');
    
    // Supprimer tous les projets existants
    await prisma.projectTag.deleteMany({});
    await prisma.project.deleteMany({});
    
    console.log('✅ Anciens projets supprimés');
    
    // Créer un chercheur si nécessaire
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
      console.log('✅ Chercheur créé:', researcher.id);
    }

    // Projets avec les bons enums PRISMA
    const sampleProjects = [
      {
        title: "Immuno-Thérapie CAR-T Personnalisée",
        description: "Développement de thérapies CAR-T personnalisées pour le cancer du sein triple négatif. Approche innovante ciblant les cellules cancéreuses résistantes.",
        budget: 2100000,
        duration: 36,
        funding: 35,
        domain: "IMMUNOTHERAPY", // ENUM PRISMA
        stage: "CLINICAL_TRIALS_PHASE_1", // ENUM PRISMA
        status: "ACTIVE",
        investmentType: "EQUITY", // ENUM PRISMA
        location: "Paris, France",
        score: 92,
        isFeatured: true,
        innovationLevel: "BREAKTHROUGH", // ENUM PRISMA
        ownerId: researcher.id,
        tags: ["CAR-T", "immunothérapie", "personnalisé", "sein"]
      },
      {
        title: "IA de Diagnostic Précoce par Imagerie 3D",
        description: "Plateforme d'intelligence artificielle pour la détection précoce des cancers par imagerie médicale 3D. Algorithmes avancés de computer vision.",
        budget: 1800000,
        duration: 24,
        funding: 25,
        domain: "AI_DIAGNOSTIC", // ENUM PRISMA
        stage: "PRE_CLINICAL", // ENUM PRISMA
        status: "ACTIVE", 
        investmentType: "EQUITY", // ENUM PRISMA
        location: "Boston, USA",
        score: 88,
        isFeatured: true,
        innovationLevel: "BREAKTHROUGH", // ENUM PRISMA
        ownerId: researcher.id,
        tags: ["IA", "diagnostic", "imagerie", "3D", "précoce"]
      },
      {
        title: "Plateforme de Radiomique Avancée",
        description: "Solution de radiomique pour l'analyse quantitative des images médicales. Intégration AI pour la prédiction de réponse au traitement.",
        budget: 1500000,
        duration: 30,
        funding: 40,
        domain: "AI_DIAGNOSTIC", // ENUM PRISMA
        stage: "CLINICAL_TRIALS_PHASE_2", // ENUM PRISMA
        status: "ACTIVE",
        investmentType: "EQUITY", // ENUM PRISMA
        location: "Lyon, France",
        score: 85,
        isFeatured: false,
        innovationLevel: "PLATFORM", // ENUM PRISMA
        ownerId: researcher.id,
        tags: ["radiomique", "analyse", "quantitative", "suivi"]
      }
    ];

    const createdProjects = [];
    
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

    res.json({
      success: true,
      message: `${createdProjects.length} projets créés dans PRISMA`,
      projects: createdProjects.map(p => ({ 
        id: p.id, 
        title: p.title,
        domain: p.domain,
        stage: p.stage 
      }))
    });

  } catch (error) {
    console.error('❌ Erreur reset projets:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;