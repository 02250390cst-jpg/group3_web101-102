
// Import Prisma client and types
const { Prisma } = require('@prisma/client');
const prisma = require('../config/prisma');


// Place a new order for a restaurant
const placeOrder = async (req, res, next) => {
  try {
    const { restaurantId, items } = req.body;

    // Find the restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Validate order items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(422).json({ message: 'Order items are required' });
    }

    // Get menu items and check availability
    const menuItemIds = items.map((item) => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
        restaurantId: restaurantId,
        isAvailable: true,
      },
    });

    if (menuItems.length !== menuItemIds.length) {
      return res.status(422).json({ message: 'Some menu items are invalid or unavailable' });
    }

    // Map menu item IDs to their details
    const menuItemMap = new Map(menuItems.map((item) => [item.id, item]));

    // Calculate total amount and build order items data
    let totalAmount = new Prisma.Decimal(0);
    const orderItemsData = items.map((item) => {
      const menuItem = menuItemMap.get(item.menuItemId);
      const quantity = Number(item.quantity);
      const unitPrice = menuItem.price;
      const lineTotal = unitPrice.mul(quantity);
      totalAmount = totalAmount.plus(lineTotal);

      return {
        menuItemId: menuItem.id,
        quantity,
        unitPrice,
        lineTotal,
      };
    });

    // Create order and order items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          customerId: req.user.id,
          restaurantId: restaurantId,
          totalAmount,
        },
      });

      await tx.orderItem.createMany({
        data: orderItemsData.map((item) => ({
          ...item,
          orderId: createdOrder.id,
        })),
      });

      // Update or create daily revenue for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      await tx.dailyRevenue.upsert({
        where: {
          restaurantId_date: {
            restaurantId: restaurantId,
            date: today,
          },
        },
        update: {
          revenue: { increment: totalAmount },
        },
        create: {
          restaurantId: restaurantId,
          date: today,
          revenue: totalAmount,
        },
      });

      // Return the created order with items
      return tx.order.findUnique({
        where: { id: createdOrder.id },
        include: {
          items: {
            include: { menuItem: true },
          },
        },
      });
    });

    return res.status(201).json(order);
  } catch (error) {
    return next(error);
  }
};


// List all orders placed by the authenticated customer
const listMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { menuItem: true } },
        restaurant: true,
      },
    });

    return res.json(orders);
  } catch (error) {
    return next(error);
  }
};


// List all orders for a restaurant (only if owned by current user)
const listRestaurantOrders = async (req, res, next) => {
  try {
    const restaurantId = Number(req.params.restaurantId);

    // Check if the restaurant is owned by the user
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Fetch all orders for the restaurant
    const orders = await prisma.order.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { menuItem: true } },
        customer: true,
      },
    });

    return res.json(orders);
  } catch (error) {
    return next(error);
  }
};


// Update the status of an order (only if owned by current user)
const updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = Number(req.params.orderId);
    const { status } = req.body;

    // Find the order and check ownership
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { restaurant: true },
    });

    if (!order || order.restaurant.ownerId !== req.user.id) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the order status
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  placeOrder,
  listMyOrders,
  listRestaurantOrders,
  updateOrderStatus,
};
