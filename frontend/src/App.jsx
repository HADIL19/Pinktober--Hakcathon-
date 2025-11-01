import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Donateur from "./pages/Donateur";
import Sponsor from "./pages/Sponsor";
import Investisseur from "./pages/Investisseur";
import PorteurProjet from "./pages/PorteurProjet";
import ProjectsMarketplace from "./components/ProjectsMarketplace";
import ProjectDetails from './components/ProjectDetails';
import InvestmentForm from './components/InvestmentForm';
import ProjectContacts from './components/ProjectContacts';
import InvestorLayout from './components/InvestorLayout';
import MyInvestments from './components/MyInvestments'




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
          <Route path="/investisseur" element={
            <InvestorLayout>
            <Investisseur />
            </InvestorLayout>} />
          <Route path="/porteur-projet" element={<PorteurProjet />} />
          <Route path="/ProjectsMarketplace" element={
            <InvestorLayout>
            <ProjectsMarketplace />
            </InvestorLayout>} />
          <Route path="/project/:id" element={
            <InvestorLayout>
            <ProjectDetails />
            </InvestorLayout>} />
          <Route path="/invest/:id" element={
            <InvestorLayout>
            <InvestmentForm />
            </InvestorLayout>} />
          <Route path="/contacts" element={
            <InvestorLayout>
            <ProjectContacts />
            </InvestorLayout>} />

            <Route path="/my-investments" element={<MyInvestments />} />
          
        </Routes>
        
      </div>
    </Router>
  );
}
