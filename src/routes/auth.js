const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Multer config
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Register
router.post('/register', upload.single('photo'), async (req, res) => {
  try {
    const { firstName, lastName, phone, gender, maritalStatus, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) return res.status(400).json({ error: 'Ce numéro est déjà utilisé' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        firstName, lastName, phone, gender, maritalStatus,
        password: hashed,
        photo: req.file ? `/uploads/${req.file.filename}` : null,
      },
    });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, user: { id: user.id, firstName: user.firstName, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Identifiants incorrects' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, user: { id: user.id, firstName: user.firstName, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

// Me
router.get('/me', async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Non connecté' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, firstName: true, lastName: true, phone: true, gender: true, maritalStatus: true, photo: true, role: true, createdAt: true },
    });
    res.json(user);
  } catch {
    res.status(401).json({ error: 'Token invalide' });
  }
});

module.exports = router;
