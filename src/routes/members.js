const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

const uploadDir = path.join(__dirname, '../../uploads');
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Get all members (for member view)
router.get('/', authenticate, async (req, res) => {
  const members = await prisma.user.findMany({
    where: { role: 'member' },
    select: { id: true, firstName: true, lastName: true, gender: true, maritalStatus: true, photo: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(members);
});

// Update own profile
router.put('/profile', authenticate, upload.single('photo'), async (req, res) => {
  try {
    const { firstName, lastName, phone, gender, maritalStatus, password } = req.body;
    const data = { firstName, lastName, phone, gender, maritalStatus };
    if (req.file) data.photo = `/uploads/${req.file.filename}`;
    if (password) data.password = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: { id: true, firstName: true, lastName: true, phone: true, gender: true, maritalStatus: true, photo: true, role: true },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erreur mise à jour' });
  }
});

module.exports = router;
