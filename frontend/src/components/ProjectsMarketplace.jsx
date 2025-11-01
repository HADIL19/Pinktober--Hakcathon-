import React, { useState, useEffect } from 'react';
import './ProjectsMarketplace.css';
import { useNavigate } from 'react-router-dom';

const ProjectsMarketplace = () => {
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
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('Chargement...');
  const navigate = useNavigate();

  // Filtres disponibles - ADAPTÉS À PRISMA
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
      { value: 'IMMUNOTHERAPY', label: 'Immunothérapie' },
      { value: 'AI_DIAGNOSTIC', label: 'IA et Diagnostic' },
      { value: 'GENOMICS', label: 'Génomique' },
      { value: 'TARGETED_THERAPY', label: 'Thérapie Ciblée' }
    ],
    stage: [
      { value: '', label: 'Stade' },
      { value: 'BASIC_RESEARCH', label: 'Recherche Fondamentale' },
      { value: 'PRE_CLINICAL', label: 'Pré-clinique' },
      { value: 'CLINICAL_TRIALS_PHASE_1', label: 'Essais Cliniques Phase 1' },
      { value: 'CLINICAL_TRIALS_PHASE_2', label: 'Essais Cliniques Phase 2' }
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
      { value: 'EQUITY', label: 'Capital' }
    ],
    aiScore: [
      { value: '', label: 'Score IA' },
      { value: '90', label: '90%+' },
      { value: '80', label: '80%+' },
      { value: '70', label: '70%+' }
    ],
    location: [
      { value: '', label: 'Localisation' },
      { value: 'france', label: 'France' },
      { value: 'usa', label: 'États-Unis' },
      { value: 'europe', label: 'Europe' }
    ],
    innovationLevel: [
      { value: '', label: 'Innovation' },
      { value: 'BREAKTHROUGH', label: 'Révolutionnaire' },
      { value: 'PLATFORM', label: 'Plateforme' },
      { value: 'DISRUPTIVE', label: 'Disruptif' }
    ]
  };

  const sortOptions = [
    { value: 'score', label: 'Score IA' },
    { value: 'funding', label: 'Financement' },
    { value: 'date', label: 'Date' },
    { value: 'budget', label: 'Budget' }
  ];

  // Chargement des projets avec détection de source
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Tentative de chargement depuis Prisma...');
        
        // Essayer d'abord Prisma
        const response = await fetch('http://localhost:4000/api/projects-prisma');
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Réponse Prisma:', data);
        
        if (data.success) {
          if (data.data.length > 0) {
            // Données Prisma trouvées
            console.log(`✅ ${data.data.length} projets chargés depuis PRISMA`);
            setProjects(data.data);
            setFilteredProjects(data.data);
            setDataSource(data.source || 'PRISMA_DATABASE');
          } else {
            // Prisma vide, utiliser l'API normale
            console.log('⚠️ Prisma vide, utilisation API normale');
            await loadFromNormalAPI();
          }
        } else {
          throw new Error(data.message || 'Erreur serveur');
        }
      } catch (error) {
        console.error('❌ Erreur Prisma:', error);
        // Fallback vers l'API normale
        await loadFromNormalAPI();
      } finally {
        setLoading(false);
      }
    };

    const loadFromNormalAPI = async () => {
      try {
        console.log('🔄 Chargement depuis API normale...');
        const response = await fetch('http://localhost:4000/api/projects');
        const data = await response.json();
        
        if (data.success) {
          console.log(`✅ ${data.data.length} projets chargés depuis API normale`);
          const projectsWithSource = data.data.map(p => ({ ...p, source: 'STATIC_API' }));
          setProjects(projectsWithSource);
          setFilteredProjects(projectsWithSource);
          setDataSource('STATIC_API');
        } else {
          throw new Error('Impossible de charger les projets');
        }
      } catch (fallbackError) {
        console.error('❌ Erreur API normale:', fallbackError);
        setError('Impossible de charger les projets depuis aucune source.');
        setProjects([]);
        setFilteredProjects([]);
        setDataSource('ERREUR');
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

    // Appliquer les filtres
    Object.keys(filters).forEach(filterKey => {
      if (filters[filterKey] && filterKey !== 'searchQuery') {
        filtered = filtered.filter(project => {
          if (filterKey === 'budget') {
            const budget = project.budget || 0;
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
            return (project.score || 0) >= parseInt(filters.aiScore);
          }
          
          if (filterKey === 'duration') {
            const duration = project.duration || 0;
            switch (filters.duration) {
              case '0-12': return duration <= 12;
              case '12-24': return duration > 12 && duration <= 24;
              case '24-36': return duration > 24 && duration <= 36;
              case '36+': return duration > 36;
              default: return true;
            }
          }
          
          if (filterKey === 'location') {
            const location = project.location?.toLowerCase() || '';
            switch (filters.location) {
              case 'france': return location.includes('france') || location.includes('paris') || location.includes('lyon');
              case 'usa': return location.includes('usa') || location.includes('boston');
              case 'europe': return location.includes('france') || location.includes('paris') || location.includes('lyon') || location.includes('londres') || location.includes('zurich');
              default: return true;
            }
          }
          
          // Filtres directs
          return project[filterKey] === filters[filterKey];
        });
      }
    });

    // Trier les résultats
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return (b.score || 0) - (a.score || 0);
        case 'funding':
          return (b.funding || 0) - (a.funding || 0);
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'budget':
          return (b.budget || 0) - (a.budget || 0);
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  }, [filters, projects, sortBy]);

  const handleViewDetails = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleInvest = (projectId) => {
    navigate(`/invest/${projectId}`);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
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
  };

  const formatBudget = (budget) => {
    if (!budget) return 'N/A';
    if (budget >= 1000000) {
      return `${(budget / 1000000).toFixed(1)}M€`;
    }
    return `${(budget / 1000).toFixed(0)}K€`;
  };

  const getScoreColor = (score) => {
    if (!score) return '#6B7280';
    if (score >= 90) return '#059669';
    if (score >= 80) return '#2563EB';
    if (score >= 70) return '#D97706';
    return '#DC2626';
  };

  const formatEnumValue = (value, type) => {
    if (!value) return 'Non spécifié';
    const option = filterOptions[type]?.find(opt => opt.value === value);
    return option?.label || value;
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

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

  if (error) {
    return (
      <div className="projects-marketplace">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Erreur de connexion</h3>
          <p>{error}</p>
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
      {/* Bannière source des données */}
      <div style={{
        textAlign: 'center', 
        padding: '8px', 
        backgroundColor: dataSource === 'PRISMA_DATABASE' ? '#d1fae5' : '#fef3c7',
        border: `1px solid ${dataSource === 'PRISMA_DATABASE' ? '#a7f3d0' : '#fcd34d'}`,
        borderRadius: '6px',
        margin: '0 20px 20px 20px',
        fontSize: '14px',
        color: dataSource === 'PRISMA_DATABASE' ? '#065f46' : '#92400e',
        fontWeight: '500'
      }}>
        {dataSource === 'PRISMA_DATABASE' && '🗃️ Données en direct depuis la base de données'}
        {dataSource === 'STATIC_API' && '📋 Données statiques de démonstration'}
        {dataSource === 'ERREUR' && '❌ Impossible de charger les données'}
        {dataSource === 'Chargement...' && '⏳ Chargement...'}
      </div>

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
            
            {/* Bouton pour initialiser la base si vide */}
            {projects.length === 0 && dataSource === 'PRISMA_DATABASE' && (
              <button 
                className="btn-primary"
                onClick={async () => {
                  try {
                    setLoading(true);
                    const response = await fetch('http://localhost:4000/api/init/init-projects', {
                      method: 'POST'
                    });
                    const data = await response.json();
                    
                    if (data.success) {
                      alert(`✅ ${data.message}`);
                      // Recharger les projets
                      window.location.reload();
                    } else {
                      alert('❌ Erreur: ' + (data.error || 'Impossible de créer les projets'));
                    }
                  } catch (error) {
                    alert('❌ Erreur de connexion: ' + error.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                style={{ 
                  marginLeft: '10px', 
                  fontSize: '14px', 
                  padding: '8px 16px',
                  backgroundColor: '#059669'
                }}
              >
                {loading ? '⏳ Création...' : '🚀 Initialiser la Base'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Barre de recherche */}
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

        {/* Affichage des projets */}
        {filteredProjects.length > 0 && (
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
                  <p className="project-description">
                    {project.description?.substring(0, 150)}...
                  </p>
                  <div className="project-researcher">
                    <strong>Chercheur:</strong> {project.researcher}
                  </div>
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
                        {formatEnumValue(project.investmentType, 'investmentType')}
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
                    <span className="progress-text">{project.funding}% financé</span>
                  </div>
                </div>

                <div className="project-footer">
                  <div className="project-tags">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="tag">+{project.tags.length - 3}</span>
                    )}
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
                      onClick={() => handleInvest(project.id)}
                    >
                      Investir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message base vide */}
        {filteredProjects.length === 0 && projects.length === 0 && dataSource === 'PRISMA_DATABASE' && (
          <div className="no-results">
            <div className="no-results-content">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗃️</div>
              <h3>Base de données vide</h3>
              <p>Aucun projet n'a été trouvé dans la base de données.</p>
              <p>Cliquez sur "Initialiser la Base" pour créer des projets exemple.</p>
              <button 
                className="btn-primary"
                onClick={async () => {
                  try {
                    setLoading(true);
                    const response = await fetch('http://localhost:4000/api/init/init-projects', {
                      method: 'POST'
                    });
                    const data = await response.json();
                    
                    if (data.success) {
                      alert(`✅ ${data.message}`);
                      window.location.reload();
                    } else {
                      alert('❌ Erreur: ' + (data.error || 'Impossible de créer les projets'));
                    }
                  } catch (error) {
                    alert('❌ Erreur de connexion: ' + error.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                style={{ backgroundColor: '#059669', borderColor: '#059669' }}
              >
                {loading ? '⏳ Création en cours...' : '🚀 Initialiser la Base de Données'}
              </button>
            </div>
          </div>
        )}

        {/* Aucun résultat avec filtres */}
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
      </section>
    </div>
  );
};

export default ProjectsMarketplace;