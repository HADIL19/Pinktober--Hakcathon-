const { Project } = require('../models/Project');

// ✅ GET /api/analytics/platform-stats - Statistiques de la plateforme
const getPlatformStats = async (req, res) => {
  try {
    const stats = await Project.getPlatformStats();

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error in getPlatformStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques plateforme',
      error: error.message
    });
  }
};

module.exports = { getPlatformStats };
