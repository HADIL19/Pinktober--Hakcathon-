import React, { useState, useEffect } from 'react';
import './ProjectsMarketplace.css';
import { useNavigate } from 'react-router-dom';

const ProjectsMarketplace = () => {
  // États pour les filtres
  const [filters, setFilters] = useState({
    searchQuery: '',
    budget: '',
    domain: '',
    stage: '',
    duration: '',
    investmentType: '',
    aiScore: '',
    location: '',
    innovationLevel: ''
  });

  const [activeTags, setActiveTags] = useState([]);
  const [sortBy, setSortBy] = useState('score');
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  

  // Filtres disponibles
  const filterOptions = {
    budget: [
      { value: '', label: 'Budget' },
      { value: '0-50000', label: '0 - 50K€' },
      { value: '50000-200000', label: '50K - 200K€' },
      { value: '200000-500000', label: '200K - 500K€' },
      { value: '500000-1000000', label: '500K - 1M€' },
      { value: '1000000+', label: '1M€ et plus' }
    ],
    domain: [
      { value: '', label: 'Domaine' },
      { value: 'immunotherapy', label: 'Immunothérapie' },
      { value: 'early_detection', label: 'Détection Précoce' },
      { value: 'targeted_therapy', label: 'Thérapie Ciblée' },
      { value: 'genomics', label: 'Génomique' },
      { value: 'ai_diagnostic', label: 'IA et Diagnostic' }
    ],
    stage: [
      { value: '', label: 'Stade' },
      { value: 'basic_research', label: 'Recherche Fondamentale' },
      { value: 'pre_clinical', label: 'Pré-clinique' },
      { value: 'clinical_trials', label: 'Essais Cliniques' },
      { value: 'implementation', label: 'Implémentation' }
    ],
    duration: [
      { value: '', label: 'Durée' },
      { value: '0-12', label: '0-12 mois' },
      { value: '12-24', label: '12-24 mois' },
      { value: '24-36', label: '24-36 mois' },
      { value: '36+', label: '36+ mois' }
    ],
    investmentType: [
      { value: '', label: 'Type' },
      { value: 'equity', label: 'Capital' },
      { value: 'grant', label: 'Subvention' },
      { value: 'loan', label: 'Prêt' }
    ],
    aiScore: [
      { value: '', label: 'Score IA' },
      { value: '90', label: '90%+' },
      { value: '80', label: '80%+' },
      { value: '70', label: '70%+' }
    ],
    location: [
      { value: '', label: 'Localisation' },
      { value: 'europe', label: 'Europe' },
      { value: 'north_america', label: 'Amérique du Nord' },
      { value: 'france', label: 'France' },
      { value: 'usa', label: 'États-Unis' }
    ],
    innovationLevel: [
      { value: '', label: 'Innovation' },
      { value: 'breakthrough', label: 'Révolutionnaire' },
      { value: 'incremental', label: 'Incrémental' },
      { value: 'platform', label: 'Plateforme' }
    ]
  };

  const sortOptions = [
    { value: 'score', label: 'Score IA' },
    { value: 'funding', label: 'Financement' },
    { value: 'date', label: 'Date' },
    { value: 'budget', label: 'Budget' }
  ];

  const quickFilterTags = [
    { id: 'equity_available', label: 'Equity Disponible' },
    { id: 'clinical_trials', label: 'Essais Cliniques' },
    { id: 'ai_focused', label: 'IA & Data' },
    { id: 'europe', label: 'Europe' }
  ];

  // Chargement initial des projets depuis l'API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Chargement des projets depuis le backend...');
        
        const response = await fetch('http://localhost:5000/api/projects');
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          console.log(`✅ ${data.data.length} projets chargés depuis l'API`);
          setProjects(data.data);
          setFilteredProjects(data.data);
        } else {
          throw new Error(data.message || 'Erreur inconnue du serveur');
        }
      } catch (error) {
        console.error('❌ Erreur de connexion au backend:', error);
        setError('Impossible de charger les projets. Vérifiez que le serveur est démarré.');
        setProjects([]);
        setFilteredProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filtrage des projets
  useEffect(() => {
    let filtered = [...projects];

    // Filtre par recherche texte
    if (filters.searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        project.researcher.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()))
      );
    }

    // Appliquer tous les filtres
    Object.keys(filters).forEach(filterKey => {
      if (filters[filterKey] && filterKey !== 'searchQuery') {
        filtered = filtered.filter(project => {
          if (filterKey === 'budget') {
            const budget = project.budget;
            switch (filters.budget) {
              case '0-50000': return budget <= 50000;
              case '50000-200000': return budget > 50000 && budget <= 200000;
              case '200000-500000': return budget > 200000 && budget <= 500000;
              case '500000-1000000': return budget > 500000 && budget <= 1000000;
              case '1000000+': return budget > 1000000;
              default: return true;
            }
          }
          
          if (filterKey === 'aiScore') {
            return project.score >= parseInt(filters.aiScore);
          }
          
          if (filterKey === 'duration') {
            const duration = project.duration;
            switch (filters.duration) {
              case '0-12': return duration <= 12;
              case '12-24': return duration > 12 && duration <= 24;
              case '24-36': return duration > 24 && duration <= 36;
              case '36+': return duration > 36;
              default: return true;
            }
          }
          
          return project[filterKey] === filters[filterKey];
        });
      }
    });

    // Appliquer les tags actifs
    activeTags.forEach(tag => {
      switch (tag) {
        case 'equity_available':
          filtered = filtered.filter(project => project.investmentType === 'equity');
          break;
        case 'clinical_trials':
          filtered = filtered.filter(project => project.stage === 'clinical_trials');
          break;
        case 'ai_focused':
          filtered = filtered.filter(project => project.domain === 'ai_diagnostic');
          break;
        case 'europe':
          filtered = filtered.filter(project => project.location === 'europe' || project.location === 'france');
          break;
      }
    });

    // Trier les résultats
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'funding':
          return b.funding - a.funding;
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'budget':
          return b.budget - a.budget;
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  }, [filters, activeTags, projects, sortBy]);

  // Fonction pour "Voir détails"
  const handleViewDetails = (projectId)=>{
        navigate(`/project/${projectId}`);
};

  // Fonction pour "Investir"
  const handleInvest = (projectId, projectTitle) => {
   navigate(`/invest/${projectId}`);
  };

  // Fonction pour la pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log('📄 Page changée:', page);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const toggleTag = (tagId) => {
    setActiveTags(prev =>
      prev.includes(tagId)
        ? prev.filter(tag => tag !== tagId)
        : [...prev, tagId]
    );
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      budget: '',
      domain: '',
      stage: '',
      duration: '',
      investmentType: '',
      aiScore: '',
      location: '',
      innovationLevel: ''
    });
    setActiveTags([]);
    console.log('🔄 Filtres réinitialisés');
  };

  const formatBudget = (budget) => {
    if (budget >= 1000000) {
      return `${(budget / 1000000).toFixed(1)}M€`;
    }
    return `${(budget / 1000).toFixed(0)}K€`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#059669';
    if (score >= 80) return '#2563EB';
    if (score >= 70) return '#D97706';
    return '#DC2626';
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length + activeTags.length;

  // État de chargement
  if (loading) {
    return (
      <div className="projects-marketplace">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des projets depuis le serveur...</p>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="projects-marketplace">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Erreur de connexion</h3>
          <p>{error}</p>
          <p>Assurez-vous que le backend est démarré sur le port 4000.</p>
          <button 
            className="btn-primary" 
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-marketplace">
      {/* En-tête */}
      <header className="marketplace-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Marketplace des Projets</h1>
            <p>Découvrez des innovations prometteuses dans la recherche sur le cancer du sein</p>
          </div>
          <div className="header-stats">
            <div className="stat">
              <div className="stat-number">{projects.length}</div>
              <div className="stat-label">Projets Actifs</div>
            </div>
            <div className="stat">
              <div className="stat-number">94%</div>
              <div className="stat-label">Taux de Succès</div>
            </div>
          </div>
        </div>
      </header>

      {/* Barre de recherche et filtres */}
      <section className="filters-section">
        <div className="search-container">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher des projets, technologies, chercheurs..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            />
          </div>
          
          <div className="filters-row">
            {['domain', 'stage', 'budget', 'duration'].map(filter => (
              <select
                key={filter}
                className="filter-select"
                value={filters[filter]}
                onChange={(e) => handleFilterChange(filter, e.target.value)}
              >
                {filterOptions[filter].map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
            
            <button 
              className={`advanced-filters-btn ${showAdvancedFilters ? 'active' : ''}`}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
          </div>

          {showAdvancedFilters && (
            <div className="advanced-filters-panel">
              <div className="advanced-filters-grid">
                {['investmentType', 'aiScore', 'location', 'innovationLevel'].map(filter => (
                  <div key={filter} className="filter-group">
                    <label className="filter-label">
                      {filterOptions[filter][0].label}
                    </label>
                    <select
                      className="filter-select"
                      value={filters[filter]}
                      onChange={(e) => handleFilterChange(filter, e.target.value)}
                    >
                      {filterOptions[filter].map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              
              <div className="quick-filters">
                <label className="filter-label">Filtres Rapides</label>
                <div className="tags-container">
                  {quickFilterTags.map(tag => (
                    <button
                      key={tag.id}
                      className={`filter-tag ${activeTags.includes(tag.id) ? 'active' : ''}`}
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Résultats */}
      <section className="results-section">
        <div className="results-header">
          <div className="results-info">
            <span className="results-count">
              {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''} trouvé{filteredProjects.length !== 1 ? 's' : ''}
            </span>
            {activeFiltersCount > 0 && (
              <button className="reset-filters" onClick={resetFilters}>
                Réinitialiser les filtres
              </button>
            )}
          </div>
          
          <div className="sort-container">
            <label>Trier par :</label>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="projects-grid">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className={`project-card ${project.isFeatured ? 'featured' : ''}`}
            >
              {project.isFeatured && (
                <div className="featured-badge">Projet Vedette</div>
              )}
              
              <div className="project-header">
                <div className="project-meta">
                  <span className="project-institution">{project.institution}</span>
                  <div 
                    className="project-score"
                    style={{ backgroundColor: getScoreColor(project.score) }}
                  >
                    {project.score}%
                  </div>
                </div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
              </div>
              
              <div className="project-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Budget</span>
                    <span className="detail-value">{formatBudget(project.budget)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Durée</span>
                    <span className="detail-value">{project.duration} mois</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Financement</span>
                    <span className="detail-value">{project.funding}%</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Type</span>
                    <span className="detail-value">
                      {filterOptions.investmentType.find(t => t.value === project.investmentType)?.label}
                    </span>
                  </div>
                </div>
                
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${project.funding}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="project-footer">
                <div className="project-tags">
                  {project.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="project-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => handleViewDetails(project.id)}
                  >
                    Voir détails
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => handleInvest(project.id, project.title)}
                  >
                    Investir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && projects.length > 0 && (
          <div className="no-results">
            <div className="no-results-content">
              <h3>Aucun projet trouvé</h3>
              <p>Ajustez vos critères de recherche ou réinitialisez les filtres.</p>
              <button className="btn-primary" onClick={resetFilters}>
                Réinitialiser la recherche
              </button>
            </div>
          </div>
        )}

        {filteredProjects.length === 0 && projects.length === 0 && (
          <div className="no-results">
            <div className="no-results-content">
              <h3>Aucun projet disponible</h3>
              <p>Aucun projet n'est actuellement disponible dans la base de données.</p>
            </div>
          </div>
        )}

        {filteredProjects.length > 0 && (
          <div className="pagination">
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            <div className="pagination-pages">
              {[1, 2, 3].map(page => (
                <button
                  key={page}
                  className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Suivant
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProjectsMarketplace;