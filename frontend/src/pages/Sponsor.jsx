// frontend/src/components/SponsorsPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SponsorsPage.css';

const SponsorsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sponsors, setSponsors] = useState([]);
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch sponsors
        const sponsorsRes = await fetch('http://localhost:5000/api/sponsors');
        const sponsorsData = await sponsorsRes.json();

        // Fetch items
        const itemsRes = await fetch('http://localhost:5000/api/sponsors/items/all');
        const itemsData = await itemsRes.json();

        // Fetch stats
        const statsRes = await fetch('http://localhost:5000/api/sponsors/stats/overview');
        const statsData = await statsRes.json();

        if (sponsorsData.success) setSponsors(sponsorsData.data);
        if (itemsData.success) setItems(itemsData.data);
        if (statsData.success) setStats(statsData.data);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Impossible de charger les données. Vérifiez que le serveur est démarré.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatAmount = (amount) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M€`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K€`;
    return `${amount}€`;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      equipment: '🛋️',
      technology: '💻',
      spaces: '🌿',
      events: '🎪',
      research: '🔬',
      health: '💖',
      awareness: '🎀',
      charity: '🤝',
      beauty: '💄',
      fashion: '👗',
      fitness: '🏋️‍♂️',
      food: '🍽️',
      wellness: '🧘',
      tech: '🖥️',
      innovation: '🚀'
    };
    return icons[category] || '📦';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      equipment: 'Équipement',
      technology: 'Technologie',
      spaces: 'Espaces',
      events: 'Événements',
      research: 'Recherche',
      health: 'Santé',
      awareness: 'Sensibilisation',
      charity: 'Charité',
      beauty: 'Beauté',
      fashion: 'Mode',
      fitness: 'Fitness',
      food: 'Alimentation',
      wellness: 'Bien-être',
      tech: 'Technologie',
      innovation: 'Innovation'
    };
    return labels[category] || category;
  };

  const groupSponsorsByTier = () => {
    const tiers = {
      platinum: [],
      gold: [],
      silver: [],
      bronze: []
    };

    sponsors.forEach(sponsor => {
      const tier = sponsor.sponsorshipType?.toLowerCase();
      if (tiers[tier]) {
        tiers[tier].push(sponsor);
      }
    });

    return tiers;
  };

  const filteredItems = activeTab === 'items' ? items : [];
  const groupedSponsors = groupSponsorsByTier();

  if (loading) {
    return (
      <div className="sponsors-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des sponsors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sponsors-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Erreur de connexion</h3>
          <p>{error}</p>
          <button className="become-sponsor-btn" onClick={() => window.location.reload()}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sponsors-page">
      {/* Hero Section */}
      <section className="sponsors-hero">
        <div className="hero-content">
          <div className="hero-icon">🤝</div>
          <h1>Nos Partenaires & Sponsors</h1>
          <p>
            Ensemble, nous construisons un avenir meilleur pour la recherche et le traitement 
            du cancer du sein. Découvrez les entreprises et organisations qui rendent notre mission possible.
          </p>
          
          {stats && (
            <div className="sponsors-stats">
              <div className="stat-item">
                <div className="stat-number">{stats.totalSponsors}</div>
                <div className="stat-label">Sponsors Actifs</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{formatAmount(stats.totalFunding)}</div>
                <div className="stat-label">Total Financé</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{stats.totalItems}</div>
                <div className="stat-label">Équipements Financés</div>
              </div>
            </div>
          )}

          <button 
            className="become-sponsor-btn"
            onClick={() => navigate('/sponsor-request')}
          >
            <span>💝</span>
            Devenir Sponsor
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div className="sponsors-tabs">
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          🏢 Tous les Sponsors
        </button>
        <button 
          className={`tab-btn ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          📦 Équipements Sponsorisés
        </button>
      </div>

      {/* Content */}
      {activeTab === 'all' && (
        <section className="sponsors-section">
          <div className="section-header">
            <h2>Nos Sponsors par Catégorie</h2>
            <p>Découvrez nos partenaires classés selon leur niveau d'engagement</p>
          </div>

          {['platinum','gold','silver','bronze'].map(tier => (
            groupedSponsors[tier].length > 0 && (
              <div key={tier} className="tier-section">
                <div className="tier-header">
                  <span className={`tier-badge ${tier}`}>
                    {tier === 'platinum' ? '💎 PLATINUM' :
                     tier === 'gold' ? '🥇 GOLD' :
                     tier === 'silver' ? '🥈 SILVER' : '🥉 BRONZE'}
                  </span>
                  <h3 className="tier-title">Partenaires {tier.charAt(0).toUpperCase() + tier.slice(1)}</h3>
                </div>
                <div className="sponsors-grid">
                  {groupedSponsors[tier].map(sponsor => (
                    <SponsorCard key={sponsor.id} sponsor={sponsor} formatAmount={formatAmount} getCategoryLabel={getCategoryLabel} />
                  ))}
                </div>
              </div>
            )
          ))}
        </section>
      )}

      {activeTab === 'items' && (
        <section className="sponsors-section">
          <div className="section-header">
            <h2>Équipements & Services Sponsorisés</h2>
            <p>Découvrez ce que nos sponsors financent</p>
          </div>
          <div className="items-grid">
            {filteredItems.map(item => (
              <div key={item.id} className="item-card">
                <div className="item-header">
                  <span className="item-icon">{getCategoryIcon(item.itemCategory)}</span>
                  <span className="item-amount">{formatAmount(item.amount)}</span>
                </div>
                <h3 className="item-name">{item.itemName}</h3>
                <p className="item-sponsor">Sponsorisé par <strong>{item.sponsor.name}</strong></p>
                <span className="item-category">{getCategoryLabel(item.itemCategory)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// Sponsor Card Component
const SponsorCard = ({ sponsor, formatAmount, getCategoryLabel }) => {
  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  // Parse categories safely
  const categories = Array.isArray(sponsor.categories) ? sponsor.categories :
                     (sponsor.categories ? JSON.parse(sponsor.categories) : []);

  return (
    <div className="sponsor-card">
      <div className="sponsor-logo">
        {getInitials(sponsor.name)}
      </div>
      <h3 className="sponsor-name">{sponsor.name}</h3>
      <p className="sponsor-description">{sponsor.description}</p>
      
      <div className="sponsor-amount">
        <span className="amount-value">{formatAmount(sponsor.totalAmount)}</span>
        <span className="amount-label">financés</span>
      </div>

      <div className="sponsor-categories">
        {categories.map(cat => (
          <span key={cat} className="category-tag">
            {getCategoryLabel(cat)}
          </span>
        ))}
      </div>

      <div className="sponsor-footer">
        <a 
          href={`mailto:${sponsor.contactEmail}`} 
          className="sponsor-link"
        >
          📧 Contact
        </a>
        {sponsor.website && (
          <a 
            href={sponsor.website} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="sponsor-link"
          >
            🌐 Site Web
          </a>
        )}
      </div>
    </div>
  );
};

export default SponsorsPage;
