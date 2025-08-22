# 📚 คู่มือการพัฒนา Backend API ด้วย Node.js, Express และ Prisma

## 🏗️ บทที่ 1: โครงสร้างโปรเจคและสถาปัตยกรรม

### โครงสร้างโปรเจค
```
backend/
├── src/
│   ├── controllers/     # ควบคุมการทำงานของ API
│   ├── services/        # ตรรกะทางธุรกิจ
│   ├── routes/          # กำหนดเส้นทาง API
│   ├── middleware/      # ตัวกลางประมวลผล
│   ├── config/          # การตั้งค่า
│   └── utils/           # ฟังก์ชันช่วยเหลือ
├── prisma/              # ฐานข้อมูลและ migration
└── package.json         # dependencies และ scripts
```

### สถาปัตยกรรมแบบ MVC + Service Layer

```mermaid
graph TD
    A[Client Request] --> B[Route]
    B --> C[Middleware]
    C --> D[Controller]
    D --> E[Service]
    E --> F[Prisma Client]
    F --> G[Database]
    G --> F
    F --> E
    E --> D
    D --> H[Response]
    H --> I[Client]
    
    style A fill:#e1f5fe
    style I fill:#e1f5fe
    style G fill:#f3e5f5
    style F fill:#fff3e0
```

**Flow การทำงาน:**
- **Route**: กำหนดเส้นทาง API
- **Middleware**: ประมวลผลก่อนถึง controller (auth, validation, rate limiting)
- **Controller**: รับ request และส่ง response
- **Service**: จัดการตรรกะทางธุรกิจ
- **Prisma Client**: เชื่อมต่อกับฐานข้อมูล

---

## 🗄️ บทที่ 2: การจัดการฐานข้อมูลด้วย Prisma

### คำสั่ง Prisma ที่สำคัญ

#### 1. การติดตั้งและสร้าง Prisma Client
```bash
# ติดตั้ง Prisma
npm install prisma @prisma/client

# เริ่มต้น Prisma
npx prisma init

# สร้าง Prisma Client
npx prisma generate
```

#### 2. การจัดการ Migration
```bash
# สร้าง migration ใหม่
npx prisma migrate dev --name migration_name

# รัน migration ใน production
npx prisma migrate deploy

# รีเซ็ตฐานข้อมูล (development only)
npx prisma migrate reset

# ดูสถานะ migration
npx prisma migrate status
```

#### 3. การจัดการฐานข้อมูล
```bash
# เปิด Prisma Studio (GUI)
npx prisma studio

# รัน seed data
npx prisma db seed

# Push schema ไปยังฐานข้อมูล (development)
npx prisma db push
```

### ตัวอย่างการเขียน Prisma Schema

#### Model พื้นฐาน
```prisma
model User {
  id        String   @id @default(uuid())
  username  String   @unique
  email     String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

enum Role {
  ADMIN
  USER
}
```

#### ความสัมพันธ์ระหว่าง Model

```mermaid
erDiagram
    User ||--o{ Post : "writes"
    User ||--o| Profile : "has"
    Post }o--|| Category : "belongs_to"
    
    User {
        string id PK
        string username UK
        string email UK
        string password
        enum role
        datetime createdAt
        datetime updatedAt
    }
    
    Post {
        string id PK
        string title
        string content
        string authorId FK
        string categoryId FK
        datetime createdAt
        datetime updatedAt
    }
    
    Profile {
        string id PK
        string bio
        string userId FK
        string userId UK
    }
    
    Category {
        string id PK
        string name UK
        string description
        datetime createdAt
        datetime updatedAt
    }
```

