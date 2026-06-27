import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import placesRoutes from './routes/places.js';
import heritageRoutes from './routes/heritage.js';
import safetyRoutes from './routes/safety.js';
import trekRoutes from './routes/trek.js';
import adminRoutes from './routes/admin.js';
import weatherRoutes from './routes/weather.js';

dotenv.config();

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/heritage', heritageRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/trek', trekRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/weather', weatherRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'AI Pugyo API is running' });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });