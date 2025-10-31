import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProjectDetails.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/projects/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setProject(data.data);
        } else {
          console.error('Projet non trouvé');
          navigate('/ProjectsMarketplace');
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  if (loading) return <div className="loading">Chargement...</div>;
  if (!project) return <div className="error">Projet non trouvé</div>;

  return (
    <div className="project-details">
      <button className="back-btn" onClick={() => navigate('/ProjectsMarketplace')}>
        ← Retour à la marketplace
      </button>

      <div className="project-header">
        <h1>{project.title}</h1>
        <div className="project-meta">
          <span className="institution">{project.institution}</span>
          <span className="researcher">Par {project.researcher}</span>
        </div>
      </div>

      <div className="project-content">
        <div className="main-info">
          <div className="description">
            <h2>Description</h2>
            <p>{project.description}</p>
          </div>

          <div className="details-grid">
            <div className="detail-card">
              <h3>📊 Score IA</h3>
              <span className="score">{project.score}%</span>
            </div>
            <div className="detail-card">
              <h3>💰 Budget</h3>
              <span className="budget">
                {project.budget >= 1000000 
                  ? `${(project.budget / 1000000).toFixed(1)}M€` 
                  : `${(project.budget / 1000).toFixed(0)}K€`}
              </span>
            </div>
            <div className="detail-card">
              <h3>⏱️ Durée</h3>
              <span className="duration">{project.duration} mois</span>
            </div>
            <div className="detail-card">
              <h3>🎯 Financement</h3>
              <div className="funding">
                <span>{project.funding}%</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${project.funding}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="action-card">
            <h3>Investir dans ce projet</h3>
            <p>Rejoignez les investisseurs qui soutiennent cette innovation</p>
            <button 
              className="invest-btn"
              onClick={() => navigate(`/invest/${project.id}`)}
            >
              Investir maintenant
            </button>
          </div>

          <div className="info-card">
            <h4>📋 Informations</h4>
            <ul>
              <li><strong>Domaine:</strong> {project.domain}</li>
              <li><strong>Stade:</strong> {project.stage}</li>
              <li><strong>Type:</strong> {project.investmentType}</li>
              <li><strong>Innovation:</strong> {project.innovationLevel}</li>
              <li><strong>Localisation:</strong> {project.location}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;