// backend/src/controllers/analyticsController.js
import Project from '../models/Project.js';

// ✅ GET /api/analytics/platform-stats - Statistiques de la plateforme
export const getPlatformStats = async (req, res) => {
  try {
    const activeProjects = await Project.countDocuments({ 
      status: { $in: ['approved', 'funding', 'active'] } 
    });

    const completedProjects = await Project.countDocuments({ 
      status: 'completed' 
    });

    // Calcul du capital investi (exemple simplifié)
    const investmentStats = await Project.aggregate([
      { $match: { status: { $in: ['approved', 'funding', 'active', 'completed'] } } },
      {
        $group: {
          _id: null,
          totalCapital: { $sum: '$budget' },
          avgScore: { $avg: '$score' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        activeProjects,
        completedProjects,
        totalCapital: investmentStats[0]?.totalCapital || 28500000, // Valeur par défaut
        successRate: 94, // Taux de succès fixe pour l'instant
        avgScore: investmentStats[0]?.avgScore || 85
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques plateforme',
      error: error.message
    });
  }
};