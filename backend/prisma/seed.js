import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌸 Insertion des données de test Pinktober...');

  // --- Sponsors ---
  await prisma.sponsor.createMany({
    data: [
      {
        name: "PinkHope Foundation",
        logo: "https://example.com/pinkhope.png",
        description: "Organisation caritative dédiée à la sensibilisation au cancer du sein.",
        contactEmail: "contact@pinkhope.org",
        contactPhone: "+213550000001",
        website: "https://pinkhope.org",
        sponsorshipType: "Gold",
        totalAmount: 15000,
        categories: ["health", "awareness", "charity"],
      },
      {
        name: "Beauty4Hope",
        logo: "https://example.com/beauty4hope.png",
        description: "Marque de cosmétique engagée pour la cause Pinktober.",
        contactEmail: "hello@beauty4hope.com",
        contactPhone: "+213550000002",
        website: "https://beauty4hope.com",
        sponsorshipType: "Silver",
        totalAmount: 7000,
        categories: ["beauty", "fashion"],
      },
      {
        name: "FitLife Gym",
        logo: "https://example.com/fitlife.png",
        description: "Chaîne de salles de sport soutenant la recherche contre le cancer du sein.",
        contactEmail: "info@fitlife.com",
        contactPhone: "+213550000003",
        website: "https://fitlife.com",
        sponsorshipType: "Bronze",
        totalAmount: 4000,
        categories: ["fitness", "health"],
      }
    ]
  });

  // --- Sponsorships ---
  await prisma.sponsorship.createMany({
    data: [
      { sponsorId: 1, itemName: "Pink Awareness Marathon", itemCategory: "Event", amount: 8000, description: "Sponsoring de l’événement sportif Pink Marathon 2025.", duration: 30 },
      { sponsorId: 2, itemName: "Cosmetic Campaign", itemCategory: "Marketing", amount: 5000, description: "Campagne de sensibilisation en partenariat avec Beauty4Hope.", duration: 45 },
      { sponsorId: 3, itemName: "Gym Pink Challenge", itemCategory: "Health", amount: 2000, description: "Challenge fitness pour collecter des dons Pinktober.", duration: 15 }
    ]
  });

  // --- Sponsorship Requests ---
  await prisma.sponsorshipRequest.createMany({
    data: [
      { companyName: "Happy Drinks", contactName: "Sarah Lamine", contactEmail: "sarah@happydrinks.com", contactPhone: "+213550000010", message: "Nous souhaitons participer à Pinktober en tant que sponsor argent.", requestedAmount: 3000, requestedType: "Silver", categories: ["food", "wellness"] },
      { companyName: "Tech4Her", contactName: "Yasmine Bouali", contactEmail: "yasmine@tech4her.io", message: "Nous voulons soutenir les initiatives technologiques pour Pinktober.", requestedAmount: 8000, requestedType: "Gold", categories: ["tech", "innovation"] }
    ]
  });

  console.log("✅ Base de données remplie avec succès !");
}

main()
  .catch(e => {
    console.error("❌ Erreur lors du seed :", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
