// components/ProjectFormModal.jsx
import { useState } from 'react';
import "../styles/PorteurProjet.css";
export default function ProjectFormModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    duration: 24,
    domain: '',
    stage: '',
    investmentType: '',
    location: '',
    innovationLevel: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 👇 CHANGEZ CETTE LIGNE - ajoutez http://localhost:5000
      const res = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('Projet créé avec succès!');
        onSuccess();
      }
    } catch (error) {
      alert('Erreur lors de la création du projet');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large-modal">
        <h2>Créer un Nouveau Projet</h2>
        
        <form onSubmit={handleSubmit} className="project-form">
          {/* Le reste du formulaire reste identique */}
          <div className="form-row">
            <div className="form-group">
              <label>Titre du Projet *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                placeholder="Ex: Immuno-Thérapie CAR-T Personnalisée"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              placeholder="Décrivez votre projet de recherche..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Budget (€) *</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                required
                placeholder="50000"
              />
            </div>

            <div className="form-group">
              <label>Durée (mois)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="24"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Domaine de Recherche *</label>
              <select
                value={formData.domain}
                onChange={(e) => setFormData({...formData, domain: e.target.value})}
                required
              >
                <option value="">Sélectionnez un domaine</option>
                <option value="IMMUNOTHERAPY">Immunothérapie</option>
                <option value="EARLY_DETECTION">Détection Précoce</option>
                <option value="TARGETED_THERAPY">Thérapie Ciblée</option>
                <option value="GENOMICS">Génomique</option>
                <option value="AI_DIAGNOSTIC">IA Diagnostic</option>
              </select>
            </div>

            <div className="form-group">
              <label>Stade du Projet *</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({...formData, stage: e.target.value})}
                required
              >
                <option value="">Sélectionnez un stade</option>
                <option value="BASIC_RESEARCH">Recherche Fondamentale</option>
                <option value="PRE_CLINICAL">Pré-clinique</option>
                <option value="CLINICAL_TRIALS_PHASE_1">Essais Clinique Phase 1</option>
                <option value="CLINICAL_TRIALS_PHASE_2">Essais Clinique Phase 2</option>
                <option value="CLINICAL_TRIALS_PHASE_3">Essais Clinique Phase 3</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit">Créer le Projet</button>
          </div>
        </form>
      </div>
    </div>
  );
}