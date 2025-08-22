const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create Super Admin user
    const superAdminPassword = await bcrypt.hash('superadmin123', 12);
    const superAdmin = await prisma.user.upsert({
      where: { username: 'superadmin' },
      update: {},
      create: {
        username: 'superadmin',
        password: superAdminPassword,
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@example.com',
        phone: '0811111111',
        role: 'SUPER_ADMIN',
      },
    });
    console.log('✅ Super Admin user created:', superAdmin.username);

    // Create Admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        phone: '0822222222',
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin user created:', admin.username);

    // Create Regular User
    const userPassword = await bcrypt.hash('user123', 12);
    const regularUser = await prisma.user.upsert({
      where: { username: 'user' },
      update: {},
      create: {
        username: 'user',
        password: userPassword,
        firstName: 'Regular',
        lastName: 'User',
        email: 'user@example.com',
        phone: '0833333333',
        role: 'USER',
      },
    });
    console.log('✅ Regular user created:', regularUser.username);

    // Create sample products with fixed UUIDs
    const products = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Laptop Pro',
        description: 'High-performance laptop for professional use',
        price: 1299.99,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with precision tracking',
        price: 49.99,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical keyboard for gaming and productivity',
        price: 149.99,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        name: 'USB-C Hub',
        description: 'Multi-port USB-C hub with HDMI and card reader',
        price: 79.99,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        name: 'Noise-Canceling Headphones',
        description: 'Premium wireless headphones with active noise cancellation',
        price: 299.99,
      },
    ];

    for (const productData of products) {
      const product = await prisma.product.upsert({
        where: { id: productData.id }, // Use ID instead of name for upsert
        update: {},
        create: productData,
      });
      console.log('✅ Product created:', product.name);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Seeded data summary:');
    console.log('👥 Users:');
    console.log('   - superadmin/superadmin123 (SUPER_ADMIN)');
    console.log('   - admin/admin123 (ADMIN)');
    console.log('   - user/user123 (USER)');
    console.log('📦 Products: 5 sample products created');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });