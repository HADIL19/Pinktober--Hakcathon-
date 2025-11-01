// components/NewMessageModal.jsx
import { useState, useEffect } from 'react';
import "../styles/PorteurProjet.css";
export default function NewMessageModal({ onClose, onSend, initialReceiver = null, initialProject = null }) {
  const [formData, setFormData] = useState({
    receiver_id: initialReceiver?.id || '',
    project_id: initialProject?.id || '',
    subject: '',
    message: ''
  });
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchMyProjects();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users/investors', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    }
  };

  const fetchMyProjects = async () => {
    try {
      const res = await fetch('/api/projects/my-projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Erreur chargement projets:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSend(formData);
      onClose();
    } catch (error) {
      alert('Erreur lors de l\'envoi du message');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Nouveau Message</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="message-form">
          <div className="form-group">
            <label>Destinataire *</label>
            <select
              value={formData.receiver_id}
              onChange={(e) => setFormData({...formData, receiver_id: e.target.value})}
              required
            >
              <option value="">Sélectionnez un destinataire</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email}) - {user.role}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Projet (optionnel)</label>
            <select
              value={formData.project_id}
              onChange={(e) => setFormData({...formData, project_id: e.target.value})}
            >
              <option value="">Sélectionnez un projet</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Sujet *</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              required
              placeholder="Sujet de votre message"
            />
          </div>

          <div className="form-group">
            <label>Message *</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
              rows="8"
              placeholder="Tapez votre message ici..."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit">Envoyer le message</button>
          </div>
        </form>
      </div>
    </div>
  );
}