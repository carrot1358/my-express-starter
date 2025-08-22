const AuthService = require('../services/AuthService');

class AuthController {
  // Register new user
  static async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: result.user,
          token: result.token,
          expiresIn: result.expiresIn
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Login user
  static async login(req, res, next) {
    try {
      const { identifier, password } = req.body;
      
      if (!identifier || !password) {
        return res.status(400).json({
          success: false,
          error: 'Username/email/phone and password are required'
        });
      }

      const result = await AuthService.login(identifier, password);
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          token: result.token,
          expiresIn: result.expiresIn
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Refresh token
  static async refreshToken(req, res, next) {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Token is required'
        });
      }

      const result = await AuthService.refreshToken(token);
      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current user profile
  static async getProfile(req, res, next) {
    try {
      // req.user is set by authenticateToken middleware
      res.json({
        success: true,
        data: req.user
      });
    } catch (error) {
      next(error);
    }
  }

  // LINE OAuth login
  static async loginWithLine(req, res, next) {
    try {
      const lineProfile = req.body;
      const result = await AuthService.loginWithLine(lineProfile);
      
      res.json({
        success: true,
        message: 'LINE login successful',
        data: {
          user: result.user,
          token: result.token,
          expiresIn: result.expiresIn
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;