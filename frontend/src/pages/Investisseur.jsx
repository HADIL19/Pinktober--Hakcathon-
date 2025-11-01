import React, { useState, useEffect } from 'react';
import './Investisseur.css';
import MyInvestments from '../components/MyInvestments';
import InvestorNavbar from '../components/InvestorNavbar';

const Investisseur = () => {
  const [investor, setInvestor] = useState({
    name: "Marie Dubois",
    email: "marie.dubois@email.com",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    joinDate: "Janvier 2023",
    bio: "Investisseuse passionnée par l'innovation médicale et les technologies de santé. Je cherche à soutenir des projets prometteurs dans la lutte contre le cancer.",
    investmentFocus: ["Immunothérapie", "IA Médicale", "Diagnostic Précoce"],
    riskTolerance: "Modéré",
    investmentRange: "50K€ - 200K€ par projet",
    investmentHorizon: "3-5 ans"
  });

  const [investments, setInvestments] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalAmount: 0,
    averageReturn: "+14%",
    successRate: "94%"
  });
  const [loading, setLoading] = useState(true);

  // Récupérer les investissements et statistiques
  const fetchInvestorData = async () => {
  try {
    setLoading(true);
      
    const response = await fetch('http://localhost:4000/api/investor/profile');
    const result = await response.json();
    
    if (result.success) {
      setInvestor(result.data.profile);
      setInvestments(result.data.investments);
      setStats(result.data.stats);
    }
    
  } catch (error) {
    console.error('Erreur chargement données investisseur:', error);
  } finally {
    setLoading(false);
  }
};

  // Calculer les statistiques basées sur les investissements
  const calculateStats = (investments) => {
    const totalProjects = investments.length;
    const totalAmount = investments.reduce((sum, inv) => sum + inv.amount, 0);
    
    // Calculer le retour moyen (simplifié pour l'exemple)
    const activeInvestments = investments.filter(inv => inv.displayStatus === 'ACTIF');
    const averageReturn = activeInvestments.length > 0 ? "+14%" : "N/A";
    
    // Calculer le taux de succès (simplifié)
    const successfulInvestments = investments.filter(inv => 
      inv.displayStatus === 'ACTIF' || inv.displayStatus === 'TERMINÉ'
    ).length;
    const successRate = totalProjects > 0 ? 
      Math.round((successfulInvestments / totalProjects) * 100) + "%" : "0%";

    setStats({
      totalProjects,
      totalAmount,
      averageReturn,
      successRate
    });
  };

  useEffect(() => {
    fetchInvestorData();
  }, []);

  if (loading) {
    return (
      <div className="investor-profile">
        <InvestorNavbar/>
        <div className="loading">Chargement de votre profil...</div>
      </div>
    );
  }

  return (
    <div className="investor-profile">
      <InvestorNavbar/>
      
      {/* En-tête du profil */}
      <div className="profile-header">
        <div className="profile-avatar">
          {investor.name.split(' ').map(n => n[0]).join('')}
        </div>
        <h1 className="profile-name">{investor.name}</h1>
        <div className="profile-title">Investisseur en Innovation Médicale</div>
        <p className="profile-bio">{investor.bio}</p>
      </div>

      {/* Statistiques dynamiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalProjects}</div>
          <div className="stat-label">Projets Investis</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalAmount.toLocaleString()}€</div>
          <div className="stat-label">Montant Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.averageReturn}</div>
          <div className="stat-label">Retour Moyen</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.successRate}</div>
          <div className="stat-label">Taux de Succès</div>
        </div>
      </div>

      {/* Informations personnelles et préférences */}
      <div className="info-grid">
        <div className="info-card">
          <h3>Informations Personnelles</h3>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{investor.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Téléphone:</span>
            <span className="info-value">{investor.phone}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Localisation:</span>
            <span className="info-value">{investor.location}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Membre depuis:</span>
            <span className="info-value">{investor.joinDate}</span>
          </div>
        </div>

        <div className="info-card">
          <h3>Préférences d'Investissement</h3>
          <div className="info-item">
            <span className="info-label">Focus:</span>
            <div className="tags-container">
              {investor.investmentFocus.map((focus, index) => (
                <span key={index} className="tag">{focus}</span>
              ))}
            </div>
          </div>
          <div className="info-item">
            <span className="info-label">Tolérance risque:</span>
            <span className="info-value">{investor.riskTolerance}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Montant typique:</span>
            <span className="info-value">{investor.investmentRange}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Horizon:</span>
            <span className="info-value">{investor.investmentHorizon}</span>
          </div>
        </div>
      </div>

      {/* Investissements actuels */}
      <div className="investments-section">
        <MyInvestments />
      </div>
    </div>
  );
};

export default Investisseur;