```prisma
model User {
  id       String    @id @default(uuid())
  name     String
  posts    Post[]    // One-to-Many
  profile  Profile?  // One-to-One
}

model Post {
  id         String   @id @default(uuid())
  title      String
  content    String
  authorId   String
  author     User     @relation(fields: [authorId], references: [id])
  categoryId String?
  category   Category? @relation(fields: [categoryId], references: [id])
}

model Profile {
  id     String @id @default(uuid())
  bio    String?
  userId String @unique
  user   User   @relation(fields: [userId], references: [id])
}

model Category {
  id       String @id @default(uuid())
  name     String @unique
  posts    Post[]
}
```

#### Field Types และ Attributes
```prisma
model Product {
  id          String   @id @default(uuid())
  name        String   @db.VarChar(255)
  price       Decimal  @db.Decimal(10, 2)
  isActive    Boolean  @default(true)
  tags        String[] // Array of strings
  metadata    Json     // JSON field
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([name])
  @@unique([name, price])
  @@map("products")
}
```

---

## 🚀 บทที่ 3: การเพิ่ม Table ใหม่

### ขั้นตอนการเพิ่ม Table

```mermaid
flowchart TD
    A[แก้ไข Prisma Schema] --> B[สร้าง Migration]
    B --> C[สร้าง Service]
    C --> D[สร้าง Controller]
    D --> E[สร้าง Route]
    E --> F[เพิ่มใน app.js]
    F --> G[ทดสอบ API]
    
    style A fill:#e8f5e8
    style G fill:#fff3e0
```

#### 1. แก้ไข Prisma Schema
```prisma
// เพิ่ม model ใหม่ใน schema.prisma
model Category {
  id          String    @id @default(uuid())
  name        String    @unique
  description String?
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("categories")
}

// แก้ไข model ที่มีอยู่เพื่อเพิ่มความสัมพันธ์
model Product {
  id         String   @id @default(uuid())
  name       String
  price      Decimal  @db.Decimal(10, 2)
  categoryId String?
  category   Category? @relation(fields: [categoryId], references: [id])
  
  @@map("products")
}
```

#### 2. สร้าง Migration
```bash
npx prisma migrate dev --name add_category_table
```

#### 3. สร้าง Service
```javascript
// src/services/CategoryService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CategoryService {
  static async create(data) {
    return await prisma.category.create({
      data: {
        name: data.name,
        description: data.description
      }
    });
  }

  static async findAll() {
    return await prisma.category.findMany({
      include: {
        products: true
      }
    });
  }

  static async findById(id) {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        products: true
      }
    });
  }

  static async update(id, data) {
    return await prisma.category.update({
      where: { id },
      data
    });
  }

  static async delete(id) {
    return await prisma.category.delete({
      where: { id }
    });
  }
}

module.exports = CategoryService;
```

#### 4. สร้าง Controller
```javascript
// src/controllers/CategoryController.js
const CategoryService = require('@/services/CategoryService');

class CategoryController {
  static async create(req, res, next) {
    try {
      const category = await CategoryService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const categories = await CategoryService.findAll();
      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const category = await CategoryService.findById(req.params.id);
      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found'
        });
      }
      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const category = await CategoryService.update(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Category updated successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await CategoryService.delete(req.params.id);
      res.json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
```

#### 5. สร้าง Route
```javascript
// src/routes/categoryRoutes.js
const express = require('express');
const CategoryController = require('@/controllers/CategoryController');
const { authenticateToken } = require('@/middleware/auth');

const router = express.Router();

// Public routes
router.get('/', CategoryController.getAll);
router.get('/:id', CategoryController.getById);

// Protected routes (ต้อง login)
router.post('/', authenticateToken, CategoryController.create);
router.put('/:id', authenticateToken, CategoryController.update);
router.delete('/:id', authenticateToken, CategoryController.delete);

module.exports = router;
```

#### 6. เพิ่ม Route ใน app.js
```javascript
// src/app.js
const categoryRoutes = require('@/routes/categoryRoutes');

// เพิ่มบรรทัดนี้ในส่วน API Routes
app.use('/api/categories', categoryRoutes);
```

---

## 🔐 บทที่ 4: การจัดการ Authentication และ Authorization

