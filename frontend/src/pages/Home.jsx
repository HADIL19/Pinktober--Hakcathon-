import { Link } from "react-router-dom";
import { FaHandHoldingHeart, FaHandsHelping, FaLightbulb } from "react-icons/fa";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <section className="hero">
        <h1 className="hero-title">Bienvenue sur PinkHope 💗</h1>
        <p className="hero-quote">
          Ensemble, nous soutenons la recherche, les hôpitaux et les patients
          dans la lutte contre le cancer.
        </p>
        <div className="hero-buttons">
          <Link to="/login" className="btn">Se connecter</Link>
          <Link to="/register" className="btn secondary">S'inscrire</Link>
        </div>
      </section>

      <section className="roles">
        <h2>Nos utilisateurs</h2>
        <div className="roles-container">
          <div className="role-card">
            <FaHandHoldingHeart className="role-icon" />
            <h3>Donateur Individuel</h3>
            <p>Faire des dons financiers ou en nature pour aider les patients et hôpitaux.</p>
          </div>
          <div className="role-card">
            <FaHandsHelping className="role-icon" />
            <h3>Sponsor Entreprise</h3>
            <p>Sponsoriser du matériel, des équipements ou des campagnes de sensibilisation.</p>
          </div>
          <div className="role-card">
            <FaLightbulb className="role-icon" />
            <h3>Investisseur</h3>
            <p>Investir dans des projets innovants de recherche liés au cancer.</p>
          </div>
        </div>
      </section>

      <section className="stats">
        <h2>Nos Statistiques</h2>
        <div className="stats-container">
          <div className="stat-box">
            <span className="stat-number">120+</span>
            <p>Projets soutenus</p>
          </div>
          <div className="stat-box">
            <span className="stat-number">80+</span>
            <p>Investisseurs</p>
          </div>
          <div className="stat-box">
            <span className="stat-number">250+</span>
            <p>Donateurs</p>
          </div>
        </div>
      </section>
    </>
  );
}
