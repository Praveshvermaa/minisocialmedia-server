const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Mini Social Media API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Self-ping every 5 minutes to keep the server alive
  const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;
  setInterval(() => {
    const http = require('http');
    http.get(SERVER_URL, (res) => {
      console.log(`[Keep-Alive] Pinged server — Status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error('[Keep-Alive] Ping failed:', err.message);
    });
  }, 5 * 60 * 1000); // 5 minutes
});
