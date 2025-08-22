const axios = require('axios');
const querystring = require('querystring');
const config = require('@/config/config');

class LineService {
  // Handle LINE OAuth callback
  static async handleOAuthCallback(code, state) {
    try {
      // Exchange authorization code for access token
      const tokenResponse = await axios.post('https://api.line.me/oauth2/v2.1/token',
        querystring.stringify({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: config.line.callbackUrl,
          client_id: config.line.channelId,
          client_secret: config.line.channelSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { access_token, id_token } = tokenResponse.data;

      // Get user profile from LINE
      const profile = await this.getUserProfile(access_token);

      // Check if user with this LINE ID already exists in database
      const UserService = require('@/services/UserService');
      const existingUser = await UserService.findUserByLineId(profile.userId);

      let redirectUrl;
      if (existingUser) {
        // Existing user - redirect to login success page
        redirectUrl = `${config.line.redirectFrontendUrl}/?name=${encodeURIComponent(profile.displayName)}&picture=${encodeURIComponent(profile.pictureUrl)}&lineId=${encodeURIComponent(profile.userId)}&existing=true`;
      } else {
        // New user - redirect to registration form
        redirectUrl = `${config.line.redirectFrontendUrl}/?name=${encodeURIComponent(profile.displayName)}&picture=${encodeURIComponent(profile.pictureUrl)}&lineId=${encodeURIComponent(profile.userId)}`;
      }

      return { redirectUrl, profile, access_token, id_token };
    } catch (error) {
      console.error('LINE OAuth callback error:', error.response?.data || error.message);
      throw new Error('Failed to process LINE OAuth callback');
    }
  }

  // Complete LINE registration with additional user data
  static async completeLineRegistration(registrationData) {
    try {
      const { lineId, username, password, phone, firstName, lastName } = registrationData;

      // Validate required fields
      if (!lineId || !username || !password || !firstName || !lastName) {
        const error = new Error('LINE ID, username, password, first name, and last name are required');
        error.name = 'ValidationError';
        throw error;
      }

      // Check if user with this LINE ID already exists
      const UserService = require('@/services/UserService');
      const existingUser = await UserService.findUserByLineId(lineId);
      
      if (existingUser) {
        const error = new Error('User with this LINE ID already exists');
        error.name = 'ValidationError';
        throw error;
      }

      // Hash password
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user with LINE ID
      const userData = {
        username,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        lineId,
        role: 'USER'
      };

      const newUser = await UserService.createUser(userData);

      // Generate JWT token
      const AuthService = require('@/services/AuthService');
      const token = AuthService.generateToken(newUser);

      // Return user data without password and token
      const { password: _, ...userWithoutPassword } = newUser;

      return {
        user: userWithoutPassword,
        token,
        expiresIn: config.jwt.expiresIn
      };
    } catch (error) {
      console.error('Complete LINE registration error:', error);
      throw error;
    }
  }

  // Process LINE webhook events
  static async processWebhookEvents(events) {
    try {
      for (const event of events) {
        if (event.type === 'message' && event.message.type === 'text') {
          await this.replyToMessage(event.replyToken, event.message.text);
        }
      }
    } catch (error) {
      console.error('Process webhook events error:', error);
      throw new Error('Failed to process webhook events');
    }
  }

  // Reply to LINE message
  static async replyToMessage(replyToken, userMessage) {
    try {
      await axios.post('https://api.line.me/v2/bot/message/reply',
        {
          replyToken: replyToken,
          messages: [
            {
              type: 'text',
              text: `คุณพิมพ์ว่า: ${userMessage}`,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LINE_MESSAGING_TOKEN}`,
          },
        }
      );
    } catch (error) {
      console.error('Reply to message error:', error.response?.data || error.message);
      throw new Error('Failed to reply to message');
    }
  }

  // Generate LINE login URL
  static async generateLoginUrl() {
    try {
      const state = Math.random().toString(36).substring(7);
      const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${config.line.channelId}&redirect_uri=${encodeURIComponent(config.line.callbackUrl)}&state=${state}&scope=profile%20openid`;
      return loginUrl;
    } catch (error) {
      console.error('Generate login URL error:', error);
      throw new Error('Failed to generate login URL');
    }
  }

  // Get user profile from LINE
  static async getUserProfile(accessToken) {
    try {
      const profileResponse = await axios.get('https://api.line.me/v2/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return profileResponse.data;
    } catch (error) {
      console.error('Get user profile error:', error.response?.data || error.message);
      throw new Error('Failed to get user profile');
    }
  }

  // Send message to user
  static async sendMessage(userId, message) {
    try {
      await axios.post('https://api.line.me/v2/bot/message/push',
        {
          to: userId,
          messages: [
            {
              type: 'text',
              text: message,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LINE_MESSAGING_TOKEN}`,
          },
        }
      );
    } catch (error) {
      console.error('Send message error:', error.response?.data || error.message);
      throw new Error('Failed to send message');
    }
  }
}

module.exports = LineService;
