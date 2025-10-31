import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Créer un compte PinkHope
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Nom complet</label>
            <input
              type="text"
              placeholder="Ex: Yasmine Benali"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-pink-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="votre@email.com"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-pink-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Mot de passe</label>
            <input
              type="password"
              placeholder="********"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-pink-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Rôle</label>
            <select
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-pink-400 outline-none"
            >
              <option value="">-- Sélectionnez votre rôle --</option>
              <option value="donateur">Donateur Individuel</option>
              <option value="sponsor">Sponsor Entreprise</option>
              <option value="investisseur">Investisseur</option>
              <option value="porteur">Porteur de Projet</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition"
          >
            S’inscrire
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Vous avez déjà un compte ?{" "}
          <Link to="/login" className="text-pink-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
