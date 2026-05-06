const prisma = require('../config/prisma');

const createRestaurant = async (req, res, next) => {
  try {
    const { name, location, description } = req.body;

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        location,
        description: description || null,
        ownerId: req.user.id,
      },
    });

    return res.status(201).json(restaurant);
  } catch (error) {
    return next(error);
  }
};

const listRestaurants = async (req, res, next) => {
  try {
    const { q, location } = req.query;

    const where = {};
    if (q) {
      where.name = { contains: q, mode: 'insensitive' };
    }
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    const restaurants = await prisma.restaurant.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json(restaurants);
  } catch (error) {
    return next(error);
  }
};

const getRestaurant = async (req, res, next) => {
  try {
    const restaurantId = Number(req.params.id);

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: { menuItems: true },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    return res.json(restaurant);
  } catch (error) {
    return next(error);
  }
};

const updateRestaurant = async (req, res, next) => {
  try {
    const restaurantId = Number(req.params.id);
    const { name, location, description } = req.body;

    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id: restaurantId,
        ownerId: req.user.id,
      },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const updated = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        name: name || restaurant.name,
        location: location || restaurant.location,
        description: description ?? restaurant.description,
      },
    });

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createRestaurant,
  listRestaurants,
  getRestaurant,
  updateRestaurant,
};
