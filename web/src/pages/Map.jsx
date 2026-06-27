import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Navbar from '../components/Navbar';
import api from '../api/axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const orangeIcon = new L.DivIcon({
  html: `<div style="width:24px;height:24px;background:#f97316;border:2px solid white;border-radius:50%;box-shadow:0 4px 6px rgba(0,0,0,0.2)"></div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const categories = ['All', 'Trekking', 'Heritage', 'Wildlife', 'City'];

export default function MapPage() {
  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api.get('/places').then(({ data }) => setPlaces(data)).catch(() => {});
  }, []);

  const filtered = filter === 'All' ? places : places.filter(p => p.category === filter);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Manrope, sans-serif', background: '#fff8f4' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside style={{ width: 280, background: '#fff', borderRight: '1px solid #e0d9cc', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          className="hidden md:flex">
          <div className="p-5 border-b" style={{ borderColor: '#e0d9cc' }}>
            <h2 className="font-bold mb-3" style={{ color: '#1f1b17' }}>Adventure Map</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <button key={c} onClick={() => setFilter(c)}
                  className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
                  style={{
                    background: filter === c ? '#9d4300' : '#fff',
                    color: filter === c ? '#fff' : '#584237',
                    borderColor: filter === c ? '#9d4300' : '#e0d9cc'
                  }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {filtered.length === 0 ? (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-4xl mb-2" style={{ color: '#e0d9cc' }}>map</span>
                <p className="text-xs" style={{ color: '#8c7164' }}>Connect backend to load places</p>
              </div>
            ) : filtered.map(p => (
              <button key={p._id} onClick={() => setSelected(p)}
                className="w-full text-left p-3 rounded-xl mb-2 transition-all hover:bg-orange-50 flex items-start gap-3"
                style={{ background: selected?._id === p._id ? '#fff8f4' : 'transparent' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'rgba(249,115,22,0.15)' }}>
                  <span className="material-symbols-outlined text-[16px]" style={{ color: '#f97316', fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#1f1b17' }}>{p.name}</p>
                  <p className="text-xs" style={{ color: '#8c7164' }}>{p.district}, {p.region}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          <MapContainer center={[28.3949, 84.1240]} zoom={7} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://carto.com">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {filtered.map(p => p.lat && p.lng && (
              <Marker key={p._id} position={[p.lat, p.lng]} icon={orangeIcon}>
                <Popup>
                  <div style={{ fontFamily: 'Manrope, sans-serif', minWidth: 160 }}>
                    <strong style={{ color: '#9d4300' }}>{p.name}</strong><br />
                    <span style={{ color: '#8c7164', fontSize: 12 }}>{p.district}, {p.region}</span>
                    {p.description && <p style={{ marginTop: 4, fontSize: 12, color: '#584237' }}>{p.description}</p>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map overlay info */}
          <div className="absolute top-4 right-4 z-50 p-4 rounded-2xl shadow-lg"
            style={{ background: 'rgba(255,248,244,0.95)', border: '1px solid #e0d9cc', backdropFilter: 'blur(12px)' }}>
            <p className="text-xs font-semibold" style={{ color: '#9d4300' }}>
              <span className="material-symbols-outlined text-[14px] mr-1">location_on</span>
              Nepal — {filtered.length} destinations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}