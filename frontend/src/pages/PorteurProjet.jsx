// pages/PorteurProjet.jsx
import MesProjets from "../components/MesProjets";
import Messagerie from "../components/Messagerie";
import MonProfil from "../components/MonProfil";
import ProjectFormModal from "../components/ProjectFormModal";
import "../styles/PorteurProjet.css";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PorteurProjet() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);

  useEffect(() => {
    if (activeTab === 'projects') {
      fetchMyProjects();
    } else if (activeTab === 'messages') {
      fetchMessages();
    }
  }, [activeTab]);

  const fetchMyProjects = async () => {
    try {
      // 👇 CHANGEZ CETTE LIGNE - ajoutez http://localhost:5000
      const res = await fetch('http://localhost:5000/api/projects/my-projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) {
        setProjects([]);
        return;
      }
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      setProjects([]);
      console.error('Erreur chargement projets:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      // 👇 CHANGEZ CETTE LIGNE - ajoutez http://localhost:5000
      const res = await fetch('http://localhost:5000/api/messages/received', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    }
  };

  return (
    <div className="porteur-page">
      {/* Header du profil */}
      <div className="profile-header">
        <h1>Espace Porteur de Projet</h1>
        <p>Gérez vos projets et vos messages</p>
      </div>

      {/* Navigation par onglets */}
      <div className="tabs-navigation">
        <button 
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Mes Projets
        </button>
        <button 
          className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          Messagerie
        </button>
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Mon Profil
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className="tab-content">
        {activeTab === 'projects' && (
          <MesProjets 
            projects={projects} 
            onAddProject={() => setShowProjectForm(true)}
            onRefresh={fetchMyProjects}
          />
        )}

        {activeTab === 'messages' && (
          <Messagerie messages={messages} onRefresh={fetchMessages} />
        )}

        {activeTab === 'profile' && (
          <MonProfil />
        )}
      </div>

      {/* Modal d'ajout de projet */}
      {showProjectForm && (
        <ProjectFormModal 
          onClose={() => setShowProjectForm(false)}
          onSuccess={() => {
            setShowProjectForm(false);
            fetchMyProjects();
          }}
        />
      )}
    </div>
  );
}