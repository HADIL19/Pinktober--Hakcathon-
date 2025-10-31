// GET /api/projects - Récupérer tous les projets pour la marketplace
const getAllProjects = async (req, res) => {
  try {
    console.log('📦 Fetching projects...');
    
    // Données mockées identiques à votre frontend
    const mockProjects = [
      {
        id: 1,
        title: "Immuno-Thérapie CAR-T Personnalisée",
        score: 98,
        description: "Développement d'une thérapie CAR-T personnalisée pour les cancers du sein triple-négatifs avec ciblage de nouveaux antigènes spécifiques.",
        budget: 2100000,
        duration: 36,
        domain: "immunotherapy",
        stage: "pre_clinical",
        funding: 85,
        tags: ["CAR-T", "Personnalisé", "Phase I", "Equity"],
        investmentType: "equity",
        location: "france",
        innovationLevel: "breakthrough",
        isFeatured: true,
        researcher: "Dr. Marie Lambert",
        institution: "Institut Curie",
        createdAt: "2024-01-15"
      },
      {
        id: 2,
        title: "IA de Diagnostic Précoce par Imagerie 3D",
        score: 92,
        description: "Algorithmes d'IA avancés pour la détection précoce du cancer du sein à partir d'imagerie mammographique 3D avec réduction des faux positifs.",
        budget: 1800000,
        duration: 24,
        domain: "ai_diagnostic",
        stage: "clinical_trials",
        funding: 65,
        tags: ["IA", "Deep Learning", "FDA Submission", "Equity"],
        investmentType: "equity",
        location: "usa",
        innovationLevel: "breakthrough",
        isFeatured: false,
        researcher: "Dr. Sophie Martin",
        institution: "MIT Medical",
        createdAt: "2024-01-10"
      },
      {
        id: 3,
        title: "Biomarqueurs Liquid Biopsy pour Suivi Traitement",
        score: 87,
        description: "Développement de panels de biomarqueurs sanguins pour le suivi personnalisé de l'efficacité des traitements et détection précoce de rechute.",
        budget: 950000,
        duration: 18,
        domain: "genomics",
        stage: "implementation",
        funding: 45,
        tags: ["Liquid Biopsy", "Biomarqueurs", "Monitoring", "Grant"],
        investmentType: "grant",
        location: "europe",
        innovationLevel: "incremental",
        isFeatured: false,
        researcher: "Dr. Alain Petit",
        institution: "INSERM",
        createdAt: "2024-01-08"
      },
      {
        id: 4,
        title: "Plateforme de Radiomique Avancée",
        score: 91,
        description: "Plateforme intégrée d'analyse radiomique pour la prédiction de réponse aux traitements et personnalisation thérapeutique.",
        budget: 3200000,
        duration: 30,
        domain: "ai_diagnostic",
        stage: "clinical_trials",
        funding: 72,
        tags: ["Radiomique", "Platform", "Predictive", "Equity"],
        investmentType: "equity",
        location: "usa",
        innovationLevel: "platform",
        isFeatured: true,
        researcher: "Dr. Robert Chen",
        institution: "Stanford Medicine",
        createdAt: "2024-01-12"
      }
    ];

    res.json({
      success: true,
      data: mockProjects,
      count: mockProjects.length
    });
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des projets',
      error: error.message
    });
  }
};

// GET /api/projects/:id - Récupérer un projet spécifique par ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Données mockées identiques
    const mockProjects = [
      {
        id: 1,
        title: "Immuno-Thérapie CAR-T Personnalisée",
        score: 98,
        description: "Développement d'une thérapie CAR-T personnalisée pour les cancers du sein triple-négatifs avec ciblage de nouveaux antigènes spécifiques.",
        budget: 2100000,
        duration: 36,
        domain: "immunotherapy",
        stage: "pre_clinical",
        funding: 85,
        tags: ["CAR-T", "Personnalisé", "Phase I", "Equity"],
        investmentType: "equity",
        location: "france",
        innovationLevel: "breakthrough",
        isFeatured: true,
        researcher: "Dr. Marie Lambert",
        institution: "Institut Curie",
        createdAt: "2024-01-15"
      },
      {
        id: 2,
        title: "IA de Diagnostic Précoce par Imagerie 3D",
        score: 92,
        description: "Algorithmes d'IA avancés pour la détection précoce du cancer du sein à partir d'imagerie mammographique 3D avec réduction des faux positifs.",
        budget: 1800000,
        duration: 24,
        domain: "ai_diagnostic",
        stage: "clinical_trials",
        funding: 65,
        tags: ["IA", "Deep Learning", "FDA Submission", "Equity"],
        investmentType: "equity",
        location: "usa",
        innovationLevel: "breakthrough",
        isFeatured: false,
        researcher: "Dr. Sophie Martin",
        institution: "MIT Medical",
        createdAt: "2024-01-10"
      },
      {
        id: 3,
        title: "Biomarqueurs Liquid Biopsy pour Suivi Traitement",
        score: 87,
        description: "Développement de panels de biomarqueurs sanguins pour le suivi personnalisé de l'efficacité des traitements et détection précoce de rechute.",
        budget: 950000,
        duration: 18,
        domain: "genomics",
        stage: "implementation",
        funding: 45,
        tags: ["Liquid Biopsy", "Biomarqueurs", "Monitoring", "Grant"],
        investmentType: "grant",
        location: "europe",
        innovationLevel: "incremental",
        isFeatured: false,
        researcher: "Dr. Alain Petit",
        institution: "INSERM",
        createdAt: "2024-01-08"
      },
      {
        id: 4,
        title: "Plateforme de Radiomique Avancée",
        score: 91,
        description: "Plateforme intégrée d'analyse radiomique pour la prédiction de réponse aux traitements et personnalisation thérapeutique.",
        budget: 3200000,
        duration: 30,
        domain: "ai_diagnostic",
        stage: "clinical_trials",
        funding: 72,
        tags: ["Radiomique", "Platform", "Predictive", "Equity"],
        investmentType: "equity",
        location: "usa",
        innovationLevel: "platform",
        isFeatured: true,
        researcher: "Dr. Robert Chen",
        institution: "Stanford Medicine",
        createdAt: "2024-01-12"
      }
    ];
    
    const project = mockProjects.find(p => p.id === parseInt(id));
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }

    console.log(`✅ Project ${id} fetched successfully`);
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('❌ Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById
};