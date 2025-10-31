import Navbar from "../components/Navbar";

export default function Investisseur() {
  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Navbar />
      <section className="flex flex-col items-center justify-center text-center flex-grow py-20 px-6">
        <h2 className="text-3xl font-bold text-pink-600 mb-4">
          Espace Investisseur
        </h2>
        <p className="max-w-xl mb-8">
          Explorez des projets de recherche et d’innovation liés à la lutte contre le cancer.
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          <button className="bg-pink-600 text-white px-8 py-4 rounded-xl hover:bg-pink-700 transition">
            Parcourir les projets
          </button>
          <button className="border border-pink-600 text-pink-600 px-8 py-4 rounded-xl hover:bg-pink-100 transition">
            Filtrer par impact / localisation
          </button>
        </div>
      </section>
    </div>
  );
}
