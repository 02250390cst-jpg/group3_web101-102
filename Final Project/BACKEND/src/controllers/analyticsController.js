const prisma = require('../config/prisma');

const topItems = async (req, res, next) => {
  try {
    const restaurantId = Number(req.params.restaurantId);

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

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

    const menuItemIds = grouped.map((item) => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    });

    const menuItemMap = new Map(menuItems.map((item) => [item.id, item]));

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

const topCustomers = async (req, res, next) => {
  try {
    const restaurantId = Number(req.params.restaurantId);

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

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

    const customerIds = grouped.map((item) => item.customerId);
    const customers = await prisma.user.findMany({
      where: { id: { in: customerIds } },
      select: { id: true, name: true, email: true },
    });

    const customerMap = new Map(customers.map((item) => [item.id, item]));

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

module.exports = {
  topItems,
  topCustomers,
};
