// src/components/MyInvestments.jsx
import React, { useState, useEffect } from 'react';
import './MyInvestments.css';
import InvestorNavbar from "./InvestorNavbar";

const MyInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedResearcher, setSelectedResearcher] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [messageSubject, setMessageSubject] = useState('');

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

  const fetchDashboardData = async (investmentId) => {
    try {
      setDashboardLoading(true);
      const response = await fetch(`http://localhost:4000/api/investments/${investmentId}/dashboard`);
      const result = await response.json();
      
      if (result.success) {
        setDashboardData(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
      alert('Erreur lors du chargement du dashboard');
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleViewDashboard = (investment) => {
    setSelectedProject(investment);
    fetchDashboardData(investment.id);
  };

  // Fonction pour ouvrir le modal de message
  const handleSendMessage = (investment) => {
    setSelectedResearcher({
      id: investment.project?.researcherId,
      name: investment.project?.researcher,
      institution: investment.project?.institution,
      projectName: investment.project?.title,
      investmentId: investment.id
    });
    setMessageSubject(`Suivi investissement - ${investment.project?.title}`);
    setMessageContent(`Bonjour ${investment.project?.researcher?.split('Dr. ')[1] || investment.project?.researcher},\n\nJe souhaite avoir des nouvelles concernant mon investissement dans votre projet.\n\n`);
    setShowMessageModal(true);
  };

  // Fonction pour envoyer le message
  const sendMessage = async () => {
    if (!selectedResearcher || !messageContent.trim()) return;
    
    try {
      const response = await fetch('http://localhost:4000/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: selectedResearcher.id,
          content: messageContent,
          subject: messageSubject,
          projectId: selectedResearcher.investmentId,
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Message envoyé à ${selectedResearcher.name} !`);
        setShowMessageModal(false);
        setSelectedResearcher(null);
        setMessageContent('');
        setMessageSubject('');
        
        // Déclencher le rafraîchissement des messages
        window.dispatchEvent(new Event('refreshMessages'));
      } else {
        alert('❌ Erreur lors de l\'envoi du message: ' + result.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Erreur de connexion au serveur');
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

  const ProgressBar = ({ percentage, color }) => (
    <div className="progress-bar-container">
      <div 
        className="progress-bar-fill"
        style={{ 
          width: `${percentage}%`,
          backgroundColor: color
        }}
      />
      <span className="progress-text">{percentage}%</span>
    </div>
  );

  const DashboardView = () => {
    if (dashboardLoading) {
      return <div className="loading">Chargement du dashboard...</div>;
    }

    if (!dashboardData) {
      return <div className="error-message">Aucune donnée disponible</div>;
    }

    const { project, progress, milestones, financials, kpis, researcher } = dashboardData;

    return (
      <div className="dashboard-view">
        <div className="dashboard-header">
          <h3>Dashboard - {project.title}</h3>
          <p>Domaine: {project.domain} | Statut: {project.status}</p>
          <p>Chercheur: {researcher.name} | Investissement: {dashboardData.investment.amount.toLocaleString()}€</p>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <h4>Avancement Global</h4>
            <ProgressBar percentage={progress.overall} color="#3b82f6" />
          </div>
          <div className="metric-card">
            <h4>Timeline</h4>
            <ProgressBar percentage={progress.timeline} color="#10b981" />
          </div>
          <div className="metric-card">
            <h4>Budget Utilisé</h4>
            <ProgressBar percentage={progress.budget} color="#f59e0b" />
          </div>
          <div className="metric-card">
            <h4>Jalons</h4>
            <ProgressBar percentage={progress.milestones} color="#ef4444" />
          </div>
        </div>

        <div className="milestones-section">
          <h4>Jalons du Projet</h4>
          <div className="milestones-list">
            {milestones.map((milestone, index) => (
              <div key={index} className={`milestone-item ${milestone.completed ? 'completed' : 'pending'}`}>
                <div className="milestone-status">
                  <div className={`status-dot ${milestone.completed ? 'completed' : 'pending'}`} />
                </div>
                <div className="milestone-info">
                  <span className="milestone-name">{milestone.name}</span>
                  <span className="milestone-date">{formatDate(milestone.date)}</span>
                </div>
                {milestone.completed && <span className="milestone-badge">✓ Terminé</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="kpis-section">
          <h4>Indicateurs de Performance</h4>
          <div className="kpis-grid">
            {kpis.map((kpi, index) => (
              <div key={index} className={`kpi-card ${kpi.status}`}>
                <div className="kpi-header">
                  <span className="kpi-name">{kpi.name}</span>
                  <span className="kpi-value">{kpi.value}</span>
                </div>
                <div className="kpi-target">
                  Objectif: {kpi.target}
                </div>
                <div className={`kpi-status ${kpi.status}`}>
                  {kpi.status === 'exceeded' && '🎯 Objectif dépassé'}
                  {kpi.status === 'good' && '✅ Dans les objectifs'}
                  {kpi.status === 'warning' && '⚠️ Attention requise'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="financials-section">
          <h4>Informations Financières</h4>
          <div className="financials-grid">
            <div className="financial-item">
              <span>Budget total:</span>
              <strong>{financials.totalBudget.toLocaleString()}€</strong>
            </div>
            <div className="financial-item">
              <span>Dépensé:</span>
              <strong>{financials.spent.toLocaleString()}€</strong>
            </div>
            <div className="financial-item">
              <span>Reste:</span>
              <strong>{financials.remaining.toLocaleString()}€</strong>
            </div>
            <div className="financial-item">
              <span>Financement acquis:</span>
              <strong>{financials.fundingProgress}%</strong>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="investments-container">
        <InvestorNavbar/>
        <div className="loading">Chargement de vos investissements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="investments-container">
        <InvestorNavbar/>
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
      <InvestorNavbar/>
      
      <div className="investments-header">
        <h2>📊 Mes Investissements & Dashboard</h2>
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

      <div className="investments-layout">
        {/* Liste des investissements */}
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
                <th>Message</th> {/* Nouvelle colonne */}
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
                    <div className="project-researcher">
                      {investment.project?.researcher}
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
                      onClick={() => handleViewDashboard(investment)}
                      title="Voir le dashboard"
                    >
                      📊
                    </button>
                  </td>
                  <td className="investment-message">
                    <button 
                      className="btn-message"
                      onClick={() => handleSendMessage(investment)}
                      title={`Envoyer un message à ${investment.project?.researcher}`}
                    >
                      ✉️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {investments.length === 0 && (
            <div className="no-investments">
              <p>Vous n'avez pas encore effectué d'investissements.</p>
              <button className="btn-primary" onClick={() => window.location.href = "/ProjectsMarketplace"}>
                Découvrir les projets
              </button>
            </div>
          )}
        </div>

        {/* Panel du dashboard */}
        {selectedProject && (
          <div className="dashboard-panel">
            <div className="panel-header">
              <h3>Dashboard</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedProject(null)}
              >
                ×
              </button>
            </div>
            <DashboardView project={selectedProject} />
          </div>
        )}
      </div>

      {/* Modal d'envoi de message */}
      {showMessageModal && selectedResearcher && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Envoyer un message</h3>
              <button 
                className="close-btn"
                onClick={() => setShowMessageModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="message-recipient">
                <strong>À:</strong> {selectedResearcher.name}
                <br />
                <strong>Projet:</strong> {selectedResearcher.projectName}
                <br />
                <strong>Institution:</strong> {selectedResearcher.institution}
              </div>

              <div className="form-group">
                <label>Sujet</label>
                <input
                  type="text"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows="6"
                  className="form-textarea"
                  placeholder="Votre message au chercheur..."
                />
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowMessageModal(false)}
              >
                Annuler
              </button>
              <button 
                className="btn-primary"
                onClick={sendMessage}
                disabled={!messageContent.trim()}
              >
                Envoyer le message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInvestments;