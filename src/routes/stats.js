const express = require('express');
const router  = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/admin/stats
router.get('/admin/stats', async (req, res) => {
  try {
    // Vérification admin (si pas déjà fait dans un middleware global)
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    // Compteurs
    const total    = await prisma.user.count();
    const male     = await prisma.user.count({ where: { gender: 'male' } });
    const female   = await prisma.user.count({ where: { gender: 'female' } });
    const single   = await prisma.user.count({ where: { maritalStatus: 'single' } });
    const married  = await prisma.user.count({ where: { maritalStatus: 'married' } });
    const divorced = await prisma.user.count({ where: { maritalStatus: 'divorced' } });
    const widowed  = await prisma.user.count({ where: { maritalStatus: 'widowed' } });

    // Inscriptions par mois (SQLite)
    const monthly = await prisma.$queryRawUnsafe(`
      SELECT strftime('%Y-%m', "createdAt") AS month, COUNT(*) AS count
      FROM "User"
      WHERE "createdAt" >= date('now', '-12 months')
      GROUP BY month
      ORDER BY month ASC
    `);

    res.json({
      total,
      male,
      female,
      single,
      married,
      divorced,
      widowed,
      monthly: monthly.map(m => ({
        month: m.month,
        count: Number(m.count)
      }))
    });

  } catch (error) {
    console.error('Erreur stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;