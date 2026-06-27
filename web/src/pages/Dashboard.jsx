import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  const quickLinks = [
    { to: '/chat', icon: 'chat_bubble', label: 'Start Chat', desc: 'Ask AI Pugyo anything' },
    { to: '/planner', icon: 'map', label: 'Plan Trek', desc: 'Generate itinerary' },
    { to: '/heritage', icon: 'temple_hindu', label: 'Heritage', desc: 'Explore Nepal sites' },
    { to: '/safety', icon: 'emergency', label: 'Emergency', desc: 'Safety & contacts' },
  ];

  return (
    <div style={{ background: '#fff8f4', minHeight: '100vh', fontFamily: 'Manrope, sans-serif' }}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <header className="mb-10">
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1f1b17' }}>
            नमस्ते, {user.name || 'Traveller'} 👋
          </h1>
          <p style={{ color: '#584237' }}>Welcome back to AI Pugyo — your Nepal travel companion</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {quickLinks.map(({ to, icon, label, desc }) => (
            <Link key={to} to={to}
              className="p-6 rounded-xl border transition-all hover:shadow-md hover:scale-105 group"
              style={{ background: '#fff', borderColor: '#e0d9cc' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                style={{ background: 'rgba(249,115,22,0.1)', color: '#9d4300' }}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
              </div>
              <h3 className="font-bold mb-1" style={{ color: '#1f1b17' }}>{label}</h3>
              <p className="text-sm" style={{ color: '#584237' }}>{desc}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-xl border" style={{ background: '#fff', borderColor: '#e0d9cc' }}>
            <h2 className="font-bold mb-4" style={{ color: '#1f1b17' }}>Your Travel Stats</h2>
            <div className="space-y-3">
              {[{ label: 'AI Chats', val: '0' }, { label: 'Treks Planned', val: '0' }, { label: 'Sites Explored', val: '0' }].map(({ label, val }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#f5ece6' }}>
                  <span className="text-sm" style={{ color: '#584237' }}>{label}</span>
                  <span className="font-bold" style={{ color: '#9d4300' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 rounded-xl border" style={{ background: '#fff8f4', borderColor: '#e0d9cc', borderLeft: '4px solid #f97316' }}>
            <h2 className="font-bold mb-2" style={{ color: '#1f1b17' }}>
              <span className="material-symbols-outlined text-[18px] mr-1" style={{ color: '#f97316' }}>auto_awesome</span>
              AI Tip of the Day
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#584237' }}>
              The best time to visit Nepal for trekking is October–November (autumn) when skies are clear and temperatures are ideal. Spring (March–April) is also excellent for rhododendron blooms.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}