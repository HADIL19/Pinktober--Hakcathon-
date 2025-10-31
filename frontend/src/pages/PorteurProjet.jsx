import Navbar from "../components/Navbar";

export default function PorteurProjet() {
  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Navbar />
      <section className="flex flex-col items-center justify-center text-center flex-grow py-20 px-6">
        <h2 className="text-3xl font-bold text-pink-600 mb-4">
          Espace Porteur de Projet
        </h2>
        <p className="max-w-xl mb-8">
          Soumettez et gérez vos projets de recherche, d’innovation ou de sensibilisation contre le cancer.
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          <button className="bg-pink-600 text-white px-8 py-4 rounded-xl hover:bg-pink-700 transition">
            Soumettre un projet
          </button>
          <button className="border border-pink-600 text-pink-600 px-8 py-4 rounded-xl hover:bg-pink-100 transition">
            Gérer mes projets
          </button>
        </div>
      </section>
    </div>
  );
}
