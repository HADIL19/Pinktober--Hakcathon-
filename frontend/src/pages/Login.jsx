import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Connexion à PinkHope
        </h2>
        <form className="space-y-4">
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
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Vous n’avez pas de compte ?{" "}
          <Link to="/register" className="text-pink-600 hover:underline">
            S’inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
