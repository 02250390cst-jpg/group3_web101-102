// scripts/clearDevData.js
// Run this script with: node scripts/clearDevData.js
// This will delete ALL data from your development database. Use with caution!

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Adjust these deletes based on your schema relations (order matters for foreign keys)
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();
  // Add more tables if you have them (e.g., customer, address, etc.)
  // await prisma.customer.deleteMany();
  // await prisma.address.deleteMany();
  console.log('All development data cleared!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
