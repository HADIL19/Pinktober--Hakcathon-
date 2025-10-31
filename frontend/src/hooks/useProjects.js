import { useState, useEffect, useCallback } from 'react';
import { projectService } from '../services/projectService';

export const useProjects = (initialFilters = {}) => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasMore: false
  });

  // Charger les projets
  const loadProjects = useCallback(async (newFilters = filters, page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await projectService.getFilteredProjects(newFilters, {
        page,
        limit: 12
      });
      
      setProjects(result.projects);
      setFilteredProjects(result.projects); // Pour compatibilité
      setPagination({
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
        hasMore: result.hasMore
      });
    } catch (err) {
      setError(err.message);
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Chargement initial
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Mettre à jour les filtres
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    loadProjects({ ...filters, ...newFilters }, 1);
  }, [filters, loadProjects]);

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    const defaultFilters = {
      searchQuery: '',
      budget: '',
      domain: '',
      stage: '',
      duration: '',
      investmentType: '',
      aiScore: '',
      location: '',
      innovationLevel: ''
    };
    setFilters(defaultFilters);
    loadProjects(defaultFilters, 1);
  }, [loadProjects]);

  // Charger la page suivante
  const loadNextPage = useCallback(() => {
    if (pagination.hasMore && !loading) {
      loadProjects(filters, pagination.currentPage + 1);
    }
  }, [filters, loadProjects, pagination, loading]);

  // Charger la page précédente
  const loadPrevPage = useCallback(() => {
    if (pagination.currentPage > 1 && !loading) {
      loadProjects(filters, pagination.currentPage - 1);
    }
  }, [filters, loadProjects, pagination, loading]);

  // Recherche en temps réel avec debounce
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (searchTerm) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          updateFilters({ searchQuery: searchTerm });
        }, 300);
      };
    })(),
    [updateFilters]
  );

  return {
    projects: filteredProjects,
    allProjects: projects,
    filters,
    loading,
    error,
    pagination,
    updateFilters,
    resetFilters,
    loadNextPage,
    loadPrevPage,
    debouncedSearch,
    refreshProjects: () => loadProjects(filters, pagination.currentPage)
  };
};