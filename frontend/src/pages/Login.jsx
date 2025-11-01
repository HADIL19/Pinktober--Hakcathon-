// frontend/src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erreur de connexion");
    }

    // 👇 STOCKER L'ID UTILISATEUR
    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.user.role);
    localStorage.setItem("userName", data.user.name);
    localStorage.setItem("userId", data.user.id); // 👈 NOUVEAU - ID utilisateur
    
    console.log("✅ Connexion réussie, ID:", data.user.id, "Rôle:", data.user.role);
    
    // Redirection basée sur le rôle
    switch(data.user.role.toLowerCase()) {
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
        navigate("/marketplace");
    }
  } catch (err) {
    console.error("❌ Erreur connexion:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Bienvenue !</h2>
        <p className="auth-subtitle">Connectez-vous à votre compte PinkHope</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="saisir l'adresse e_mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              placeholder="saisir un mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="form-input"
              disabled={loading}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
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