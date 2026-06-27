import express from 'express';
import axios from 'axios';

const router = express.Router();

const emergencyContacts = {
  kathmandu: { police: '100', ambulance: '102', tourist_police: '1144', rescue: '01-4111071' },
  solukhumbu: { police: '038-520072', ambulance: '102', tourist_police: '1144', rescue: '038-520114' },
  kaski: { police: '061-520031', ambulance: '102', tourist_police: '1144', rescue: '061-520078' },
  manang: { police: '066-400012', ambulance: '102', tourist_police: '1144', rescue: '066-400033' },
  mustang: { police: '069-440012', ambulance: '102', tourist_police: '1144', rescue: '069-440055' },
  chitwan: { police: '056-522033', ambulance: '102', tourist_police: '1144', rescue: '056-522100' },
  lalitpur: { police: '01-5521107', ambulance: '102', tourist_police: '1144', rescue: '01-5521200' },
  bhaktapur: { police: '01-6610062', ambulance: '102', tourist_police: '1144', rescue: '01-6610100' },
  dolpa: { police: '087-550012', ambulance: '102', tourist_police: '1144', rescue: '087-550033' },
  sindhupalchok: { police: '011-490012', ambulance: '102', tourist_police: '1144', rescue: '011-490055' },
};

router.get('/contacts', (req, res) => {
  res.json(emergencyContacts);
});

router.get('/contacts/:district', (req, res) => {
  const district = req.params.district.toLowerCase();
  const contacts = emergencyContacts[district];
  if (!contacts) return res.status(404).json({ message: 'District not found' });
  res.json({ district, ...contacts });
});

router.get('/weather', async (req, res) => {
  try {
    const cityParam = req.query.city;
    const cities = cityParam
      ? [cityParam]
      : ['Kathmandu', 'Pokhara', 'Chitwan', 'Lumbini', 'Namche Bazar'];

    const results = await Promise.all(
      cities.map(city =>
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},NP&appid=${process.env.OPENWEATHER_KEY}&units=metric`)
          .catch(() => null)
      )
    );

    const weather = results
      .filter(r => r !== null)
      .map(r => ({
        city: r.data.name,
        temp: r.data.main.temp,
        feels_like: r.data.main.feels_like,
        description: r.data.weather[0].description,
        humidity: r.data.main.humidity,
        wind: r.data.wind.speed,
        icon: r.data.weather[0].icon,
      }));

    if (weather.length === 0) return res.status(404).json({ message: 'City not found' });
    res.json(weather);
  } catch (err) {
    res.status(500).json({ message: 'Weather fetch failed', error: err.message });
  }
});

export default router;