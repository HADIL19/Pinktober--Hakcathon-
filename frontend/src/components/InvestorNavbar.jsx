import React from "react";
import "../styles/Navbar.css";
import logo from "../assets/logo.png"; 

export default function InvestorNavbar() {
  // Function to smoothly scroll to sections by ID
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn(`Section with ID: ${id} not found for smooth scroll.`);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    // Clear user data from localStorage/sessionStorage
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    sessionStorage.removeItem("userToken");
    
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <header className="pink-navbar">
      {/* --- Left: Logo & Brand Name --- */}
      <div className="navbar-brand" onClick={() => scrollToSection("accueil")}>
        <img src={logo} alt="PinkHope logo" className="brand-logo" />
        <span className="brand-text">PinkHope Investor</span>
      </div>

      {/* --- Right: Navigation Links --- */}
      <div className="navbar-links">
        {/* Using button to trigger smooth scroll for internal links */}
        <button onClick={() => scrollToSection("accueil")} className="nav-item">Accueil</button>
        
        
        {/* Logout button */}
        <button onClick={handleLogout} className="nav-item nav-logout-btn">
          Déconnexion
        </button>
      </div>
    </header>
  );
}