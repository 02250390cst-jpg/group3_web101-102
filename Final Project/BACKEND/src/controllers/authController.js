const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const signToken = (user) => {
  const payload = {
    sub: user.id,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role, businessName, location, description } = req.body;
    const normalizedRole = role || 'CUSTOMER';

    if (normalizedRole === 'OWNER') {
      if (!businessName || !location) {
        return res.status(422).json({ message: 'Business name and location are required for owners' });
      }
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        role: normalizedRole,
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: normalizedRole,
      },
    });

    let restaurant = null;
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

    const token = signToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
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

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    let user = null;
    if (role) {
      user = await prisma.user.findFirst({
        where: {
          email,
          role,
        },
      });
    } else {
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

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    let restaurant = null;
    if (user.role === 'OWNER') {
      restaurant = await prisma.restaurant.findFirst({
        where: { ownerId: user.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    const token = signToken(user);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
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
