const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const UserService = require('./UserService');

class AuthService {
  // Generate JWT token with user data including role
  static generateToken(user) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  }

  // Login with username/email and password
  static async login(identifier, password) {
    try {
      // Find user by username or email
      const user = await UserService.findUserByIdentifier(identifier);
      
      if (!user) {
        const error = new Error('Invalid credentials');
        error.name = 'AuthenticationError';
        throw error;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        const error = new Error('Invalid credentials');
        error.name = 'AuthenticationError';
        throw error;
      }

      // Generate token
      const token = this.generateToken(user);

      // Return user data without password and token
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        user: userWithoutPassword,
        token,
        expiresIn: config.jwt.expiresIn
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register new user
  static async register(userData) {
    try {
      const { username, password, email, firstName, lastName, role = 'USER' } = userData;

      // Validate required fields
      if (!username || !password || !firstName || !lastName) {
        const error = new Error('Username, password, first name, and last name are required');
        error.name = 'ValidationError';
        throw error;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const newUser = await UserService.createUser({
        username,
        password: hashedPassword,
        email,
        firstName,
        lastName,
        role
      });

      // Generate token
      const token = this.generateToken(newUser);

      // Return user data without password and token
      const { password: _, ...userWithoutPassword } = newUser;

      return {
        user: userWithoutPassword,
        token,
        expiresIn: config.jwt.expiresIn
      };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  // Refresh token
  static async refreshToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      
      // Get fresh user data
      const user = await UserService.getUserById(decoded.id);
      
      if (!user) {
        const error = new Error('User not found');
        error.name = 'AuthenticationError';
        throw error;
      }

      // Generate new token
      const newToken = this.generateToken(user);

      return {
        token: newToken,
        expiresIn: config.jwt.expiresIn
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }

  // Create or update user from LINE login
  static async loginWithLine(lineProfile) {
    try {
      const user = await UserService.createOrUpdateUserFromLine(lineProfile);
      
      // Generate token
      const token = this.generateToken(user);

      // Return user data without password and token
      const { password: _, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        token,
        expiresIn: config.jwt.expiresIn
      };
    } catch (error) {
      console.error('LINE login error:', error);
      throw error;
    }
  }
}

module.exports = AuthService;