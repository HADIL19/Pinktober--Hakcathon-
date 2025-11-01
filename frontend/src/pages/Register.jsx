// frontend/src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/register", { // 👈 URL complète
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur d'inscription");
      }

      alert("Compte créé avec succès !");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Créez votre compte</h2>
        <p className="auth-subtitle">Rejoignez la communauté PinkHope</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Nom complet</label>
            <input
              name="name"
              type="text"
              placeholder="Ex: Yasmine Benali"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              name="password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Rôle</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="form-select"
              disabled={loading}
            >
              <option value="">-- Sélectionnez votre rôle --</option>
              <option value="donateur">Donateur Individuel</option>
              <option value="sponsor">Sponsor Entreprise</option>
              <option value="investisseur">Investisseur</option>
              <option value="porteur_projet">Porteur de Projet</option>
            </select>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <p className="auth-link">
          Vous avez déjà un compte ?{" "}
          <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}