### JWT Token Structure

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    participant DB as Database
    
    C->>S: POST /api/auth/login
    S->>DB: Verify credentials
    DB-->>S: User data
    S->>S: Generate JWT Token
    S-->>C: Return token
    
    Note over C,S: Token contains: {userId, username, role, exp}
    
    C->>S: GET /api/protected (with token)
    S->>S: Verify JWT token
    S->>DB: Get user data
    S-->>C: Protected data
```

```javascript
// สร้าง JWT Token
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { 
    userId: user.id, 
    username: user.username,
    role: user.role 
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

### Middleware Authentication
```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
```

### การใช้งาน Authorization
```javascript
// ใช้ใน route เพื่อจำกัดสิทธิ์
router.post('/admin-only', 
  authenticateToken, 
  authorizeRole(['ADMIN', 'SUPER_ADMIN']), 
  AdminController.create
);
```

---

## 📡 บทที่ 5: การสร้าง API Endpoint

### RESTful API Pattern

```mermaid
graph LR
    A[GET] --> B[ดึงข้อมูล]
    C[POST] --> D[สร้างข้อมูลใหม่]
    E[PUT] --> F[อัปเดตข้อมูลทั้งหมด]
    G[PATCH] --> H[อัปเดตข้อมูลบางส่วน]
    I[DELETE] --> J[ลบข้อมูล]
    
    style A fill:#e8f5e8
    style C fill:#fff3e0
    style E fill:#e3f2fd
    style G fill:#f3e5f5
    style I fill:#ffebee
```

#### 1. GET - ดึงข้อมูล
```javascript
// GET /api/products
static async getAll(req, res, next) {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    const products = await ProductService.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      search
    });
    
    res.json({
      success: true,
      data: products.items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: products.total,
        pages: Math.ceil(products.total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
}
```

#### 2. POST - สร้างข้อมูลใหม่
```javascript
// POST /api/products
static async create(req, res, next) {
  try {
    // Validation
    const { name, price, description } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        error: 'Name and price are required'
      });
    }

    const product = await ProductService.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
}
```

#### 3. PUT/PATCH - อัปเดตข้อมูล
```javascript
// PUT /api/products/:id
static async update(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const product = await ProductService.update(id, updateData);
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
}
```

#### 4. DELETE - ลบข้อมูล
```javascript
// DELETE /api/products/:id
static async delete(req, res, next) {
  try {
    const { id } = req.params;
    
    await ProductService.delete(id);
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}
```

---

## 🛡️ บทที่ 6: การจัดการ Error และ Validation

### Global Error Handler

```mermaid
flowchart TD
    A[Request] --> B{Error Occurs?}
    B -->|No| C[Continue]
    B -->|Yes| D[Error Handler]
    D --> E{Error Type?}
    E -->|Validation| F[400 Bad Request]
    E -->|Authentication| G[401 Unauthorized]
    E -->|Authorization| H[403 Forbidden]
    E -->|Not Found| I[404 Not Found]
    E -->|Prisma Error| J[400/404 Database Error]
    E -->|Other| K[500 Internal Server Error]
    
    style F fill:#ffebee
    style G fill:#fff3e0
    style H fill:#fff3e0
    style I fill:#e8f5e8
    style J fill:#e3f2fd
    style K fill:#ffebee
```

```javascript
// src/app.js
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Prisma Errors
  if (err.code === 'P2002') {
    return res.status(400).json({
      success: false,
      error: 'Duplicate field value'
    });
  }
  
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      error: 'Record not found'
    });
  }
  
  // Validation Errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: err.message
    });
  }
  
  // Default error
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});
```

### Input Validation
```javascript
// src/middleware/validation.js
const validateProduct = (req, res, next) => {
  const { name, price, description } = req.body;
  const errors = [];
  
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!price || isNaN(price) || price <= 0) {
    errors.push('Price must be a positive number');
  }
  
  if (description && description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};
```

---

## 🚦 บทที่ 7: การจัดการ Rate Limiting

### Rate Limiting Middleware

```mermaid
graph LR
    A[Request] --> B{Rate Limit?}
    B -->|OK| C[Continue]
    B -->|Exceeded| D[429 Too Many Requests]
    
    style D fill:#ffebee
    style C fill:#e8f5e8
```

```javascript
// src/middleware/rate-limit.js
const rateLimit = require('express-rate-limit');

const defaultRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later'
  }
});

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later'
  }
});

module.exports = { defaultRateLimit, authRateLimit };
```

---

## 🚀 บทที่ 8: การ Deploy และ Production

### Environment Variables
```bash
# .env
NODE_ENV=production
PORT=3000
DATABASE_URL="mysql://user:password@localhost:3306/database"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"
```

### Production Scripts
```json
{
  "scripts": {
    "start": "node build/server.js",
    "build": "babel src -d build",
    "postinstall": "npm run prisma:generate"
  }
}
```

### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'backend-api',
    script: 'build/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

---

## 📋 สรุปขั้นตอนการเพิ่ม Feature ใหม่

### 1. เพิ่ม Table
- แก้ไข `prisma/schema.prisma`
- รัน `npx prisma migrate dev`
- รัน `npx prisma generate`

### 2. เพิ่ม Service
- สร้างไฟล์ `src/services/[Name]Service.js`
- เขียน CRUD operations

### 3. เพิ่ม Controller
- สร้างไฟล์ `src/controllers/[Name]Controller.js`
- เขียน HTTP methods

### 4. เพิ่ม Route
- สร้างไฟล์ `src/routes/[name]Routes.js`
- กำหนด endpoints

### 5. เพิ่มใน app.js
- import route ใหม่
- ใช้ `app.use('/api/[name]', [name]Routes)`

### 6. ทดสอบ
- รัน `npm run dev`
- ทดสอบ API ด้วย Postman หรือ tools อื่นๆ

---

## 🛠️ คำสั่งที่ใช้บ่อย

```bash
# Development
npm run dev                    # รัน server ในโหมด development
npm run build                 # Build โปรเจค
npm run prisma:generate      # สร้าง Prisma Client
npm run prisma:migrate       # รัน migration
npm run prisma:studio        # เปิด Prisma Studio
npm run prisma:seed          # รัน seed data

# Database
npx prisma migrate dev       # สร้างและรัน migration
npx prisma migrate reset     # รีเซ็ตฐานข้อมูล
npx prisma db push           # Push schema ไปยังฐานข้อมูล
npx prisma db seed           # รัน seed data

# Production
npm start                     # รัน server ในโหมด production
npm run build                # Build โปรเจค
```

---

## 📚 แหล่งข้อมูลเพิ่มเติม

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [JWT.io](https://jwt.io/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 🎯 แบบฝึกหัด

### แบบฝึกหัดที่ 1: สร้าง Order System
สร้างระบบ Order ที่มี:
- Model Order, OrderItem
- API endpoints สำหรับ CRUD operations
- Validation และ error handling
- Authentication และ authorization

### แบบฝึกหัดที่ 2: สร้าง Review System
สร้างระบบ Review ที่มี:
- Model Review ที่เชื่อมกับ Product และ User
- Rating system (1-5 stars)
- API สำหรับดึง reviews ของ product
- Pagination และ filtering

### แบบฝึกหัดที่ 3: สร้าง Search API
สร้าง API search ที่มี:
- Full-text search ในชื่อและคำอธิบาย
- Filtering โดย category, price range
- Sorting โดย price, name, date
- Pagination

---

เนื้อหานี้ครอบคลุมทุกส่วนที่สำคัญในการพัฒนา backend API ด้วย Node.js, Express และ Prisma พร้อมกับ Mermaid diagrams เพื่อให้เข้าใจได้ง่ายขึ้นครับ!
