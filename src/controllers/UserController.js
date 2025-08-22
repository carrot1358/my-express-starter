const UserService = require('../services/UserService');

class UserController {
  // Get all users
  static async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      res.json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      next(error); // Pass error to Express error handler
    }
  }

  // Get user by ID
  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          error: 'User not found',
          message: `No user found with ID ${id}`
        });
      }
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new user
  static async createUser(req, res, next) {
    try {
      const userData = req.body;
      const newUser = await UserService.createUser(userData);
      
      res.status(201).json({
        success: true,
        data: newUser,
        message: 'User created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user
  static async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedUser = await UserService.updateUser(id, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ 
          success: false,
          error: 'User not found',
          message: `No user found with ID ${id}`
        });
      }
      
      res.json({
        success: true,
        data: updatedUser,
        message: 'User updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete user
  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await UserService.deleteUser(id);
      
      if (!deleted) {
        return res.status(404).json({ 
          success: false,
          error: 'User not found',
          message: `No user found with ID ${id}`
        });
      }
      
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
