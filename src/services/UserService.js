const { PrismaClient } = require('@prisma/client');

// Single Prisma client instance
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

class UserService {
  // Get all users
  static async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
          role: true,
          lineId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return users;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }

  // Get user by ID
  static async getUserById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: id },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
          role: true,
          lineId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  }

  // Create new user
  static async createUser(userData) {
    try {
      const { 
        username, 
        password, 
        firstName, 
        lastName, 
        phone, 
        email, 
        lineId, 
        role = 'USER' 
      } = userData;

      // Validate required fields
      if (!username || !firstName || !lastName) {
        const error = new Error('Username, first name, and last name are required');
        error.name = 'ValidationError';
        throw error;
      }

      // Validate email format if provided
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          const error = new Error('Invalid email format');
          error.name = 'ValidationError';
          throw error;
        }
      }

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username },
            { email: email || null },
            { lineId: lineId || null }
          ].filter(condition => Object.values(condition)[0] !== null)
        }
      });

      if (existingUser) {
        const error = new Error('User already exists with this username, email, or LINE ID');
        error.name = 'ValidationError';
        throw error;
      }

      const newUser = await prisma.user.create({
        data: {
          username,
          password: password || '',
          firstName,
          lastName,
          phone: phone || null,
          email: email || null,
          lineId: lineId || null,
          role,
        },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
          role: true,
          lineId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return newUser;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  // Update user
  static async updateUser(id, updateData) {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: id }
      });

      if (!existingUser) {
        return null;
      }

      // Validate update data
      const { 
        username, 
        firstName, 
        lastName, 
        phone, 
        email, 
        lineId, 
        role 
      } = updateData;
      
      if (email) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          const error = new Error('Invalid email format');
          error.name = 'ValidationError';
          throw error;
        }

        // Check if email is already taken by another user
        const emailExists = await prisma.user.findFirst({
          where: {
            email,
            NOT: { id: id }
          }
        });

        if (emailExists) {
          const error = new Error('Email already taken by another user');
          error.name = 'ValidationError';
          throw error;
        }
      }

      if (username) {
        // Check if username is already taken by another user
        const usernameExists = await prisma.user.findFirst({
          where: {
            username,
            NOT: { id: id }
          }
        });

        if (usernameExists) {
          const error = new Error('Username already taken by another user');
          error.name = 'ValidationError';
          throw error;
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: id },
        data: {
          ...(username && { username }),
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(phone !== undefined && { phone }),
          ...(email !== undefined && { email }),
          ...(lineId !== undefined && { lineId }),
          ...(role && { role }),
        },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
          role: true,
          lineId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedUser;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  // Delete user
  static async deleteUser(id) {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: id }
      });

      if (!existingUser) {
        return false;
      }

      await prisma.user.delete({
        where: { id: id }
      });

      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  // Find user by LINE ID
  static async findUserByLineId(lineId) {
    try {
      const user = await prisma.user.findFirst({
        where: { lineId },
        select: {
          id: true,
          email: true,
          name: true,
          lineId: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      console.error('Find user by LINE ID error:', error);
      throw error;
    }
  }

  // Find user by username or email (for login)
  static async findUserByIdentifier(identifier) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { username: identifier },
            { email: identifier },
            { phone: identifier }
          ]
        },
        select: {
          id: true,
          username: true,
          password: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
          role: true,
          lineId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      console.error('Find user by identifier error:', error);
      throw error;
    }
  }

  // Create or update user from LINE profile
  static async createOrUpdateUserFromLine(lineProfile) {
    try {
      const { userId, displayName, pictureUrl } = lineProfile;

      let user = await this.findUserByLineId(userId);

      if (user) {
        // Update existing user
        user = await this.updateUser(user.id, {
          firstName: displayName,
        });
      } else {
        // Create new user
        user = await this.createUser({
          username: `line_${userId}`,
          firstName: displayName,
          lastName: 'User',
          lineId: userId,
          email: `${userId}@line.user`,
          role: 'USER',
        });
      }

      return user;
    } catch (error) {
      console.error('Create or update user from LINE error:', error);
      throw error;
    }
  }
}

module.exports = UserService;
