// backend/src/routes/projects.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Route principale pour récupérer tous les projets
router.get('/', async (req, res) => {
  try {
    console.log('📡 Route /api/projects appelée - Récupération depuis la base de données');
    
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

    console.log(`✅ ${projects.length} projets récupérés de la base de données`);

    // Transformer les données pour correspondre à la structure attendue
    const transformedProjects = projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      budget: project.budget,
      duration: project.duration,
      domain: project.domain,
      stage: project.stage,
      funding: project.funding,
      tags: project.tags.map(tag => tag.tag),
      investmentType: project.investmentType,
      location: project.location,
      innovationLevel: project.innovationLevel,
      isFeatured: project.isFeatured,
      score: project.score,
      researcher: project.owner?.name || 'Chercheur inconnu',
      institution: project.owner?.company || 'Institution inconnue',
      createdAt: project.createdAt
    }));

    res.json({
      success: true,
      data: transformedProjects,
      count: transformedProjects.length
    });

  } catch (error) {
    console.error('❌ Erreur récupération projets:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des projets'
    });
  }
});

// Route pour créer des projets exemple
router.post('/create-sample-projects', async (req, res) => {
  try {
    // Vérifier si un chercheur existe
    let researcher = await prisma.user.findFirst({
      where: { role: 'RESEARCHER' }
    });

    // Créer un chercheur si nécessaire
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

    // Projets à créer
    const sampleProjects = [
      {
        title: "Immuno-Thérapie CAR-T Personnalisée",
        description: "Développement de thérapies CAR-T personnalisées pour le cancer du sein triple négatif. Approche innovante ciblant les cellules cancéreuses résistantes.",
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
        tags: ["CAR-T", "immunothérapie", "personnalisé"]
      },
      {
        title: "IA de Diagnostic Précoce par Imagerie 3D",
        description: "Plateforme d'intelligence artificielle pour la détection précoce des cancers par imagerie médicale 3D. Algorithmes avancés de computer vision.",
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
        tags: ["IA", "diagnostic", "imagerie", "3D"]
      },
      {
        title: "Plateforme de Radiomique Avancée",
        description: "Solution de radiomique pour l'analyse quantitative des images médicales. Intégration AI pour la prédiction de réponse au traitement.",
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
        tags: ["radiomique", "analyse", "quantitative"]
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

    res.json({
      success: true,
      message: `${createdProjects.length} projets créés avec succès`,
      projects: createdProjects.map(p => ({ id: p.id, title: p.title }))
    });

  } catch (error) {
    console.error('❌ Erreur création projets:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route debug pour vérifier les données
router.get('/debug', async (req, res) => {
  try {
    console.log('🔍 Debug: Récupération des projets...');
    
    // Compter le nombre total de projets
    const projectCount = await prisma.project.count();
    console.log(`📊 Total projets dans la base: ${projectCount}`);
    
    // Récupérer tous les projets avec leurs relations
    const projects = await prisma.project.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true
          }
        },
        tags: true,
        investments: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('📋 Projets trouvés:');
    projects.forEach((project, index) => {
      console.log(`   ${index + 1}. ${project.title} (ID: ${project.id})`);
      console.log(`      Chercheur: ${project.owner?.name}`);
      console.log(`      Tags: ${project.tags?.map(t => t.tag).join(', ')}`);
    });

    res.json({
      success: true,
      debug: {
        totalProjects: projectCount,
        projectsFound: projects.length,
        sampleProject: projects[0] || 'Aucun projet'
      },
      data: projects
    });
    
  } catch (error) {
    console.error('❌ Erreur debug projets:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Route pour un projet spécifique
router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        owner: {
          select: {
            name: true,
            company: true,
            email: true
          }
        },
        tags: true,
        investments: true
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Projet non trouvé'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du projet'
    });
  }
});

export default router;