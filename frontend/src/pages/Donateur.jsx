import React, { useState } from "react";
import DonateForm from "../components/DonateForm";
import "../styles/Donateur.css";

export default function Donateur({ user }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="donateur-page">
      <h1 className="donateur-title">Faites un geste d'espoir 💖</h1>
      <p className="donateur-subtitle">
        Votre don peut sauver des vies et soutenir la recherche contre le cancer.
        <br /> Chaque euro compte pour construire un avenir meilleur 🌸
      </p>

    

      <button className="donate-btn" onClick={() => setShowForm(true)}>
        Faire un don maintenant
      </button>
      <br></br>
      <br></br>
      <br></br>

        {/* Added image in the center */}
      <div className="donate-image-container">
        <img 
          src="/DONATE.png" 
          alt="Faire un don" 
          className="donate-image"
        />
      </div>

      {showForm && (
        <div className="overlay">
          <div className="modal">
            <DonateForm
              projectId={1} // you can replace with a default project ID
              userId={user?.id || 1}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}