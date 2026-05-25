
// Import Prisma client for database access
const prisma = require('../config/prisma');


// Get top 10 selling menu items for a restaurant
const topItems = async (req, res, next) => {
  try {
    const restaurantId = Number(req.params.restaurantId); // Get restaurant ID from params

    // Find the restaurant owned by the current user
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Group order items by menuItemId for completed orders
    const grouped = await prisma.orderItem.groupBy({
      by: ['menuItemId'],
      where: {
        order: {
          restaurantId,
          status: 'COMPLETED',
        },
      },
      _sum: { quantity: true, lineTotal: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    });

    // Get menu item details for the top items
    const menuItemIds = grouped.map((item) => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    });

    // Map menu item IDs to their details
    const menuItemMap = new Map(menuItems.map((item) => [item.id, item]));

    // Build result array with name, quantity, and revenue
    const results = grouped.map((item) => ({
      menuItemId: item.menuItemId,
      name: menuItemMap.get(item.menuItemId)?.name || 'Unknown',
      totalQuantity: item._sum.quantity || 0,
      totalRevenue: item._sum.lineTotal || 0,
    }));

    return res.json(results);
  } catch (error) {
    return next(error);
  }
};


// Get top 10 customers by total spent for a restaurant
const topCustomers = async (req, res, next) => {
  try {
    const restaurantId = Number(req.params.restaurantId); // Get restaurant ID from params

    // Find the restaurant owned by the current user
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Group completed orders by customerId
    const grouped = await prisma.order.groupBy({
      by: ['customerId'],
      where: {
        restaurantId,
        status: 'COMPLETED',
      },
      _sum: { totalAmount: true },
      _count: { id: true },
      orderBy: { _sum: { totalAmount: 'desc' } },
      take: 10,
    });

    // Get customer details for the top customers
    const customerIds = grouped.map((item) => item.customerId);
    const customers = await prisma.user.findMany({
      where: { id: { in: customerIds } },
      select: { id: true, name: true, email: true },
    });

    // Map customer IDs to their details
    const customerMap = new Map(customers.map((item) => [item.id, item]));

    // Build result array with customer info, total spent, and order count
    const results = grouped.map((item) => ({
      customerId: item.customerId,
      customer: customerMap.get(item.customerId) || null,
      totalSpent: item._sum.totalAmount || 0,
      orderCount: item._count.id || 0,
    }));

    return res.json(results);
  } catch (error) {
    return next(error);
  }
};


// Get last 7 days of daily revenue for a restaurant (fills missing days with 0)
const dailyRevenue = async (req, res, next) => {
  try {
    const restaurantId = Number(req.params.restaurantId); // Get restaurant ID from params
    // Find the restaurant owned by the current user
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id },
    });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    // Get last 7 days (including today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    // Query daily revenues for the last 7 days
    const revenues = await prisma.dailyRevenue.findMany({
      where: {
        restaurantId,
        date: {
          gte: sevenDaysAgo,
          lte: today,
        },
      },
      orderBy: { date: 'asc' },
    });
    // Fill in missing days with 0 revenue
    const result = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(sevenDaysAgo.getDate() + i);
      d.setHours(0, 0, 0, 0);
      // Find revenue for this day, or 0 if missing
      const found = revenues.find(r => r.date.toISOString().slice(0, 10) === d.toISOString().slice(0, 10));
      result.push({
        date: d.toISOString().slice(0, 10),
        revenue: found ? Number(found.revenue) : 0,
      });
    }
    // Add comparison with previous day (diff)
    for (let i = 1; i < result.length; i++) {
      result[i].diff = result[i].revenue - result[i - 1].revenue;
    }
    result[0].diff = 0;
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  topItems,
  topCustomers,
  dailyRevenue,
};
