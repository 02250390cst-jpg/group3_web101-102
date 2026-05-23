const prisma = require('../src/config/prisma');

async function printRestaurantImages() {
  const restaurants = await prisma.restaurant.findMany({
    select: { id: true, name: true, profileImage: true }
  });
  console.table(restaurants);
  await prisma.$disconnect();
}

printRestaurantImages();
