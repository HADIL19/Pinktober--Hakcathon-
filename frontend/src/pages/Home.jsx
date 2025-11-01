import React from "react";
import Navbar from "../components/Navbar";
import "../styles/Home.css";
import AIAssistant from '../components/AIAssistant';

export default function Home() {
    const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      // Use smooth behavior for a better user experience
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
    
  return (
    <div className="home">
      <Navbar />

      {/* ===== Accueil Section ===== */}
      <section id="accueil" className="hero">
        <div className="hero-content">
          <div className="badge">
            🏆 Plateforme N°1 de Financement Cancer du Sein
          </div>
          <h1>
            Investissez dans <br /> l’Avenir de la Santé <span>Féminine</span>
          </h1>
          <p>
            Rejoignez notre écosystème d’innovation où chaque investissement crée un impact mesurable dans la lutte contre le cancer du sein.
          </p>

          <div  className="hero-buttons">
            <button onClick={() => scrollToSection("about")} className="btn primary">who are we ?</button>
            
          </div>
        </div>
      </section>

     {/* ===== 2. About Section (The Grid) ===== */}
      <section id="about" className="section section-about">
        <h2 className="section-title">Notre Écosystème</h2>
        <p className="section-subtitle">
            PinkHope est la plateforme numérique dédiée à la lutte contre le cancer du sein.<br></br>
          Nous connectons les investisseurs et sponsors aux projets de recherche, offrant un espace sécurisé pour financer l'innovation et transformer l'engagement en action médicale concrète.</p>

        {/* Sub-sections Grid */}
        <div className="about-grid">
          <div id="investisseurs" className="about-item">
            <div className="icon-circle"><span role="img" aria-label="money">💰</span></div>
            <h3>Investisseurs</h3>
            <p>Découvrez comment votre investissement contribue à l’innovation médicale et à la recherche dans la santé féminine.</p>
          </div>

          <div id="projets" className="about-item">
            <div className="icon-circle"><span role="img" aria-label="lightbulb">💡</span></div>
            <h3>Porteurs de Projets</h3>
            <p>Présentez votre initiative, trouvez des investisseurs et développez des solutions à fort impact pour la santé féminine.</p>
          </div>

          <div id="sponsors" className="about-item">
            <div className="icon-circle"><span role="img" aria-label="heart">❤️</span></div>
            <h3>Sponsors</h3>
            <p>Participez à une cause porteuse de sens en soutenant la recherche et l’innovation dans le domaine médical.</p>
          </div>

          <div id="donateurs" className="about-item">
            <div className="icon-circle"><span role="img" aria-label="hands">🤲</span></div>
            <h3>Donateurs</h3>
            <p>Chaque contribution compte. Ensemble, nous pouvons faire avancer la santé des femmes à travers le monde.</p>
          </div>
        </div>
      </section>

      
      {/* ===== 2. About Section (The Grid) ===== */}
     <section id="statistique" className="statistics-section">
     <h2 className="section-title">Notre Impact en Chiffres</h2>
        <p className="section-subtitle">
          Notre engagement se mesure à travers des résultats concrets et transparents. Découvrez les jalons que nous avons franchis grâce à votre soutien continu.
        </p>
      <div className="statistic-item">
        <span className="statistic-icon" role="img" aria-label="success rate">✅</span>
        <p className="statistic-value">94%</p>
        <p className="statistic-label">taux de succès des projets</p>
      </div>
      <div className="statistic-item">
        <span className="statistic-icon" role="img" aria-label="partner institutions">🏥</span>
        <p className="statistic-value">42+</p>
        <p className="statistic-label">institutions partenaires</p>
      </div>
      <div className="statistic-item">
        <span className="statistic-icon" role="img" aria-label="lives impacted">🎗️</span> {/* Changed to ribbon for breast cancer theme */}
        <p className="statistic-value">45K+</p>
        <p className="statistic-label">vies impactées</p>
      </div>
    </section>

      {/* ===== Contact Section (Footer) ===== */}
     {/* ===== Contact Section (Footer) ===== */}

      {/* ===== 4. Contact Section (Footer) ===== */}
      <section id="contact" className="footer-section">
        <div className="footer-container">
          <div className="footer-brand">
            <h2>PinkHope 💗</h2>
            <p>
              Ensemble, soutenons l’innovation et la recherche dans la lutte
              contre le cancer du sein.
            </p>
          </div>

          <div className="footer-links">
            <h3>Liens utiles</h3>
            <a href="#contact" onClick={() => scrollToSection("contact")}>
              Contact
            </a>
            <a href="/cgu">CGU</a>
            <a href="/confidentialite">Confidentialité</a>
          </div>

          <div className="footer-social">
            <h3>Suivez-nous</h3>
            {/* Note: Font Awesome CDN is required in index.html for these icons to display */}
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 PinkHope. Ensemble pour un avenir sans cancer 💗</p>
        </div>
      </section>
     <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <AIAssistant />
        </div>
      </section>
    </div>
  );
}
