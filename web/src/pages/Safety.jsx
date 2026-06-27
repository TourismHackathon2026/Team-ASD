import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function Safety() {
  const [weather, setWeather] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sosActive, setSosActive] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/safety/weather').catch(() => ({ data: null })),
      api.get('/safety/contacts').catch(() => ({ data: [] })),
    ]).then(([w, c]) => { setWeather(w.data); setContacts(c.data); }).finally(() => setLoading(false));
  }, []);

  const filtered = contacts.filter(c => c.district?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ background: '#fff8f4', minHeight: '100vh', fontFamily: 'Manrope, sans-serif' }}>
      <Navbar />
      <main className="pt-10 pb-16 px-6 max-w-4xl mx-auto flex flex-col items-center">

        {/* SOS Button */}
        <section className="flex flex-col items-center mb-12 text-center">
          <div className="relative cursor-pointer mb-4" onClick={() => setSosActive(!sosActive)}>
            <div className="w-36 h-36 rounded-full flex flex-col items-center justify-center text-white font-extrabold shadow-xl transition-all"
              style={{
                background: sosActive ? '#ba1a1a' : '#f97316',
                animation: sosActive ? 'pulse-ring 2s infinite' : 'none',
                fontSize: 28
              }}>
              <span className="material-symbols-outlined text-4xl mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
              SOS
            </div>
            {sosActive && (
              <div className="absolute inset-0 rounded-full animate-ping"
                style={{ background: 'rgba(186,26,26,0.3)' }}></div>
            )}
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1f1b17' }}>Emergency Hub</h1>
          <p style={{ color: '#584237' }}>Tap SOS for immediate help • District contacts below</p>
        </section>

        {/* National numbers */}
        <div className="w-full p-5 rounded-2xl border mb-8"
          style={{ background: '#ffdad6', borderColor: '#ba1a1a', borderLeftWidth: 4 }}>
          <p className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#93000a' }}>
            <span className="material-symbols-outlined text-[18px]">emergency</span>
            National Emergency Numbers — Always Available
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Tourist Police', number: '1144' },
              { label: 'Ambulance', number: '102' },
              { label: 'Nepal Police', number: '100' },
              { label: 'Mountain Rescue', number: '01-4111071' },
            ].map(({ label, number }) => (
              <a key={label} href={`tel:${number}`}
                className="flex flex-col items-center text-center p-3 rounded-xl hover:brightness-95 transition-all"
                style={{ background: 'rgba(186,26,26,0.1)' }}>
                <span className="material-symbols-outlined text-[20px] mb-1" style={{ color: '#ba1a1a' }}>call</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#93000a' }}>{number}</span>
                <span className="text-xs" style={{ color: '#584237' }}>{label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Offline banner */}
        <div className="w-full p-4 rounded-2xl border mb-8 flex items-center justify-between"
          style={{ background: '#fff', borderColor: '#e0d9cc' }}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined" style={{ color: '#f97316', fontVariationSettings: "'FILL' 1" }}>wifi_off</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1f1b17' }}>Offline Mode Available</p>
              <p className="text-xs" style={{ color: '#8c7164' }}>Emergency contacts cached for use without internet</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: '#ffdbca', color: '#341100' }}>PWA Ready</span>
        </div>

        {/* Weather */}
        {weather && (
          <div className="w-full p-5 rounded-2xl border mb-8" style={{ background: '#fff', borderColor: '#e0d9cc' }}>
            <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#1f1b17' }}>
              <span className="material-symbols-outlined" style={{ color: '#f97316' }}>partly_cloudy_day</span>
              Current Weather — Nepal
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: 'thermometer', label: 'Temperature', val: `${weather.temp}°C` },
                { icon: 'water_drop', label: 'Humidity', val: `${weather.humidity}%` },
                { icon: 'air', label: 'Wind', val: `${weather.wind} m/s` },
              ].map(({ icon, label, val }) => (
                <div key={label} className="flex flex-col items-center text-center p-3 rounded-xl"
                  style={{ background: '#fff8f4' }}>
                  <span className="material-symbols-outlined text-[24px] mb-1" style={{ color: '#f97316' }}>{icon}</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#1f1b17' }}>{val}</span>
                  <span className="text-xs" style={{ color: '#8c7164' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* District contacts */}
        <div className="w-full">
          <div className="relative mb-4">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px]"
              style={{ color: '#8c7164' }}>search</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search district..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: '#fff', border: '1.5px solid #e0d9cc', color: '#1f1b17', fontFamily: 'Manrope' }}
              onFocus={e => e.target.style.borderColor = '#f97316'}
              onBlur={e => e.target.style.borderColor = '#e0d9cc'}
            />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: '#f5ece6' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-5xl mb-3" style={{ color: '#e0d9cc' }}>location_off</span>
              <p style={{ color: '#8c7164' }}>
                {search ? `No contacts for "${search}"` : 'Connect backend to load district contacts'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((c, i) => (
                <div key={i} className="p-5 rounded-2xl border" style={{ background: '#fff', borderColor: '#e0d9cc' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-[18px]" style={{ color: '#f97316', fontVariationSettings: "'FILL' 1" }}>location_on</span>
                    <span className="font-bold" style={{ color: '#1f1b17' }}>{c.district}</span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { key: 'police', label: 'Police', icon: 'local_police', color: '#1976d2' },
                      { key: 'hospital', label: 'Hospital', icon: 'local_hospital', color: '#2e7d32' },
                      { key: 'rescue', label: 'Rescue', icon: 'emergency_share', color: '#f97316' },
                    ].map(({ key, label, icon, color }) => c[key] && (
                      <a key={key} href={`tel:${c[key]}`}
                        className="flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm"
                        style={{ borderColor: '#e0d9cc' }}>
                        <span className="material-symbols-outlined text-[20px]" style={{ color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                        <div>
                          <div className="text-xs" style={{ color: '#8c7164' }}>{label}</div>
                          <div className="font-bold text-sm" style={{ color: '#1f1b17' }}>{c[key]}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}