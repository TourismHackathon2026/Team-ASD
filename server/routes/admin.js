import express from 'express';
import User from '../models/User.js';
import ChatHistory from '../models/ChatHistory.js';
import Place from '../models/Place.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', auth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalChats = await ChatHistory.countDocuments();
    const totalPlaces = await Place.countDocuments();
    res.json({ totalUsers, totalChats, totalPlaces });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;