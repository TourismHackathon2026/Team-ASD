import express from 'express';
import axios from 'axios';
import multer from 'multer';
import fs from 'fs';
import ChatHistory from '../models/ChatHistory.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const SYSTEM_PROMPT = `You are AI Pugyo (AI पुग्यो), an expert virtual assistant for tourists visiting Nepal. You have deep knowledge of all 77 districts, major trekking routes (EBC, Annapurna Circuit, Langtang, Manaslu, Upper Mustang, Kanchenjunga), teahouse names, altitude sickness symptoms, cultural customs, food, transport, weather patterns, visa rules, emergency contacts, and UNESCO heritage sites. Detect language: Nepali input -> respond Nepali. English input -> respond English. NEVER invent emergency numbers. Be concise and practical.`;

router.post('/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    const response = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: message }] }]
      }
    );
    const reply = response.data.candidates[0].content.parts[0].text;
    if (userId) await ChatHistory.create({ userId, message, reply });
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: 'Gemini error', error: err.message });
  }
});

router.get('/history/:userId', async (req, res) => {
  try {
    const history = await ChatHistory.find({ userId: req.params.userId })
      .sort({ createdAt: -1 }).limit(50);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/image', upload.single('image'), async (req, res) => {
  try {
    const imageData = fs.readFileSync(req.file.path);
    const base64 = imageData.toString('base64');
    const mimeType = req.file.mimetype;
    const response = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [
            { text: 'This photo was taken by a tourist in Nepal. Identify what is in this image. If a Nepal landmark: 1. Name 2. Location (district and region) 3. Historical/cultural significance (2-3 sentences) 4. Best time to visit 5. Practical tips for tourists.' },
            { inline_data: { mime_type: mimeType, data: base64 } }
          ]
        }]
      }
    );
    fs.unlinkSync(req.file.path);
    const description = response.data.candidates[0].content.parts[0].text;
    res.json({ description });
  } catch (err) {
    res.status(500).json({ message: 'Image recognition failed', error: err.message });
  } finally {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});

router.post('/itinerary', async (req, res) => {
  try {
    const { destination, days, difficulty, budget } = req.body;
    const prompt = `Create a ${days}-day trekking itinerary for ${destination} in Nepal. Difficulty: ${difficulty}. Budget: $${budget} USD per day. Per day include: day, title, description, distance_km, max_altitude_m, accommodation, meals, safety_tip, highlights. Return ONLY valid JSON array. No markdown. No extra text.`;
    const response = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ role: 'user', parts: [{ text: prompt }] }] }
    );
    const raw = response.data.candidates[0].content.parts[0].text;
    const clean = raw.replace(/```json|```/g, '').trim();
    const itinerary = JSON.parse(clean);
    res.json({ itinerary });
  } catch (err) {
    res.status(500).json({ message: 'Itinerary generation failed', error: err.message });
  }
});

export default router;