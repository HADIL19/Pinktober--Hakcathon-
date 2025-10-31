import Navbar from "../components/Navbar";

export default function Sponsor() {
  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Navbar />
      <section className="flex flex-col items-center justify-center text-center flex-grow py-20 px-6">
        <h2 className="text-3xl font-bold text-pink-600 mb-4">
          Espace Sponsor
        </h2>
        <p className="max-w-xl mb-8">
          Participez à la lutte contre le cancer en sponsorisant du matériel ou des technologies pour les hôpitaux.
        </p>
        <button className="bg-pink-600 text-white px-8 py-4 rounded-xl hover:bg-pink-700 transition">
          Sponsoriser du matériel / équipement
        </button>
      </section>
    </div>
  );
}
