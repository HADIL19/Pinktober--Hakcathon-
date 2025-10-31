const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.sponsor.createMany({
    data: [
      {
        name: "PinkHope Foundation",
        logo: "https://example.com/logo1.png",
        description: "Une organisation dédiée à la sensibilisation au cancer du sein.",
        contactEmail: "contact@pinkhope.org",
        website: "https://pinkhope.org",
        sponsorshipType: "Gold",
        totalAmount: 10000,
        categories: JSON.stringify(["health", "awareness"])
      },
      {
        name: "Beauty4Hope",
        logo: "https://example.com/logo2.png",
        description: "Marque de cosmétique partenaire du mouvement Pinktober.",
        contactEmail: "hello@beauty4hope.com",
        website: "https://beauty4hope.com",
        sponsorshipType: "Silver",
        totalAmount: 5000,
        categories: JSON.stringify(["fashion", "beauty"])
      }
    ]
  });

  console.log("🌸 Données sponsors insérées avec succès !");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
