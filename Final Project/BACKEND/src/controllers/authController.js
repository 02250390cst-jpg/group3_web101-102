
// Import dependencies and Prisma client
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');


// Helper: sign a JWT token for a user
const signToken = (user) => {
  const payload = {
    sub: user.id,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};


// Register a new user (customer or owner)
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, businessName, location, description } = req.body;
    const normalizedRole = role || 'CUSTOMER';

    // Owners must provide business name and location
    if (normalizedRole === 'OWNER') {
      if (!businessName || !location) {
        return res.status(422).json({ message: 'Business name and location are required for owners' });
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        role: normalizedRole,
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone,
        role: normalizedRole,
      },
    });

    let restaurant = null;
    // If owner, create a restaurant for them
    if (normalizedRole === 'OWNER') {
      restaurant = await prisma.restaurant.create({
        data: {
          name: businessName,
          location,
          description: description || null,
          ownerId: user.id,
        },
      });
    }

    // Sign JWT token
    const token = signToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        businessName: restaurant?.name || null,
        location: restaurant?.location || null,
        restaurantId: restaurant?.id || null,
      },
    });
  } catch (error) {
    return next(error);
  }
};


// Login a user (customer or owner)
const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    let user = null;
    // If role is specified, find user by email and role
    if (role) {
      user = await prisma.user.findFirst({
        where: {
          email,
          role,
        },
      });
    } else {
      // If no role, find all users with this email
      const users = await prisma.user.findMany({
        where: { email },
        orderBy: { createdAt: 'desc' },
      });

      if (users.length === 1) {
        user = users[0];
      } else if (users.length > 1) {
        return res.status(409).json({
          message: 'Multiple accounts exist for this email. Please specify role.',
        });
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password hash
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    let restaurant = null;
    // If owner, get their restaurant
    if (user.role === 'OWNER') {
      restaurant = await prisma.restaurant.findFirst({
        where: { ownerId: user.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    // Sign JWT token
    const token = signToken(user);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        businessName: restaurant?.name || null,
        location: restaurant?.location || null,
        restaurantId: restaurant?.id || null,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
};
