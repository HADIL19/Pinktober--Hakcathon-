// src/components/MessageInbox.jsx
import React, { useState, useEffect } from 'react';
import './MessageInbox.css';

const MessageInbox = () => {
  const [messages, setMessages] = useState({ sent: [], received: [], all: [] });
  const [activeTab, setActiveTab] = useState('sent'); // Par défaut sur "Envoyés"
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/messages/my-messages');
      const result = await response.json();
      
      if (result.success) {
        console.log('📨 Messages reçus du backend:', result.data);
        
        // CORRECTION : Inverser l'affichage
        // Dans le backend, les messages où vous êtes senderId=1 sont VOS messages envoyés
        // Mais ils peuvent être stockés dans "received" ou "sent" selon la logique backend
        setMessages({
          // Les messages que VOUS avez envoyés (senderId = 1)
          sent: result.data.sent || [],
          // Les messages que VOUS avez reçus (receiverId = 1)  
          received: result.data.received || [],
          all: result.data.all || []
        });
      }
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    const handleRefresh = () => {
      fetchMessages();
    };
    
    window.addEventListener('refreshMessages', handleRefresh);
    return () => window.removeEventListener('refreshMessages', handleRefresh);
  }, []);

  const getFilteredMessages = () => {
    switch (activeTab) {
      case 'received': 
        // Messages où VOUS êtes le destinataire (receiverId = 1)
        return messages.received || [];
      case 'sent': 
        // Messages où VOUS êtes l'expéditeur (senderId = 1)
        return messages.sent || [];
      default: 
        return messages.all || [];
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await fetch(`http://localhost:4000/api/messages/${messageId}/read`, {
        method: 'PATCH'
      });
      fetchMessages();
    } catch (error) {
      console.error('Erreur marquage comme lu:', error);
    }
  };

  if (loading) return <div className="loading">Chargement des messages...</div>;

  const filteredMessages = getFilteredMessages();

  return (
    <div className="message-inbox">
      <div className="inbox-header">
        <h2>📨 Mes Messages</h2>
        <div className="message-stats">
          <span>Total: {messages.all?.length || 0}</span>
          <span>Reçus: {messages.received?.length || 0}</span>
          <span>Envoyés: {messages.sent?.length || 0}</span>
          <span className="unread">
            Non lus: {messages.received?.filter(msg => !msg.isRead).length || 0}
          </span>
        </div>
      </div>

      <div className="inbox-tabs">
        <button 
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
        >
          📋 Tous ({messages.all?.length || 0})
        </button>
       
        <button 
          className={activeTab === 'sent' ? 'active' : ''}
          onClick={() => setActiveTab('sent')}
        >
          📤 Reçus  ({messages.sent?.length || 0})
        </button>
         <button 
          className={activeTab === 'received' ? 'active' : ''}
          onClick={() => setActiveTab('received')}
        >
          📥 Envoyés ({messages.received?.length || 0})
        </button>
      </div>

      <div className="messages-list">
        {filteredMessages.map(message => {
          // Déterminer si c'est un message envoyé ou reçu
          const isSentMessage = activeTab === 'sent';
          const otherPerson = isSentMessage ? message.receiver : message.sender;
          
          return (
            <div 
              key={message.id} 
              className={`message-card ${!message.isRead && activeTab === 'received' ? 'unread' : ''}`}
              onClick={() => activeTab === 'received' && !message.isRead && markAsRead(message.id)}
            >
              <div className="message-header">
                <div className="message-participants">
                  <div className="participant">
                    <strong>{isSentMessage ? 'À: ' : 'De: '}</strong>
                    <span className={isSentMessage ? 'receiver' : 'sender'}>
                      {otherPerson?.name || (isSentMessage ? 'Destinataire inconnu' : 'Expéditeur inconnu')}
                    </span>
                  </div>
                  {message.project && (
                    <div className="project-info">
                      <strong>Projet:</strong> {message.project.title}
                    </div>
                  )}
                </div>
                <div className="message-date">
                  {new Date(message.createdAt).toLocaleDateString('fr-FR')} à{' '}
                  {new Date(message.createdAt).toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
              
              <div className="message-subject">
                <strong>{message.subject || 'Sans objet'}</strong>
              </div>
              
              <div className="message-content">
                {message.content}
              </div>
              
              <div className="message-actions">
                {activeTab === 'received' && !message.isRead && (
                  <span className="unread-badge">Nouveau</span>
                )}
                <span className={`message-status ${activeTab}`}>
                  {isSentMessage ? '✓ Envoyé' : '✓ Reçu'}
                </span>
              </div>
            </div>
          );
        })}
        
        {filteredMessages.length === 0 && (
          <div className="no-messages">
            {activeTab === 'all' && "📭 Aucun message"}
            {activeTab === 'received' && "📭 Aucun message reçu"}
            {activeTab === 'sent' && "📭 Aucun message envoyé"}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageInbox;