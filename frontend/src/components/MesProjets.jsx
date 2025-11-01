// components/MesProjets.jsx
import "../styles/PorteurProjet.css";
export default function MesProjets({ projects, onAddProject, onRefresh }) {
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
  const fundedProjects = projects.filter(p => p.status === 'FUNDED').length;

  return (
    <div className="mes-projets">
      <div className="projects-header">
        <div className="stats">
          <div className="stat-card">
            <h3>Total: {totalProjects}</h3>
            <p>Projets</p>
          </div>
          <div className="stat-card">
            <h3>Actifs: {activeProjects}</h3>
            <p>En cours</p>
          </div>
          <div className="stat-card">
            <h3>Financés: {fundedProjects}</h3>
            <p>Complétés</p>
          </div>
        </div>
        
        <button className="add-project-btn" onClick={onAddProject}>
          + Ajouter un Projet
        </button>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <h3>{project.title}</h3>
              <span className={`status-badge ${project.status?.toLowerCase()}`}>
                {project.status}
              </span>
            </div>
            
            <p className="project-description">{project.description}</p>
            
            <div className="project-details">
              <div className="detail">
                <strong>Budget:</strong> {project.budget} €
              </div>
              <div className="detail">
                <strong>Financement:</strong> {project.funding}%
              </div>
              <div className="detail">
                <strong>Domaine:</strong> {project.domain}
              </div>
              <div className="detail">
                <strong>Stade:</strong> {project.stage}
              </div>
            </div>

            <div className="project-actions">
              <button className="edit-btn">Modifier</button>
              <button className="view-btn">Voir Détails</button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="empty-state">
          <h3>Aucun projet créé</h3>
          <p>Commencez par créer votre premier projet de recherche</p>
          <button className="add-project-btn" onClick={onAddProject}>
            Créer un Projet
          </button>
        </div>
      )}
    </div>
  );
}