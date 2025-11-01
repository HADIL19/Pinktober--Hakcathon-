import React, { useState } from "react";
import axios from "axios";
import "../styles/DonateForm.css";

export default function DonateForm({ projectId, userId, onClose }) {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/donations", {
        amount: parseFloat(amount),
        userId,
        projectId,
        message,
        method: "CB", // 💳 indicates credit card
      });
      setSuccess(true);
      setAmount("");
      setMessage("");
    } catch (err) {
      console.error("Donation failed:", err);
      alert("Une erreur est survenue !");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="donate-success">
        🎉 Merci pour votre générosité !
        <p>Votre contribution compte énormément 💖</p>
        <button onClick={onClose}>Fermer</button>
      </div>
    );
  }

  return (
    <div className="donate-form-container">
      <h2 className="form-title">Paiement sécurisé 💳</h2>
      <p className="form-subtitle">
        Remplissez vos informations pour finaliser votre don
      </p>

      <form onSubmit={handleSubmit} className="donate-form">
        <label>Nom sur la carte</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Yasmine Ben Ali"
          required
        />

        <label>Numéro de carte</label>
        <input
          type="text"
          maxLength="19"
          value={cardNumber}
          onChange={(e) =>
            setCardNumber(
              e.target.value
                .replace(/\D/g, "")
                .replace(/(.{4})/g, "$1 ")
                .trim()
            )
          }
          placeholder="1234 5678 9012 3456"
          required
        />

        <div className="card-details">
          <div>
            <label>Expiration</label>
            <input
              type="text"
              maxLength="5"
              value={expiry}
              onChange={(e) =>
                setExpiry(
                  e.target.value
                    .replace(/\D/g, "")
                    .replace(/(\d{2})(\d{0,2})/, "$1/$2")
                    .trim()
                )
              }
              placeholder="MM/AA"
              required
            />
          </div>
          <div>
            <label>CVV</label>
            <input
              type="password"
              maxLength="3"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
              placeholder="123"
              required
            />
          </div>
        </div>

        <label>Montant (€)</label>
        <input
          type="number"
          min="1"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Ex: 50.00"
          required
        />

        <label>Message (optionnel)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Laissez un message de soutien..."
        ></textarea>

        <button type="submit" disabled={loading}>
          {loading ? "Traitement..." : "Valider le don"}
        </button>
        <button
          type="button"
          className="cancel-btn"
          onClick={onClose}
          disabled={loading}
        >
          Annuler
        </button>
      </form>
    </div>
  );
}
