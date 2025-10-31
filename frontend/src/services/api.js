// Services pour communiquer avec le backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Projects
  async getProjects(filters = {}, page = 1, limit = 12) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });

    return this.request(`/projects?${queryParams}`);
  }

  async getProjectById(id) {
    return this.request(`/projects/${id}`);
  }

  async createProject(projectData) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id, projectData) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  // Investments
  async createInvestment(investmentData) {
    return this.request('/investments', {
      method: 'POST',
      body: JSON.stringify(investmentData),
    });
  }

  async getInvestorPortfolio() {
    return this.request('/investments/portfolio');
  }

  // Favorites
  async addToFavorites(projectId) {
    return this.request(`/favorites/${projectId}`, {
      method: 'POST',
    });
  }

  async removeFromFavorites(projectId) {
    return this.request(`/favorites/${projectId}`, {
      method: 'DELETE',
    });
  }

  async getFavorites() {
    return this.request('/favorites');
  }

  // Analytics
  async getProjectViews(projectId) {
    return this.request(`/analytics/projects/${projectId}/views`);
  }

  async trackProjectView(projectId) {
    return this.request(`/analytics/projects/${projectId}/view`, {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();