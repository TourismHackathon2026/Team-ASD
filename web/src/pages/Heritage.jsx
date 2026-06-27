import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const categories = ['All', 'UNESCO', 'Temple', 'Palace', 'Stupa', 'Natural'];

export default function Heritage() {
  const [sites, setSites] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/heritage').then(({ data }) => setSites(data)).catch(() => setSites([])).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? sites : sites.filter(s => s.category === filter);

  return (
    <div style={{ background: '#fff8f4', minHeight: '100vh', fontFamily: 'Manrope, sans-serif' }}>
      <Navbar />

      {/* Hero */}
      <section className="relative h-64 flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1585938389612-a552a28d6914?w=1200&q=80"
          alt="Heritage" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'rgba(157,67,0,0.65)' }}></div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 style={{ fontSize: 40, fontWeight: 800 }}>Heritage Explorer</h1>
          <p className="mt-2 text-white/80">Discover Nepal's UNESCO sites and cultural landmarks</p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className="px-5 py-2 rounded-full text-sm font-semibold border transition-all"
              style={{
                background: filter === c ? '#9d4300' : '#fff',
                color: filter === c ? '#fff' : '#584237',
                borderColor: filter === c ? '#9d4300' : '#e0d9cc'
              }}>
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Cards */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: '#f5ece6' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl mb-4" style={{ color: '#e0d9cc' }}>temple_hindu</span>
            <p style={{ color: '#8c7164' }}>No heritage sites found. Connect backend to load data.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((site) => (
              <button key={site._id} onClick={() => setSelected(site)}
                className="p-6 rounded-2xl border text-left transition-all hover:shadow-md hover:-translate-y-1 group"
                style={{ background: '#fff', borderColor: '#e0d9cc' }}>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(249,115,22,0.1)', color: '#9d4300' }}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>temple_hindu</span>
                  </div>
                  {site.category && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full"
                      style={{ background: '#ffdbca', color: '#341100' }}>{site.category}</span>
                  )}
                </div>
                <h3 className="font-bold mb-1" style={{ color: '#1f1b17' }}>{site.name}</h3>
                <div className="flex items-center gap-1 text-xs mb-3" style={{ color: '#8c7164' }}>
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  {site.district}, {site.region}
                </div>
                <p className="text-sm line-clamp-2" style={{ color: '#584237' }}>{site.description}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color: '#f97316' }}>
                  Explore <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(26,23,20,0.6)' }} onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-2xl p-6 relative" style={{ background: '#fff' }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
              style={{ color: '#8c7164' }}>
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
            {selected.category && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block"
                style={{ background: '#ffdbca', color: '#341100' }}>{selected.category}</span>
            )}
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1f1b17', marginBottom: 4 }}>{selected.name}</h2>
            <div className="flex items-center gap-1 text-sm mb-4" style={{ color: '#8c7164' }}>
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              {selected.district}, {selected.region}
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#584237' }}>{selected.description}</p>
            {selected.significance && (
              <div className="p-4 rounded-xl" style={{ background: '#fff8f4', border: '1px solid #e0d9cc' }}>
                <p className="text-xs font-semibold mb-1 flex items-center gap-1" style={{ color: '#9d4300' }}>
                  <span className="material-symbols-outlined text-[14px]">info</span> Significance
                </p>
                <p className="text-sm" style={{ color: '#584237' }}>{selected.significance}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}