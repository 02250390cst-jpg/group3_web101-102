const { Prisma } = require('@prisma/client');
const prisma = require('../config/prisma');

const placeOrder = async (req, res, next) => {
  try {
    const { restaurantId, items } = req.body;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(422).json({ message: 'Order items are required' });
    }

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

    const menuItemMap = new Map(menuItems.map((item) => [item.id, item]));

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

const listRestaurantOrders = async (req, res, next) => {
  try {
    const restaurantId = Number(req.params.restaurantId);

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

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

const updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = Number(req.params.orderId);
    const { status } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { restaurant: true },
    });

    if (!order || order.restaurant.ownerId !== req.user.id) {
      return res.status(404).json({ message: 'Order not found' });
    }

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
