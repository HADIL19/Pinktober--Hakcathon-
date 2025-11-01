import { apiService } from './api';

export const projectService = {
  // Récupérer tous les projets avec filtres
  async getFilteredProjects(filters = {}, pagination = { page: 1, limit: 12 }) {
    try {
      // Transformation des filtres pour l'API
      const apiFilters = this.transformFiltersForAPI(filters);
      
      const response = await apiService.getProjects(apiFilters, pagination.page, pagination.limit);
      
      return {
        projects: response.data || [],
        totalCount: response.totalCount || 0,
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        hasMore: response.hasMore || false
      };
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Impossible de charger les projets. Veuillez réessayer.');
    }
  },

  // Récupérer un projet spécifique
  async getProject(projectId) {
    try {
      const project = await apiService.getProjectById(projectId);
      
      // Track view
      await this.trackProjectView(projectId);
      
      return project;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw new Error('Impossible de charger le projet. Veuillez réessayer.');
    }
  },

  // Créer un nouveau projet
  async createProject(projectData) {
    try {
      // Validation des données
      this.validateProjectData(projectData);
      
      const newProject = await apiService.createProject(projectData);
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Impossible de créer le projet. Veuillez vérifier les données.');
    }
  },

  // Mettre à jour un projet
  async updateProject(projectId, projectData) {
    try {
      const updatedProject = await apiService.updateProject(projectId, projectData);
      return updatedProject;
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Impossible de mettre à jour le projet.');
    }
  },

  // Transformer les filtres pour l'API
  transformFiltersForAPI(filters) {
    const apiFilters = {};
    
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== '') {
        switch (key) {
          case 'searchQuery':
            apiFilters.search = filters[key];
            break;
          case 'budget':
            { const [minBudget, maxBudget] = this.parseBudgetRange(filters[key]);
            if (minBudget !== undefined) apiFilters.minBudget = minBudget;
            if (maxBudget !== undefined) apiFilters.maxBudget = maxBudget;
            break; }
          case 'duration':
            { const [minDuration, maxDuration] = this.parseDurationRange(filters[key]);
            if (minDuration !== undefined) apiFilters.minDuration = minDuration;
            if (maxDuration !== undefined) apiFilters.maxDuration = maxDuration;
            break; }
          case 'aiScore':
            apiFilters.minScore = parseInt(filters[key]);
            break;
          default:
            apiFilters[key] = filters[key];
        }
      }
    });
    
    return apiFilters;
  },

  // Parser les ranges de budget
  parseBudgetRange(budgetRange) {
    switch (budgetRange) {
      case '0-50000':
        return [0, 50000];
      case '50000-200000':
        return [50000, 200000];
      case '200000-500000':
        return [200000, 500000];
      case '500000-1000000':
        return [500000, 1000000];
      case '1000000+':
        return [1000000, undefined];
      default:
        return [undefined, undefined];
    }
  },

  // Parser les ranges de durée
  parseDurationRange(durationRange) {
    switch (durationRange) {
      case '0-12':
        return [0, 12];
      case '12-24':
        return [12, 24];
      case '24-36':
        return [24, 36];
      case '36+':
        return [36, undefined];
      default:
        return [undefined, undefined];
    }
  },

  // Valider les données du projet
  validateProjectData(projectData) {
    const requiredFields = ['title', 'description', 'budget', 'duration', 'domain'];
    const missingFields = requiredFields.filter(field => !projectData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Champs manquants: ${missingFields.join(', ')}`);
    }
    
    if (projectData.budget <= 0) {
      throw new Error('Le budget doit être supérieur à 0');
    }
    
    if (projectData.duration <= 0) {
      throw new Error('La durée doit être supérieure à 0');
    }
  },

  // Tracker une vue de projet
  async trackProjectView(projectId) {
    try {
      await apiService.trackProjectView(projectId);
    } catch (error) {
      console.warn('Failed to track project view:', error);
    }
  },

  // Gérer les favoris
  async toggleFavorite(projectId) {
    try {
      // Vérifier d'abord si le projet est déjà en favori
      const favorites = await apiService.getFavorites();
      const isFavorite = favorites.some(fav => fav.projectId === projectId);
      
      if (isFavorite) {
        await apiService.removeFromFavorites(projectId);
        return false;
      } else {
        await apiService.addToFavorites(projectId);
        return true;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw new Error('Impossible de modifier les favoris.');
    }
  }
};