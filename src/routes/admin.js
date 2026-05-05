const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate, isAdmin);

// All users
router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, firstName: true, lastName: true, phone: true, gender: true, maritalStatus: true, photo: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true });
});

// Stats
// router.get('/stats', async (req, res) => {
//   const [total, male, female, married, single, divorced, widowed, monthly] = await Promise.all([
//     prisma.user.count({ where: { role: 'member' } }),
//     prisma.user.count({ where: { role: 'member', gender: 'male' } }),
//     prisma.user.count({ where: { role: 'member', gender: 'female' } }),
//     prisma.user.count({ where: { role: 'member', maritalStatus: 'married' } }),
//     prisma.user.count({ where: { role: 'member', maritalStatus: 'single' } }),
//     prisma.user.count({ where: { role: 'member', maritalStatus: 'divorced' } }),
//     prisma.user.count({ where: { role: 'member', maritalStatus: 'widowed' } }),
//     prisma.$queryRaw`
//       SELECT strftime('%Y-%m', createdAt) as month, COUNT(*) as count
//       FROM User WHERE role = 'member'
//       GROUP BY month ORDER BY month DESC LIMIT 12
//     `,
//   ]);

//   res.json({ total, male, female, married, single, divorced, widowed, monthly });
// });


// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const total    = await prisma.user.count();
    const male     = await prisma.user.count({ where: { gender: 'male' } });
    const female   = await prisma.user.count({ where: { gender: 'female' } });
    const single   = await prisma.user.count({ where: { maritalStatus: 'single' } });
    const married  = await prisma.user.count({ where: { maritalStatus: 'married' } });
    const divorced = await prisma.user.count({ where: { maritalStatus: 'divorced' } });
    const widowed  = await prisma.user.count({ where: { maritalStatus: 'widowed' } });

    const monthly = await prisma.$queryRawUnsafe(`
      SELECT strftime('%Y-%m', "createdAt") AS month, COUNT(*) AS count
      FROM "User"
      WHERE "createdAt" >= date('now', '-12 months')
      GROUP BY month
      ORDER BY month ASC
    `);

    res.json({
      total, male, female, single, married, divorced, widowed,
      monthly: monthly.map(m => ({ month: m.month, count: Number(m.count) }))
    });
  } catch (error) {
    console.error('Erreur stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
