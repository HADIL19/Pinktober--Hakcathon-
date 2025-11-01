// components/MessageDetailModal.jsx
import { useState } from 'react';
import "../styles/PorteurProjet.css";
export default function MessageDetailModal({ message, onClose, onReply }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const markAsRead = async () => {
    if (!message.isRead && !message.isSentByMe) {
      try {
        await fetch(`/api/messages/${message.id}/read`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (error) {
        console.error('Erreur marquage comme lu:', error);
      }
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          receiver_id: message.senderId,
          project_id: message.projectId,
          subject: `RE: ${message.subject}`,
          message: replyContent
        })
      });

      if (res.ok) {
        alert('Réponse envoyée avec succès!');
        setIsReplying(false);
        setReplyContent('');
        onReply();
        onClose();
      }
    } catch (error) {
      alert('Erreur lors de l\'envoi de la réponse');
    }
  };

  // Marquer comme lu quand le modal s'ouvre
  useState(() => {
    markAsRead();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content message-detail-modal">
        <div className="modal-header">
          <h3>Détail du Message</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="message-detail">
          {/* En-tête du message */}
          <div className="detail-header">
            <div className="sender-receiver">
              <strong>De:</strong> {message.sender?.name} ({message.sender?.email})
              <br />
              <strong>À:</strong> {message.receiver?.name} ({message.receiver?.email})
            </div>
            <div className="message-meta">
              <span className="date">
                {new Date(message.createdAt).toLocaleString()}
              </span>
              {message.project && (
                <div className="project-info">
                  <strong>Projet:</strong> {message.project.title}
                </div>
              )}
            </div>
          </div>

          {/* Sujet */}
          <div className="message-subject-detail">
            <h4>{message.subject}</h4>
          </div>

          {/* Contenu du message */}
          <div className="message-content">
            <p>{message.content}</p>
          </div>

          {/* Actions */}
          <div className="message-actions-detail">
            {!message.isSentByMe && (
              <button 
                className="reply-btn"
                onClick={() => setIsReplying(!isReplying)}
              >
                {isReplying ? 'Annuler' : 'Répondre'}
              </button>
            )}
            <button className="new-message-btn" onClick={onReply}>
              Nouveau Message
            </button>
          </div>

          {/* Zone de réponse */}
          {isReplying && (
            <div className="reply-section">
              <h4>Répondre à {message.sender?.name}</h4>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Tapez votre réponse ici..."
                rows="6"
                className="reply-textarea"
              />
              <div className="reply-actions">
                <button 
                  className="send-reply-btn"
                  onClick={handleReply}
                  disabled={!replyContent.trim()}
                >
                  Envoyer la réponse
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}