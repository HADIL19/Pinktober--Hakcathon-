import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SponsorRequestForm.css';

const SponsorRequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    requestedType: '',
    requestedAmount: '',
    categories: [],
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const sponsorshipTypes = [
    { value: 'platinum', label: 'Platinum (200K€+)', icon: '💎' },
    { value: 'gold', label: 'Gold (100K€ - 200K€)', icon: '🥇' },
    { value: 'silver', label: 'Silver (50K€ - 100K€)', icon: '🥈' },
    { value: 'bronze', label: 'Bronze (< 50K€)', icon: '🥉' },
    { value: 'custom', label: 'Montant personnalisé', icon: '✨' }
  ];

  const categories = [
    { value: 'equipment', label: 'Équipement Patient', icon: '🛋️' },
    { value: 'technology', label: 'Technologie', icon: '💻' },
    { value: 'spaces', label: 'Espaces de Vie', icon: '🌿' },
    { value: 'events', label: 'Événements', icon: '🎪' },
    { value: 'research', label: 'Recherche', icon: '🔬' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleCategory = (categoryValue) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryValue)
        ? prev.categories.filter(c => c !== categoryValue)
        : [...prev.categories, categoryValue]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/sponsors/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Votre demande de parrainage a été envoyée avec succès !');
        navigate('/sponsors');
      } else {
        alert('❌ Erreur lors de l\'envoi. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Erreur de connexion. Vérifiez que le serveur est démarré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sponsor-request-page">

      {/* 🔝 Bouton de retour placé tout en haut */}
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate('/sponsors')}>
          ← Retour aux Sponsors
        </button>
      </div>

      <div className="request-container">
        <div className="request-header">
          <div className="header-icon">🤝</div>
          <h1>Devenir Sponsor</h1>
          <p>Rejoignez-nous dans notre mission de soutien à la recherche et aux patients</p>
        </div>

        <form onSubmit={handleSubmit} className="request-form">
          {/* Formulaire complet (inchangé) */}
          <div className="form-section">
            <h3>📋 Informations sur l'Entreprise</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Nom de l'Entreprise *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nom du Contact *</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>💎 Niveau de Parrainage</h3>
            <div className="sponsorship-types">
              {sponsorshipTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  className={`type-option ${formData.requestedType === type.value ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, requestedType: type.value })}
                >
                  <span>{type.icon}</span> {type.label}
                </button>
              ))}
            </div>

            {formData.requestedType === 'custom' && (
              <div className="custom-amount">
                <label>Montant Personnalisé (€)</label>
                <input
                  type="number"
                  name="requestedAmount"
                  value={formData.requestedAmount}
                  onChange={handleChange}
                  placeholder="Entrez le montant"
                />
              </div>
            )}
          </div>

          <div className="form-section">
            <h3>🎯 Domaines d'Intérêt</h3>
            <div className="categories-grid">
              {categories.map(category => (
                <button
                  key={category.value}
                  type="button"
                  className={`category-option ${formData.categories.includes(category.value) ? 'selected' : ''}`}
                  onClick={() => toggleCategory(category.value)}
                >
                  <span>{category.icon}</span> {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>💬 Message</h3>
            <div className="form-group">
              <label>Votre motivation *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/sponsors')}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Envoi...' : 'Envoyer la Demande'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SponsorRequestForm;
