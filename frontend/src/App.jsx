import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Donateur from "./pages/Donateur";
import Sponsor from "./pages/Sponsor";
import Investisseur from "./pages/Investisseur";
import PorteurProjet from "./pages/PorteurProjet";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/donateur" element={<Donateur />} />
          <Route path="/sponsor" element={<Sponsor />} />
          <Route path="/investisseur" element={<Investisseur />} />
          <Route path="/porteur-projet" element={<PorteurProjet />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
