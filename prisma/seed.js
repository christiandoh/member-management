const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { phone: '0711118582' },
    update: {},
    create: {
      firstName: 'voix',
      lastName: 'System',
      phone: '0711118582',
      gender: 'male',
      maritalStatus: 'single',
      role: 'admin',
      password: hashedPassword,
    },
  });

  console.log('Seed completed: admin account created (phone: 0711118582 / password: admin123)');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
