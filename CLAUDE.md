# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a Node.js Express backend with MVC architecture, Prisma ORM, and LINE integration:

- **Framework**: Express.js with Babel transpilation
- **Database**: MySQL 8.0 with Prisma ORM
- **Authentication**: JWT tokens with role-based access control
- **External Integration**: LINE OAuth 2.0 and webhook support

### Key Architectural Patterns

**MVC Structure**: Controllers handle HTTP requests, services contain business logic, Prisma manages data access.

**Role-Based Authentication**: Three-tier system (SUPER_ADMIN/ADMIN/USER) with decorator middleware pattern for route protection.

**LINE Integration**: Complete OAuth flow with user profile synchronization and dual-path registration.

**Path Aliasing**: Babel module resolver with `@/` pointing to `src/` directory for clean imports.

## Development Commands

```bash
npm run dev                 # Development with nodemon + babel hot reload
npm run start              # Production server
npm run build              # Babel transpilation to build/
npm run prisma:migrate     # Apply database migrations
npm run prisma:studio      # Open Prisma GUI
npm run prisma:seed        # Load test data
npm run db:reset           # Complete database reset + reseed
```

## Database Management

**Schema Changes**: Modify `prisma/schema.prisma`, then run `npm run prisma:migrate` to generate and apply migrations.

**Test Data**: Seeded accounts available:
- superadmin/superadmin123 (SUPER_ADMIN)
- admin/admin123 (ADMIN) 
- user/user123 (USER)

**Key Models**:
- Users: UUID primary keys, role enum, optional `lineId` for LINE integration
- Products: UUID primary keys, decimal pricing with 2 decimal places

## API Structure

**Authentication Flow**:
- JWT tokens with configurable expiration (default 24h)
- Role-based middleware using decorator pattern
- Rate limiting: 10 req/min for auth endpoints, 50 req/min general

**LINE Integration Endpoints**:
- `GET /api/line/login` - Generate LINE OAuth URL
- `GET /api/line/callback` - Handle OAuth callback, redirect based on user existence
- `POST /api/line/complete-registration` - Complete new user registration
- `POST /api/line/webhook` - Handle LINE webhook events

**Core API Patterns**:
- `/api/health` - Service health check
- `/api/auth/*` - Authentication (login, register, refresh)
- `/api/users/*` - User CRUD with role restrictions
- `/api/products/*` - Product CRUD with role restrictions

## Environment Configuration

**Required Variables**:
```
DATABASE_URL=mysql://user:password@localhost:3306/database
LINE_CHANNEL_ID=your_line_channel_id
LINE_CHANNEL_SECRET=your_line_channel_secret
LINE_CALLBACK_URL=your_callback_url
LINE_REDIRECT_FRONTEND_URL=your_success_redirect
LINE_CONTINUE_REGIS_URL=your_registration_form_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
PORT=5000
```

**Database Setup**: Use `docker-compose up -d` to start MySQL container before running migrations.

## Code Organization Principles

**Service Layer Pattern**: Business logic in services (`src/services/`), controllers handle HTTP concerns only. All services use static methods.

**Error Handling**: Custom error types in services, Express error middleware handles responses.

**Database Access**: Prisma Client with connection pooling. Use transactions for multi-table operations.

**Middleware Usage**:
- `authenticateToken` for JWT verification
- `requireRole(Role.ADMIN, Role.SUPER_ADMIN)` for authorization
- `authRateLimit` for auth endpoints, `defaultRateLimit` for others

## Development Workflow

1. Database schema changes require `npm run prisma:migrate`
2. Use `npm run prisma:studio` for database inspection
3. Rate limiting is active - use seeded accounts for testing
4. LINE webhook testing requires public URL (use ngrok)
5. All imports use `@/` alias for src/ directory
- Always use path Aliases