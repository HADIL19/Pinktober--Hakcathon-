import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { projectService } from '../services/projectService';

const AppContext = createContext();

// Actions
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_PROJECTS: 'SET_PROJECTS',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  SET_FAVORITES: 'SET_FAVORITES'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTION_TYPES.SET_PROJECTS:
      return { 
        ...state, 
        projects: action.payload.projects,
        filteredProjects: action.payload.projects,
        loading: false,
        error: null
      };
    
    case ACTION_TYPES.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case ACTION_TYPES.SET_PAGINATION:
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    
    case ACTION_TYPES.ADD_FAVORITE:
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
        projects: state.projects.map(project =>
          project.id === action.payload.projectId
            ? { ...project, isFavorite: true }
            : project
        )
      };
    
    case ACTION_TYPES.REMOVE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.filter(fav => fav.projectId !== action.payload),
        projects: state.projects.map(project =>
          project.id === action.payload
            ? { ...project, isFavorite: false }
            : project
        )
      };
    
    case ACTION_TYPES.SET_FAVORITES:
      return { ...state, favorites: action.payload };
    
    default:
      return state;
  }
};

// État initial
const initialState = {
  projects: [],
  filteredProjects: [],
  favorites: [],
  filters: {
    searchQuery: '',
    budget: '',
    domain: '',
    stage: '',
    duration: '',
    investmentType: '',
    aiScore: '',
    location: '',
    innovationLevel: ''
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasMore: false
  },
  loading: false,
  error: null
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Charger les favoris au démarrage
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favorites = await projectService.getFavorites();
      dispatch({ type: ACTION_TYPES.SET_FAVORITES, payload: favorites });
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const loadProjects = async (filters = state.filters, page = 1) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    
    try {
      const result = await projectService.getFilteredProjects(filters, page);
      
      // Marquer les projets favoris
      const projectsWithFavorites = result.projects.map(project => ({
        ...project,
        isFavorite: state.favorites.some(fav => fav.projectId === project.id)
      }));
      
      dispatch({ 
        type: ACTION_TYPES.SET_PROJECTS, 
        payload: { projects: projectsWithFavorites } 
      });
      
      dispatch({
        type: ACTION_TYPES.SET_PAGINATION,
        payload: {
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          totalCount: result.totalCount,
          hasMore: result.hasMore
        }
      });
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
    }
  };

  const updateFilters = (newFilters) => {
    dispatch({ type: ACTION_TYPES.SET_FILTERS, payload: newFilters });
    loadProjects({ ...state.filters, ...newFilters }, 1);
  };

  const toggleFavorite = async (projectId) => {
    try {
      const isNowFavorite = await projectService.toggleFavorite(projectId);
      
      if (isNowFavorite) {
        dispatch({ type: ACTION_TYPES.ADD_FAVORITE, payload: { projectId } });
      } else {
        dispatch({ type: ACTION_TYPES.REMOVE_FAVORITE, payload: projectId });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  const value = {
    ...state,
    loadProjects,
    updateFilters,
    toggleFavorite,
    loadFavorites,
    resetFilters: () => updateFilters(initialState.filters)
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};