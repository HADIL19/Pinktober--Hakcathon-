// src/components/MyInvestments.jsx
import React, { useState, useEffect } from 'react';
import './MyInvestments.css';
import InvestorNavbar from "../components/InvestorNavbar";


const MyInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyInvestments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/investments/my-investments');
      const result = await response.json();
      
      if (result.success) {
        setInvestments(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur chargement investissements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyInvestments();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'ACTIF': { class: 'status-active', label: 'ACTIF' },
      'EN ATTENTE': { class: 'status-pending', label: 'EN ATTENTE' },
      'TERMINÉ': { class: 'status-completed', label: 'TERMINÉ' },
      'ANNULÉ': { class: 'status-cancelled', label: 'ANNULÉ' }
    };
    
    const config = statusConfig[status] || { class: 'status-default', label: status };
    
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const getROIClass = (roi) => {
    if (roi === 'N/A') return 'roi-na';
    const value = parseFloat(roi);
    if (value > 0) return 'roi-positive';
    if (value < 0) return 'roi-negative';
    return 'roi-neutral';
  };

  if (loading) {
    return (
      <div className="investments-container">
        <div className="loading">Chargement de vos investissements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="investments-container">
        <div className="error-message">
          Erreur: {error}
          <button onClick={fetchMyInvestments} className="btn-retry">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="investments-container">
        
      <div className="investments-header">
        <h2>📊 Mes Investissements</h2>
        <div className="investments-stats">
          <div className="stat-card">
            <span className="stat-value">{investments.length}</span>
            <span className="stat-label">Projets</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {investments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}€
            </span>
            <span className="stat-label">Total investi</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {investments.filter(inv => inv.displayStatus === 'ACTIF').length}
            </span>
            <span className="stat-label">En cours</span>
          </div>
        </div>
      </div>

      <div className="investments-table-container">
        <table className="investments-table">
          <thead>
            <tr>
              <th>Projet</th>
              <th>Montant</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Retour</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((investment) => (
              <tr key={investment.id} className="investment-row">
                <td className="project-name">
                  <strong>{investment.project?.title || 'Projet inconnu'}</strong>
                  <div className="project-category">
                    {investment.project?.category}
                  </div>
                </td>
                <td className="investment-amount">
                  {investment.amount.toLocaleString()}€
                </td>
                <td className="investment-date">
                  {formatDate(investment.createdAt)}
                </td>
                <td className="investment-status">
                  {getStatusBadge(investment.displayStatus)}
                </td>
                <td className={`investment-roi ${getROIClass(investment.roi)}`}>
                  {investment.roi}
                </td>
                <td className="investment-actions">
                  <button 
                    className="btn-action"
                    onClick={() => {/* Voir détails */}}
                    title="Voir les détails"
                  >
                    👁️
                  </button>
                  <button 
                    className="btn-action"
                    onClick={() => {/* Contacter */}}
                    title="Contacter le chercheur"
                  >
                    📧
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {investments.length === 0 && (
          <div className="no-investments">
            <p>Vous n'avez pas encore effectué d'investissements.</p>
            <button className="btn-primary"  onClick={() => window.location.href = "/ProjectsMarketplace"}>
              Découvrir les projets
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInvestments;