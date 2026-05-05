require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const memberRoutes = require('./routes/members');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/admin', adminRoutes);

// HTML Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, '../public/register.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, '../public/dashboard.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, '../public/admin.html')));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
