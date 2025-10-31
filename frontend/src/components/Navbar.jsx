import React from "react";
import "../styles/Navbar.css";
// NOTE: Ensure your logo.png is a clear, high-resolution image, ideally on a transparent background.
import logo from "../assets/logo.png"; 

export default function Navbar() {
  // Function to smoothly scroll to sections by ID
  const scrollToSection = (id) => {
    // Basic polyfill for window behavior, assuming IDs match buttons
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn(`Section with ID: ${id} not found for smooth scroll.`);
    }
  };

  return (
    <header className="pink-navbar">
      {/* --- Left: Logo & Brand Name --- */}
      <div className="navbar-brand" onClick={() => scrollToSection("accueil")}>
        {/* Replace the src with your high-res logo path */}
        <img src={logo} alt="PinkHope logo" className="brand-logo" />
        <span className="brand-text">PinkHope</span>
      </div>

      {/* --- Right: Navigation Links --- */}
      <div className="navbar-links">
        {/* Using button to trigger smooth scroll for internal links */}
        <button onClick={() => scrollToSection("accueil")} className="nav-item">Accueil</button>
        <button onClick={() => scrollToSection("about")} className="nav-item">About Us</button>
        <button onClick={() => scrollToSection("contact")} className="nav-item">Contact</button>
        
        {/* Direct links for external/auth pages */}
        <a href="/login" className="nav-item nav-login-btn">Connexion</a>
        <a href="/register" className="nav-item nav-register-btn">Register</a>
      </div>
    </header>
  );
}
