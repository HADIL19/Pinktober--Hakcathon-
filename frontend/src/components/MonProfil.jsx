import React, { useEffect, useState } from "react";
import "../styles/PorteurProjet.css";

export default function MonProfil() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Erreur de chargement du profil");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return <p>Chargement du profil...</p>;
  }

  return (
    <div className="mon-profil">
      <h2>Mon Profil</h2>

      <div className="profil-card">
        <div className="profil-item">
          <strong>Nom :</strong> {user.name || "Non renseigné"}
        </div>
        <div className="profil-item">
          <strong>Email :</strong> {user.email}
        </div>
        <div className="profil-item">
          <strong>Rôle :</strong> {user.role}
        </div>
        <div className="profil-item">
          <strong>Date de création :</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
