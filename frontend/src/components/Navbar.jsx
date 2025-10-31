import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-white shadow px-6 md:px-16 py-4">
      <Link to="/" className="text-2xl font-bold text-pink-600">
        PinkHope
      </Link>
      <div className="flex gap-6 text-gray-700">
        <a href="#roles" className="hover:text-pink-600">Donateur / Sponsor</a>
        <a href="#roles" className="hover:text-pink-600">Porteur de Projet</a>
        <a href="#roles" className="hover:text-pink-600">Investisseur</a>
      </div>
    </nav>
  );
}
