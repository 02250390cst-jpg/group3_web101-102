// Script to sync user profile images to their respective restaurant if missing
const prisma = require('../src/config/prisma');

async function syncProfileImages() {
  const owners = await prisma.user.findMany({
    where: {
      role: 'OWNER',
      profileImage: { not: null },
    },
    select: {
      id: true,
      profileImage: true,
      restaurants: true,
    },
  });

  for (const owner of owners) {
    for (const restaurant of owner.restaurants) {
      if (!restaurant.profileImage) {
        await prisma.restaurant.update({
          where: { id: restaurant.id },
          data: { profileImage: owner.profileImage },
        });
        console.log(`Updated restaurant ${restaurant.id} with owner's profile image.`);
      }
    }
  }
  console.log('Sync complete.');
  await prisma.$disconnect();
}

syncProfileImages().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
