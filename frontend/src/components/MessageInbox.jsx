// src/components/MessageInbox.js
import React, { useState, useEffect } from 'react';
import './MessageInbox.css';

const MessageInbox = () => {
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/messages/my-messages');
      const result = await response.json();
      
      if (result.success) {
        setMessages(result.data);
      }
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const getFilteredMessages = () => {
    switch (activeTab) {
      case 'received': return messages.received || [];
      case 'sent': return messages.sent || [];
      default: return messages.all || [];
    }
  };

  if (loading) return <div className="loading">Chargement des messages...</div>;

  return (
    <div className="message-inbox">
      <div className="inbox-header">
        <h2>📨 Mes Messages</h2>
        <div className="message-stats">
          <span>Total: {messages.stats?.total || 0}</span>
          <span>Reçus: {messages.stats?.received || 0}</span>
          <span>Envoyés: {messages.stats?.sent || 0}</span>
          <span className="unread">Non lus: {messages.stats?.unread || 0}</span>
        </div>
      </div>

      <div className="inbox-tabs">
        <button 
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
        >
          Tous
        </button>
        <button 
          className={activeTab === 'received' ? 'active' : ''}
          onClick={() => setActiveTab('received')}
        >
          Reçus
        </button>
        <button 
          className={activeTab === 'sent' ? 'active' : ''}
          onClick={() => setActiveTab('sent')}
        >
          Envoyés
        </button>
      </div>

      <div className="messages-list">
        {getFilteredMessages().map(message => (
          <div key={message.id} className={`message-card ${!message.read ? 'unread' : ''}`}>
            <div className="message-header">
              <div className="message-sender">
                <strong>
                  {message.senderId === 2 ? '👤 Vous' : message.sender?.name}
                </strong>
                <span> → </span>
                <strong>
                  {message.receiverId === 2 ? '👤 Vous' : message.receiver?.name}
                </strong>
              </div>
              <div className="message-date">
                {new Date(message.createdAt).toLocaleDateString('fr-FR')}
              </div>
            </div>
            
            <div className="message-subject">
              <strong>{message.subject}</strong>
              {message.project && (
                <span className="project-badge">Projet: {message.project.title}</span>
              )}
            </div>
            
            <div className="message-content">
              {message.content}
            </div>
            
            <div className="message-actions">
              <button className="btn-reply">📨 Répondre</button>
              {!message.read && (
                <span className="unread-badge">Nouveau</span>
              )}
            </div>
          </div>
        ))}
        
        {getFilteredMessages().length === 0 && (
          <div className="no-messages">
            {activeTab === 'all' && "Aucun message"}
            {activeTab === 'received' && "Aucun message reçu"}
            {activeTab === 'sent' && "Aucun message envoyé"}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageInbox;