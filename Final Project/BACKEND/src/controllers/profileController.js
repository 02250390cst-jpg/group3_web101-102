// Get profile for authenticated user (owner or customer)
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Fetch user by ID
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    let restaurant = null;
    // If owner, fetch their restaurant
    if (user.role === 'OWNER') {
      restaurant = await prisma.restaurant.findFirst({
        where: { ownerId: user.id },
        orderBy: { createdAt: 'desc' },
      });
    }
    // Return user and restaurant info
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage,
      businessName: restaurant?.name || null,
      location: restaurant?.location || null,
      restaurantId: restaurant?.id || null,
    });
  } catch (error) {
    return next(error);
  }
};
const prisma = require('../config/prisma');

// Update profile for authenticated user (owner or customer)
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, profileImage } = req.body;

    // Only allow update for the authenticated user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details (name, email, phone, profileImage)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || user.name,
        email: email || user.email,
        phone: phone || user.phone,
        profileImage: profileImage || user.profileImage,
      },
    });

    // If owner, also update restaurant profileImage and fetch details
    let restaurant = null;
    if (updatedUser.role === 'OWNER') {
      restaurant = await prisma.restaurant.findFirst({
        where: { ownerId: updatedUser.id },
        orderBy: { createdAt: 'desc' },
      });
      if (restaurant && profileImage) {
        // Update restaurant profile image
        await prisma.restaurant.update({
          where: { id: restaurant.id },
          data: { profileImage },
        });
        // Fetch updated restaurant
        restaurant = await prisma.restaurant.findUnique({ where: { id: restaurant.id } });
      }
    }

    // Return updated user and restaurant info
    return res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      profileImage: updatedUser.profileImage,
      businessName: restaurant?.name || null,
      location: restaurant?.location || null,
      restaurantId: restaurant?.id || null,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  updateProfile,
  getProfile,
};
