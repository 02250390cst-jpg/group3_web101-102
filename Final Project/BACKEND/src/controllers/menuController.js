const prisma = require('../config/prisma');

const createMenuItem = async (req, res, next) => {
  try {
    const restaurantId = Number(req.params.restaurantId);
    const { name, description, price, isAvailable } = req.body;

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description: description || null,
        price,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        restaurantId,
      },
    });

    return res.status(201).json(menuItem);
  } catch (error) {
    return next(error);
  }
};

const listMenuItems = async (req, res, next) => {
  try {
    const restaurantId = Number(req.params.restaurantId);
    const { available } = req.query;

    const where = { restaurantId };
    if (available === 'true') {
      where.isAvailable = true;
    }

    const items = await prisma.menuItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json(items);
  } catch (error) {
    return next(error);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const itemId = Number(req.params.itemId);
    const { name, description, price, isAvailable } = req.body;

    const item = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: { restaurant: true },
    });

    if (!item || item.restaurant.ownerId !== req.user.id) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const updated = await prisma.menuItem.update({
      where: { id: itemId },
      data: {
        name: name || item.name,
        description: description ?? item.description,
        price: price ?? item.price,
        isAvailable: isAvailable ?? item.isAvailable,
      },
    });

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const itemId = Number(req.params.itemId);

    const item = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: { restaurant: true },
    });

    if (!item || item.restaurant.ownerId !== req.user.id) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await prisma.menuItem.delete({
      where: { id: itemId },
    });

    return res.json({ message: 'Menu item deleted' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createMenuItem,
  listMenuItems,
  updateMenuItem,
  deleteMenuItem,
};
