
// Import Prisma client for database access
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Helper: get start and end of a specific date
function getDayRange(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}


// Helper: get the restaurant that belongs to the logged-in owner
// JWT gives us user.id (sub), not restaurantId directly
async function getRestaurantId(userId) {
  const restaurant = await prisma.restaurant.findFirst({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
  });
  if (!restaurant) throw new Error('Restaurant not found for this user');
  return restaurant.id;
}


// Get today's total orders and revenue for the restaurant
const getTodayStats = async (req, res) => {
  try {
    const restaurantId = await getRestaurantId(req.user.id);
    const { start, end } = getDayRange(new Date());

    // Fetch completed orders for today
    const orders = await prisma.order.findMany({
      where: {
        restaurantId,
        createdAt: { gte: start, lte: end },
        status: 'COMPLETED',
      },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    res.json({ totalOrders, totalRevenue });
  } catch (error) {
    console.error('getTodayStats error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch today stats' });
  }
};


// Get last 7 days of revenue for the restaurant (for weekly chart)
const getWeeklyRevenue = async (req, res) => {
  try {
    const restaurantId = await getRestaurantId(req.user.id);
    const dayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const result = [];

    // Loop through last 7 days
    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - i);

      const { start, end } = getDayRange(targetDate);

      // Fetch completed orders for the day
      const orders = await prisma.order.findMany({
        where: {
          restaurantId,
          createdAt: { gte: start, lte: end },
          status: 'COMPLETED',
        },
      });

      const revenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      result.push({
        day: dayLabels[targetDate.getDay()],          // e.g. "FRI"
        date: targetDate.toISOString().split('T')[0], // e.g. "2026-05-22"
        revenue,
        isToday: i === 0,
      });
    }

    res.json(result);
  } catch (error) {
    console.error('getWeeklyRevenue error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch weekly revenue' });
  }
};


// Get the latest 10 orders for the restaurant
const getRecentOrders = async (req, res) => {
  try {
    const restaurantId = await getRestaurantId(req.user.id);

    // Fetch latest 10 orders with customer and item details
    const orders = await prisma.order.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        customer: { select: { name: true } },
        items: {
          include: { menuItem: { select: { name: true } } },
        },
      },
    });

    res.json(orders);
  } catch (error) {
    console.error('getRecentOrders error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch recent orders' });
  }
};

module.exports = { getTodayStats, getWeeklyRevenue, getRecentOrders };