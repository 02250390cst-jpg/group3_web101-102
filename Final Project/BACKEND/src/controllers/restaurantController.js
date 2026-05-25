
// Import Prisma client for database access
const prisma = require('../config/prisma');


// Create a new restaurant for the authenticated owner
const createRestaurant = async (req, res, next) => {
  try {
    const { name, location, description, profileImage } = req.body;

    // Create the restaurant
    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        location,
        description: description || null,
        profileImage: profileImage || null,
        ownerId: req.user.id,
      },
    });

    return res.status(201).json(restaurant);
  } catch (error) {
    return next(error);
  }
};


// List all restaurants, optionally filter by name or location
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

    // Fetch restaurants
    const restaurants = await prisma.restaurant.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json(restaurants);
  } catch (error) {
    return next(error);
  }
};


// Get a single restaurant by ID (with menu items)
const getRestaurant = async (req, res, next) => {
  try {
    const restaurantId = Number(req.params.id);

    // Fetch restaurant and its menu items
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


// Update a restaurant (only if owned by current user)
const updateRestaurant = async (req, res, next) => {
  try {
    const restaurantId = Number(req.params.id);
    const { name, location, description, profileImage } = req.body;

    // Check if the restaurant is owned by the user
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id: restaurantId,
        ownerId: req.user.id,
      },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Update the restaurant details
    const updated = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        name: name || restaurant.name,
        location: location || restaurant.location,
        description: description ?? restaurant.description,
        profileImage: profileImage !== undefined ? profileImage : restaurant.profileImage,
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
