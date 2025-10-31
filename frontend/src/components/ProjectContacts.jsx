import React, { useState } from 'react';
import './ProjectContacts.css';
import MessageInbox from './MessageInbox';
import InvestorNavbar from './InvestorNavbar'

const ProjectContacts = () => {
  const [activeTab, setActiveTab] = useState('contacts'); // 'contacts' ou 'dashboard'
  const [selectedProject, setSelectedProject] = useState(null);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');

  const [investedProjects, setInvestedProjects] = useState([
    {
      id: 1,
      projectName: "Immuno-Thérapie CAR-T Personnalisée",
      researcher: "Dr. Marie Lambert",
      institution: "Institut Curie",
      email: "marie.lambert@institut-curie.fr",
      phone: "+33 1 44 32 45 67",
      status: "Actif",
      investmentAmount: 75000,
      lastContact: "2024-01-20",
      nextMeeting: "2024-02-15",
      notes: "Progression excellente sur les essais pré-cliniques. Réunion de suivi programmée.",
      // Données d'avancement
      progress: {
        overall: 65,
        timeline: 70,
        budget: 80,
        milestones: 60
      },
      milestones: [
        { name: "Recherche fondamentale", completed: true, date: "2023-09-15" },
        { name: "Essais pré-cliniques", completed: true, date: "2024-01-10" },
        { name: "Recrutement patients", completed: false, date: "2024-03-01" },
        { name: "Essais cliniques Phase I", completed: false, date: "2024-06-15" },
        { name: "Approval réglementaire", completed: false, date: "2024-12-01" }
      ],
      financials: {
        totalBudget: 2100000,
        spent: 1365000,
        remaining: 735000,
        burnRate: 125000 // par mois
      },
      kpis: [
        { name: "Taux de réponse", value: "85%", target: "80%", status: "exceeded" },
        { name: "Effets secondaires", value: "12%", target: "15%", status: "good" },
        { name: "Délai recrutement", value: "4 mois", target: "3 mois", status: "warning" }
      ]
    },
    {
      id: 2,
      projectName: "IA de Diagnostic Précoce par Imagerie 3D",
      researcher: "Dr. Sophie Martin",
      institution: "MIT Medical",
      email: "sophie.martin@mit.edu",
      phone: "+1 617 253 1000",
      status: "En attente",
      investmentAmount: 50000,
      lastContact: "2024-01-12",
      nextMeeting: "En attente de confirmation",
      notes: "En attente d'approbation réglementaire FDA. Suivi dans 2 semaines.",
      progress: {
        overall: 30,
        timeline: 25,
        budget: 95,
        milestones: 20
      },
      milestones: [
        { name: "Développement algorithme", completed: true, date: "2023-11-20" },
        { name: "Validation technique", completed: true, date: "2024-01-05" },
        { name: "Soumission FDA", completed: false, date: "2024-02-28" },
        { name: "Essais multicentriques", completed: false, date: "2024-05-15" }
      ],
      financials: {
        totalBudget: 1800000,
        spent: 540000,
        remaining: 1260000,
        burnRate: 90000
      },
      kpis: [
        { name: "Précision diagnostic", value: "92%", target: "90%", status: "exceeded" },
        { name: "Faux positifs", value: "5%", target: "8%", status: "good" },
        { name: "Temps traitement", value: "45s", target: "30s", status: "warning" }
      ]
    }
  ]);

  const handleContact = (project) => {
    setSelectedProject(project);
    setSubject(`Suivi investissement - ${project.projectName}`);
    setMessage(`Bonjour Dr. ${project.researcher.split('Dr. ')[1]},\n\n`);
  };

  const sendMessage = async () => {
  if (!selectedProject || !message.trim()) return;
  
  try {
    const response = await fetch('http://localhost:4000/api/messages/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Uncomment when you have auth
      },
      body: JSON.stringify({
        receiverId: 2, // You need to get the actual researcher ID from your data
        content: message,
        subject: subject,
        projectId: selectedProject.id
      })
    });

    const result = await response.json();
    
    if (result.success) {
      alert(`Message envoyé à Dr. ${selectedProject.researcher.split('Dr. ')[1]} !`);
      setSelectedProject(null);
      setMessage('');
      setSubject('');
    } else {
      alert('Erreur lors de l\'envoi du message: ' + result.error);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    alert('Erreur de connexion au serveur');
  }
};

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
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

  const DashboardView = ({ project }) => (
    <div className="dashboard-view">
      <div className="dashboard-header">
        <h3>Dashboard - {project.projectName}</h3>
        <p>Suivi détaillé de l'avancement du projet</p>
      </div>

      {/* Métriques principales */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h4>Avancement Global</h4>
          <ProgressBar percentage={project.progress.overall} color="#3b82f6" />
        </div>
        <div className="metric-card">
          <h4>Timeline</h4>
          <ProgressBar percentage={project.progress.timeline} color="#10b981" />
        </div>
        <div className="metric-card">
          <h4>Budget Utilisé</h4>
          <ProgressBar percentage={project.progress.budget} color="#f59e0b" />
        </div>
        <div className="metric-card">
          <h4>Jalons</h4>
          <ProgressBar percentage={project.progress.milestones} color="#ef4444" />
        </div>
      </div>

      {/* Jalons */}
      <div className="milestones-section">
        <h4>Jalons du Projet</h4>
        <div className="milestones-list">
          {project.milestones.map((milestone, index) => (
            <div key={index} className={`milestone-item ${milestone.completed ? 'completed' : 'pending'}`}>
              <div className="milestone-status">
                <div className={`status-dot ${milestone.completed ? 'completed' : 'pending'}`} />
              </div>
              <div className="milestone-info">
                <span className="milestone-name">{milestone.name}</span>
                <span className="milestone-date">{formatDate(milestone.date)}</span>
              </div>
              {milestone.completed && (
                <span className="milestone-badge">✓ Terminé</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Indicateurs de performance */}
      <div className="kpis-section">
        <h4>Indicateurs Clés</h4>
        <div className="kpis-grid">
          {project.kpis.map((kpi, index) => (
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

      {/* Informations financières */}
      <div className="financials-section">
        <h4>Informations Financières</h4>
        <div className="financials-grid">
          <div className="financial-item">
            <span>Budget total:</span>
            <strong>{project.financials.totalBudget.toLocaleString()}€</strong>
          </div>
          <div className="financial-item">
            <span>Dépensé:</span>
            <strong>{project.financials.spent.toLocaleString()}€</strong>
          </div>
          <div className="financial-item">
            <span>Reste:</span>
            <strong>{project.financials.remaining.toLocaleString()}€</strong>
          </div>
          <div className="financial-item">
            <span>Taux de consommation:</span>
            <strong>{project.financials.burnRate.toLocaleString()}€/mois</strong>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="project-contacts">
      <div className="contacts-header">
        <InvestorNavbar/>
        <h1>Mes Projets Investis</h1>
        <p>Suivez vos investissements et communiquez avec les chercheurs</p>
      </div>

      {/* Navigation par onglets */}
      <div className="tabs-navigation">
        <button 
          className={`tab-button ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          📞 Contacts
        </button>
        <button 
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
      </div>

      <div className="contacts-content">
        {/* Liste des projets */}
        <div className="projects-list">
          <div className="projects-grid">
            {investedProjects.map(project => (
              <div key={project.id} className="project-contact-card">
                <div className="project-header">
                  <h3>{project.projectName}</h3>
                  <span className={`status ${project.status.toLowerCase().replace(' ', '-')}`}>
                    {project.status}
                  </span>
                </div>
                
                <div className="contact-info">
                  <div className="contact-item">
                    <strong>Chercheur:</strong>
                    <span>{project.researcher}</span>
                  </div>
                  <div className="contact-item">
                    <strong>Institution:</strong>
                    <span>{project.institution}</span>
                  </div>
                  <div className="contact-item">
                    <strong>Montant investi:</strong>
                    <span className="amount">{project.investmentAmount.toLocaleString()}€</span>
                  </div>
                  <div className="contact-item">
                    <strong>Avancement:</strong>
                    <span className="progress-indicator">
                      {project.progress.overall}% complet
                    </span>
                  </div>
                </div>

                <div className="contact-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => handleContact(project)}
                  >
                    📧 Contacter
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setSelectedProject(project);
                      setActiveTab('dashboard');
                    }}
                  >
                    📊 Voir avancement
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel latéral */}
        {selectedProject && (
          <div className="contact-panel">
            <div className="panel-header">
              <h3>
                {activeTab === 'contacts' ? `Contacter ${selectedProject.researcher}` : `Dashboard - ${selectedProject.projectName}`}
              </h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedProject(null)}
              >
                ×
              </button>
            </div>

            {activeTab === 'contacts' ? (
              <div className="contact-form">
                <div className="form-group">
                  <label>Sujet</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Sujet du message"
                  />
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Votre message au chercheur..."
                    rows="8"
                  />
                </div>

                <div className="form-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => setSelectedProject(null)}
                  >
                    Annuler
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={sendMessage} // ✅ Change this from handleContact to sendMessage
                    disabled={!message.trim()}
                    >
                    Envoyer le message
                  </button>
                </div>
              </div>
            ) : (
              <DashboardView project={selectedProject} />
            )}
          </div>
        )}
      </div>
      <MessageInbox/>
    </div>
  );
};

export default ProjectContacts;