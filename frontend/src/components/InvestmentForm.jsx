import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './InvestmentForm.css';

const InvestmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [investment, setInvestment] = useState({
    amount: '',
    investorName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInvestment({
      ...investment,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulation d'envoi vers le backend
      console.log('💰 Données d\'investissement:', { projectId: id, ...investment });
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`✅ Investissement de ${investment.amount}€ envoyé avec succès !\n\nVous recevrez un email de confirmation.`);
      navigate('/ProjectsMarketplace');
    } catch (error) {
      alert('❌ Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const investmentAmounts = [
    { value: 1000, label: '1 000€' },
    { value: 5000, label: '5 000€' },
    { value: 10000, label: '10 000€' },
    { value: 25000, label: '25 000€' },
    { value: 50000, label: '50 000€' },
    { value: 'custom', label: 'Montant personnalisé' }
  ];

  return (
    <div className="investment-form">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Retour
      </button>

      <div className="form-container">
        <div className="form-header">
          <h1>💼 Formulaire d'Investissement</h1>
          <p>Remplissez ce formulaire pour investir dans le projet #{id}</p>
        </div>

        <form onSubmit={handleSubmit} className="investment-form-content">
          <div className="form-section">
            <h3>Montant de l'investissement</h3>
            <div className="amount-options">
              {investmentAmounts.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`amount-option ${investment.amount === option.value ? 'selected' : ''}`}
                  onClick={() => setInvestment({...investment, amount: option.value})}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            {investment.amount === 'custom' && (
              <div className="custom-amount">
                <label>Montant personnalisé (€)</label>
                <input
                  type="number"
                  name="customAmount"
                  placeholder="Entrez le montant"
                  min="100"
                  step="100"
                  onChange={(e) => setInvestment({...investment, amount: e.target.value})}
                />
              </div>
            )}
          </div>

          <div className="form-section">
            <h3>Informations personnelles</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Nom complet *</label>
                <input
                  type="text"
                  name="investorName"
                  value={investment.investorName}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom complet"
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={investment.email}
                  onChange={handleChange}
                  required
                  placeholder="votre@email.com"
                />
              </div>
              
              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={investment.phone}
                  onChange={handleChange}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Message optionnel</h3>
            <div className="form-group">
              <textarea
                name="message"
                value={investment.message}
                onChange={handleChange}
                placeholder="Pourquoi souhaitez-vous investir dans ce projet ? (optionnel)"
                rows="4"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate(-1)}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading || !investment.amount || !investment.investorName || !investment.email}
            >
              {loading ? 'Traitement...' : `Investir ${investment.amount === 'custom' ? '' : investment.amount + '€'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestmentForm;