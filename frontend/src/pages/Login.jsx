import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erreur de connexion");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role); // Stocker le rôle
      
      alert("Connexion réussie !");
      
      // Redirection basée sur le rôle
      switch(data.user.role) {
        case "donateur":
          navigate("/donateur");
          break;
        case "sponsor":
          navigate("/sponsor");
          break;
        case "investisseur":
          navigate("/investisseur");
          break;
        case "porteur_projet":
          navigate("/porteur-projet");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Bienvenue, cher investisseur !</h2>
        <p className="auth-subtitle">Connectez-vous à votre compte PinkHope</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              placeholder="saisir l'adresse e_mail"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              name="password"
              type="password"
              placeholder="saisir un mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="auth-button">
            Se connecter
          </button>
        </form>

        <p className="auth-link">
          Si vous n'avez pas de compte -{" "}
          <Link to="/register">Inscrivez-vous !</Link>
        </p>
      </div>
    </div>
  );
}