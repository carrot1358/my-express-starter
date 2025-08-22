const LineService = require('../services/LineService');

class LineController {
  // Handle LINE OAuth callback
  static async handleCallback(req, res, next) {
    try {
      const { code, state } = req.query;
      
      if (!code) {
        return res.status(400).json({ 
          success: false,
          error: 'Missing authorization code',
          message: 'No authorization code provided'
        });
      }

      const result = await LineService.handleOAuthCallback(code, state);
      res.redirect(result.redirectUrl);
    } catch (error) {
      next(error);
    }
  }

  // Handle LINE webhook
  static async handleWebhook(req, res, next) {
    try {
      const { events } = req.body;
      await LineService.processWebhookEvents(events);
      res.status(200).send('OK');
    } catch (error) {
      next(error);
    }
  }

  // Get LINE login URL
  static async getLoginUrl(req, res, next) {
    try {
      const loginUrl = await LineService.generateLoginUrl();
      res.json({
        success: true,
        data: { loginUrl }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user profile from LINE
  static async getUserProfile(req, res, next) {
    try {
      const { accessToken } = req.query;
      
      if (!accessToken) {
        return res.status(400).json({ 
          success: false,
          error: 'Missing access token',
          message: 'Access token is required'
        });
      }

      const profile = await LineService.getUserProfile(accessToken);
      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LineController;
