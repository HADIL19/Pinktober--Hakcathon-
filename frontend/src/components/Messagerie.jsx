// components/Messagerie.jsx
import { useState } from "react";
import "../styles/Messagerie.css";

export default function Messagerie({ messages, onRefresh }) {
  const [replyTo, setReplyTo] = useState(null);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const handleReply = (msg) => {
    setReplyTo(msg);
    setSubject(`Re: ${msg.subject || ""}`.trim());
    setContent("");
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyTo) return;

    try {
      const res = await fetch("http://localhost:5000/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          receiverId: replyTo.sender.id,
          projectId: replyTo.project?.id || null,
          subject,
          content,
        }),
      });

      if (res.ok) {
        alert("✅ Message envoyé !");
        setReplyTo(null);
        setSubject("");
        setContent("");
        onRefresh(); // recharge les messages
      } else {
        const err = await res.json();
        alert(`❌ Erreur: ${err.message}`);
      }
    } catch (error) {
      console.error("Erreur envoi message:", error);
      alert("Erreur réseau lors de l’envoi");
    }
  };

  return (
    <div className="messagerie">
      <h2>📨 Messagerie reçue</h2>

      {messages.length === 0 ? (
        <p>Aucun message reçu.</p>
      ) : (
        <ul className="messages-list">
          {messages.map((msg) => (
            <li key={msg.id} className={`message-item ${msg.isRead ? "read" : "unread"}`}>
              <div className="message-header">
                <strong>De :</strong> {msg.sender?.name || "Inconnu"} ({msg.sender?.email})
              </div>
              <div><strong>Sujet :</strong> {msg.subject || "(sans sujet)"}</div>
              <p className="message-content">{msg.content}</p>
              <small>
                📅 {new Date(msg.createdAt).toLocaleString()}
              </small>
              <div className="message-actions">
                <button className="reply-btn" onClick={() => handleReply(msg)}>
                  Répondre
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {replyTo && (
        <div className="reply-form">
          <h3>✉️ Répondre à {replyTo.sender?.name}</h3>
          <form onSubmit={handleSendReply}>
            <label>
              Sujet :
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </label>
            <label>
              Message :
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="5"
                required
              />
            </label>
            <div className="form-buttons">
              <button type="submit" className="send-btn">Envoyer</button>
              <button type="button" className="cancel-btn" onClick={() => setReplyTo(null)}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
