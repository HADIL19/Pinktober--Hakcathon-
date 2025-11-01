// src/components/ProjectContacts.jsx
import React, { useState, useEffect } from 'react';
import './ProjectContacts.css';
import MessageInbox from './MessageInbox';
import InvestorNavbar from './InvestorNavbar';

const ProjectContacts = () => {
  const [selectedResearcher, setSelectedResearcher] = useState(null);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les contacts depuis les messages et investissements
  const fetchContacts = async () => {
    try {
      setLoading(true);
      
      // Récupérer les messages pour avoir tous les contacts
      const messagesResponse = await fetch('http://localhost:4000/api/messages/my-messages');
      const messagesResult = await messagesResponse.json();
      
      // Récupérer les investissements pour avoir les chercheurs
      const investmentsResponse = await fetch('http://localhost:4000/api/investments/my-investments');
      const investmentsResult = await investmentsResponse.json();

      const contactsMap = new Map();

      // Ajouter les contacts depuis les messages
      if (messagesResult.success && messagesResult.data) {
        const allMessages = [
          ...(messagesResult.data.sent || []),
          ...(messagesResult.data.received || [])
        ];

        allMessages.forEach(message => {
          // Pour les messages envoyés, le contact est le receiver
          if (message.senderId === 1) { // Vous êtes l'expéditeur
            const contactId = message.receiverId;
            if (!contactsMap.has(contactId)) {
              contactsMap.set(contactId, {
                id: contactId,
                name: message.receiver?.name || 'Chercheur',
                institution: message.receiver?.company || 'Institution inconnue',
                lastMessage: message.content,
                lastContact: message.createdAt,
                messageCount: 1,
                isFromInvestment: false
              });
            }
          }
          // Pour les messages reçus, le contact est le sender
          else if (message.receiverId === 1) { // Vous êtes le destinataire
            const contactId = message.senderId;
            if (!contactsMap.has(contactId)) {
              contactsMap.set(contactId, {
                id: contactId,
                name: message.sender?.name || 'Chercheur',
                institution: message.sender?.company || 'Institution inconnue',
                lastMessage: message.content,
                lastContact: message.createdAt,
                messageCount: 1,
                isFromInvestment: false
              });
            }
          }
        });
      }

      // Ajouter les chercheurs depuis les investissements (sans doublons)
      if (investmentsResult.success && investmentsResult.data) {
        investmentsResult.data.forEach(investment => {
          if (investment.project && investment.project.researcherId) {
            const researcherId = investment.project.researcherId;
            if (!contactsMap.has(researcherId)) {
              contactsMap.set(researcherId, {
                id: researcherId,
                name: investment.project.researcher,
                institution: investment.project.institution,
                projectName: investment.project.title,
                investmentAmount: investment.amount,
                lastContact: investment.lastContact || 'Jamais',
                messageCount: 0,
                isFromInvestment: true
              });
            }
          }
        });
      }

      // Convertir la Map en tableau et trier par dernière interaction
      const contactsArray = Array.from(contactsMap.values()).sort((a, b) => 
        new Date(b.lastContact) - new Date(a.lastContact)
      );

      setContacts(contactsArray);
      
    } catch (error) {
      console.error('Erreur chargement contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleContact = (contact) => {
    setSelectedResearcher(contact);
    setSubject(contact.isFromInvestment ? 
      `Suivi investissement - ${contact.projectName}` : 
      `Message pour ${contact.name}`
    );
    setMessage(`Bonjour ${contact.name},\n\n`);
  };

  const sendMessage = async () => {
    if (!selectedResearcher || !message.trim()) return;
    
    try {
      const response = await fetch('http://localhost:4000/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: selectedResearcher.id,
          content: message,
          subject: subject,
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Message envoyé à ${selectedResearcher.name} !`);
        setSelectedResearcher(null);
        setMessage('');
        setSubject('');
        
        // Recharger les contacts pour mettre à jour les dernières interactions
        fetchContacts();
        
        window.dispatchEvent(new Event('refreshMessages'));
      } else {
        alert('❌ Erreur lors de l\'envoi du message: ' + result.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Erreur de connexion au serveur');
    }
  };

  const formatLastContact = (dateString) => {
    if (dateString === 'Jamais') return 'Jamais';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="project-contacts">
        <InvestorNavbar/>
        <div className="loading">Chargement de vos contacts...</div>
      </div>
    );
  }

  return (
    <div className="project-contacts">
      <div className="contacts-header">
        <InvestorNavbar/>
        <h1>📨 Messagerie</h1>
        <p>Communiquez avec les chercheurs de vos projets investis</p>
      </div>

      <div className="contacts-content">
        {/* Liste unique des contacts */}
        <div className="contacts-list">
          <div className="contacts-header-section">
            <h2>Contacts ({contacts.length})</h2>
            <div className="contacts-stats">
              <span>{contacts.filter(c => c.messageCount > 0).length} avec historique</span>
              <span>{contacts.filter(c => c.isFromInvestment).length} de vos investissements</span>
            </div>
          </div>
          
          <div className="contacts-grid">
            {contacts.map(contact => (
              <div key={contact.id} className="contact-card">
                <div className="contact-avatar">
                  {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                
                <div className="contact-info">
                  <div className="contact-main">
                    <h3>{contact.name}</h3>
                    <span className="contact-badge">
                      {contact.isFromInvestment ? '💰 Investissement' : '💬 Message'}
                    </span>
                  </div>
                  
                  <p className="institution">{contact.institution}</p>
                  
                  {contact.projectName && (
                    <p className="project">Projet: {contact.projectName}</p>
                  )}
                  
                  {contact.lastMessage && (
                    <p className="last-message">
                      {contact.lastMessage.length > 60 
                        ? contact.lastMessage.substring(0, 60) + '...' 
                        : contact.lastMessage
                      }
                    </p>
                  )}
                  
                  <div className="contact-meta">
                    <span className="last-contact">
                      Dernier contact: {formatLastContact(contact.lastContact)}
                    </span>
                    {contact.messageCount > 0 && (
                      <span className="message-count">
                        {contact.messageCount} message{contact.messageCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="contact-action">
                  <button 
                    className="btn-message"
                    onClick={() => handleContact(contact)}
                    title={`Envoyer un message à ${contact.name}`}
                  >
                    ✉️ Message
                  </button>
                </div>
              </div>
            ))}
          </div>

          {contacts.length === 0 && (
            <div className="no-contacts">
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <h3>Aucun contact</h3>
                <p>Vous n'avez pas encore de contacts.</p>
                <p>Investissez dans des projets ou envoyez des messages pour commencer.</p>
                <button 
                  className="btn-primary" 
                  onClick={() => window.location.href = "/ProjectsMarketplace"}
                >
                  Découvrir les projets
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Panel latéral pour écrire un message */}
        {selectedResearcher && (
          <div className="contact-panel">
            <div className="panel-header">
              <h3>Nouveau message</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedResearcher(null)}
              >
                ×
              </button>
            </div>

            <div className="contact-info-preview">
              <div className="preview-avatar">
                {selectedResearcher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="preview-info">
                <h4>{selectedResearcher.name}</h4>
                <p>{selectedResearcher.institution}</p>
                {selectedResearcher.projectName && (
                  <p className="project-preview">Projet: {selectedResearcher.projectName}</p>
                )}
              </div>
            </div>

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
                  placeholder={`Votre message à ${selectedResearcher.name}...`}
                  rows="8"
                />
              </div>

              <div className="form-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setSelectedResearcher(null)}
                >
                  Annuler
                </button>
                <button 
                  className="btn-primary"
                  onClick={sendMessage}
                  disabled={!message.trim()}
                >
                  Envoyer le message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Boîte de réception des messages */}
      <div className="inbox-section">
        <MessageInbox/>
      </div>
    </div>
  );
};

export default ProjectContacts;