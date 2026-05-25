
// Import Prisma client for database access
const prisma = require('../config/prisma');


// Create a new menu item for a restaurant
const createMenuItem = async (req, res, next) => {
  try {
    const restaurantId = Number(req.params.restaurantId); // Get restaurant ID from params
    const { name, description, price, isAvailable, image } = req.body;

    // Find the restaurant owned by the current user
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Create the menu item
    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description: description || null,
        price,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        restaurantId,
        image: image || null,
      },
    });

    return res.status(201).json(menuItem);
  } catch (error) {
    return next(error);
  }
};


// List all menu items for a restaurant, optionally filter by availability
const listMenuItems = async (req, res, next) => {
  try {
    const restaurantId = Number(req.params.restaurantId);
    const { available } = req.query;

    const where = { restaurantId };
    if (available === 'true') {
      where.isAvailable = true;
    }

    // Fetch menu items
    const items = await prisma.menuItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json(items);
  } catch (error) {
    return next(error);
  }
};


// Update a menu item (only if owned by current user)
const updateMenuItem = async (req, res, next) => {
  try {
    const itemId = Number(req.params.itemId);
    const { name, description, price, isAvailable, image } = req.body;

    // Find the menu item and check ownership
    const item = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: { restaurant: true },
    });

    if (!item || item.restaurant.ownerId !== req.user.id) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Update the menu item
    const updated = await prisma.menuItem.update({
      where: { id: itemId },
      data: {
        name: name || item.name,
        description: description ?? item.description,
        price: price ?? item.price,
        isAvailable: isAvailable ?? item.isAvailable,
        image: image !== undefined ? image : item.image,
      },
    });

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};


// Delete a menu item (only if owned by current user)
const deleteMenuItem = async (req, res, next) => {
  try {
    const itemId = Number(req.params.itemId);

    // Find the menu item and check ownership
    const item = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: { restaurant: true },
    });

    if (!item || item.restaurant.ownerId !== req.user.id) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Delete the menu item
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
