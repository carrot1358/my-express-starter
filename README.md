# LINE WebApp Backend

A Node.js Express backend with MVC architecture for LINE integration.

## Project Structure

```
backend/
├── src/
│   ├── routes/          # Route definitions
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── middleware/      # Custom middleware
│   ├── config/          # Configuration files
│   └── utils/           # Utility functions
├── prisma/              # Database schema and migrations
├── app.js               # Express app configuration
└── server.js            # Server entry point
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/line_webapp"

# LINE API Configuration
LINE_CHANNEL_ID=your_line_channel_id
LINE_CHANNEL_SECRET=your_line_channel_secret
LINE_MESSAGING_TOKEN=your_line_messaging_token
LINE_CALLBACK_URL=http://localhost:5000/api/line/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio (optional)
npx prisma studio
```

### 4. Start Development Server
```bash
npm run dev
```

## API Endpoints

### LINE Integration
- `GET /api/line/login` - Get LINE login URL
- `GET /api/line/callback` - Handle LINE OAuth callback
- `POST /api/line/webhook` - Handle LINE webhook events
- `GET /api/line/profile` - Get user profile from LINE

### User Management
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Health Check
- `GET /api/health` - Server health status

## Architecture

### Routes
- Define API endpoints and connect them to controllers
- Handle HTTP method mapping (GET, POST, PUT, DELETE)

### Controllers
- Handle HTTP requests and responses
- Validate input data
- Call appropriate services
- Return formatted responses

### Services
- Contain business logic
- Handle database operations through Prisma
- Process external API calls (LINE API)
- Return data to controllers

### Middleware
- Authentication and authorization
- Request validation
- Error handling
- Logging

## Features

- ✅ MVC architecture
- ✅ LINE OAuth integration
- ✅ LINE webhook handling
- ✅ User management with Prisma
- ✅ JWT authentication ready
- ✅ Error handling middleware
- ✅ Consistent API responses
- ✅ Environment configuration
- ✅ Database connection management

## Development

### Adding New Features
1. Create service method in appropriate service file
2. Create controller method in appropriate controller file
3. Add route in appropriate route file
4. Update this README with new endpoints

### Database Changes
1. Modify Prisma schema files
2. Run `npx prisma migrate dev` to create migration
3. Run `npx prisma generate` to update client

## Dependencies

- **Express**: Web framework
- **Prisma**: Database ORM
- **Axios**: HTTP client for external APIs
- **JWT**: Authentication tokens
- **CORS**: Cross-origin resource sharing
- **Dotenv**: Environment variable management
