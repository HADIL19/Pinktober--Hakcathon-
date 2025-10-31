// backend/src/models/Project.js
import pool from '../config/database.js';

export const Project = {
  // ✅ Récupérer tous les projets avec filtres
  async findAll(filters = {}, pagination = { page: 1, limit: 12 }) {
    const {
      search,
      domain,
      stage,
      investmentType,
      location,
      innovationLevel,
      minBudget,
      maxBudget,
      minDuration,
      maxDuration,
      minScore,
      sortBy = 'score'
    } = filters;

    let whereConditions = ['status IN ("approved", "funding", "active")'];
    let params = [];

    // Filtre recherche texte
    if (search) {
      whereConditions.push('(title LIKE ? OR description LIKE ? OR researcher LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Filtres simples
    if (domain) {
      whereConditions.push('domain = ?');
      params.push(domain);
    }
    if (stage) {
      whereConditions.push('stage = ?');
      params.push(stage);
    }
    if (investmentType) {
      whereConditions.push('investment_type = ?');
      params.push(investmentType);
    }
    if (location) {
      whereConditions.push('location = ?');
      params.push(location);
    }
    if (innovationLevel) {
      whereConditions.push('innovation_level = ?');
      params.push(innovationLevel);
    }
    if (minScore) {
      whereConditions.push('score >= ?');
      params.push(parseInt(minScore));
    }

    // Filtres budget
    if (minBudget) {
      whereConditions.push('budget >= ?');
      params.push(parseInt(minBudget));
    }
    if (maxBudget) {
      whereConditions.push('budget <= ?');
      params.push(parseInt(maxBudget));
    }

    // Filtres durée
    if (minDuration) {
      whereConditions.push('duration >= ?');
      params.push(parseInt(minDuration));
    }
    if (maxDuration) {
      whereConditions.push('duration <= ?');
      params.push(parseInt(maxDuration));
    }

    // Options de tri
    let orderBy = 'score DESC';
    switch (sortBy) {
      case 'funding':
        orderBy = 'funding DESC';
        break;
      case 'budget':
        orderBy = 'budget DESC';
        break;
      case 'date':
        orderBy = 'created_at DESC';
        break;
      default:
        orderBy = 'score DESC';
    }

    // Pagination
    const offset = (pagination.page - 1) * pagination.limit;

    // Requête SQL
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    const query = `
      SELECT 
        id, title, description, summary, researcher, institution,
        domain, stage, budget, duration, investment_type as investmentType,
        location, innovation_level as innovationLevel, score, funding,
        is_featured as isFeatured, tags, status, views, created_at as createdAt
      FROM projects 
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const countQuery = `
      SELECT COUNT(*) as totalCount 
      FROM projects 
      ${whereClause}
    `;

    try {
      // Exécuter les requêtes
      const [projects] = await pool.execute([...params, pagination.limit, offset]);
      const [countResult] = await pool.execute([...params]);
      
      const totalCount = countResult[0].totalCount;
      const totalPages = Math.ceil(totalCount / pagination.limit);

      return {
        projects,
        pagination: {
          currentPage: pagination.page,
          totalPages,
          totalCount,
          hasMore: pagination.page < totalPages
        }
      };

    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },

  // ✅ Récupérer un projet par ID
  async findById(id) {
    const query = `
      SELECT 
        id, title, description, summary, researcher, institution,
        domain, stage, budget, duration, investment_type as investmentType,
        location, innovation_level as innovationLevel, score, funding,
        is_featured as isFeatured, tags, status, views, created_at as createdAt
      FROM projects 
      WHERE id = ?
    `;

    try {
      const [projects] = await pool.execute(query, [id]);
      return projects[0] || null;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },

  // ✅ Incrémenter les vues d'un projet
  async incrementViews(id) {
    const query = 'UPDATE projects SET views = views + 1 WHERE id = ?';
    
    try {
      await pool.execute(query, [id]);
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },

  // ✅ Récupérer les statistiques des projets
  async getStats() {
    const queries = {
      totalProjects: 'SELECT COUNT(*) as count FROM projects WHERE status IN ("approved", "funding", "active")',
      featuredProjects: 'SELECT COUNT(*) as count FROM projects WHERE is_featured = true AND status IN ("approved", "funding", "active")',
      totalBudget: 'SELECT SUM(budget) as total FROM projects WHERE status IN ("approved", "funding", "active")',
      avgFunding: 'SELECT AVG(funding) as average FROM projects WHERE status IN ("approved", "funding", "active")'
    };

    try {
      const [totalResult] = await pool.execute(queries.totalProjects);
      const [featuredResult] = await pool.execute(queries.featuredProjects);
      const [budgetResult] = await pool.execute(queries.totalBudget);
      const [fundingResult] = await pool.execute(queries.avgFunding);

      return {
        totalProjects: totalResult[0].count,
        featuredProjects: featuredResult[0].count,
        totalBudget: budgetResult[0].total || 0,
        avgFunding: fundingResult[0].average || 0
      };
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },

  // ✅ Récupérer les statistiques de la plateforme
  async getPlatformStats() {
    const queries = {
      activeProjects: 'SELECT COUNT(*) as count FROM projects WHERE status IN ("approved", "funding", "active")',
      completedProjects: 'SELECT COUNT(*) as count FROM projects WHERE status = "completed"',
      totalCapital: 'SELECT SUM(budget) as total FROM projects WHERE status IN ("approved", "funding", "active", "completed")',
      avgScore: 'SELECT AVG(score) as average FROM projects WHERE status IN ("approved", "funding", "active", "completed")'
    };

    try {
      const [activeResult] = await pool.execute(queries.activeProjects);
      const [completedResult] = await pool.execute(queries.completedProjects);
      const [capitalResult] = await pool.execute(queries.totalCapital);
      const [scoreResult] = await pool.execute(queries.avgScore);

      return {
        activeProjects: activeResult[0].count,
        completedProjects: completedResult[0].count,
        totalCapital: capitalResult[0].total || 28500000,
        avgScore: scoreResult[0].average || 85,
        successRate: 94 // Taux fixe pour l'instant
      };
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }
};