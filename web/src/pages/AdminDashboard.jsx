import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  function logout() { localStorage.clear(); navigate('/'); }

  const stats = [
    { label: 'Total Users', val: '—', icon: 'group', color: '#9d4300' },
    { label: 'AI Chats', val: '—', icon: 'chat_bubble', color: '#f97316' },
    { label: 'Places', val: '—', icon: 'location_on', color: '#625d59' },
    { label: 'Heritage Sites', val: '—', icon: 'temple_hindu', color: '#645d54' },
  ];

  const navLinks = [
    { icon: 'dashboard', label: 'Dashboard' },
    { icon: 'group', label: 'Users' },
    { icon: 'map', label: 'Places' },
    { icon: 'history_edu', label: 'Chat Logs' },
    { icon: 'temple_hindu', label: 'Heritage' },
    { icon: 'settings', label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen overflow-hidden" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col h-screen sticky top-0 shrink-0"
        style={{ background: '#1a1714', color: '#fff' }}>
        <div className="px-6 py-8 flex flex-col gap-1">
          <div className="flex items-center gap-2 font-extrabold text-lg" style={{ color: '#ffb690' }}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
            AI Pugyo
          </div>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Admin Panel</span>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navLinks.map(({ icon, label }, i) => (
            <button key={label}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
              style={{ background: i === 0 ? 'rgba(249,115,22,0.15)' : 'transparent', color: i === 0 ? '#ffb690' : 'rgba(255,255,255,0.6)' }}>
              <span className="material-symbols-outlined text-[20px]">{icon}</span>
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 mt-auto border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm hover:bg-white/10"
            style={{ color: 'rgba(255,255,255,0.5)' }}>
            <span className="material-symbols-outlined text-[20px]">logout</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col" style={{ background: '#fff8f4' }}>
        <header className="flex items-center justify-between px-8 py-4 border-b"
          style={{ background: '#fff', borderColor: '#e0d9cc' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1f1b17' }}>Admin Dashboard</h1>
            <p className="text-sm" style={{ color: '#8c7164' }}>AI Pugyo — Bagmati Province Hackathon 2083</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl hover:bg-orange-50" style={{ color: '#8c7164' }}>
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>

        <div className="px-8 py-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Metric cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map(({ label, val, icon, color }) => (
              <div key={label} className="p-6 rounded-xl border" style={{ background: '#fff', borderColor: '#e0d9cc' }}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#8c7164' }}>{label}</p>
                    <p style={{ fontSize: 32, fontWeight: 800, color: '#1f1b17' }}>{val}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}15`, color }}>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  </div>
                </div>
                <p className="text-xs" style={{ color: '#8c7164' }}>Connect backend to see live data</p>
              </div>
            ))}
          </section>

          {/* Recent activity placeholder */}
          <div className="p-6 rounded-xl border" style={{ background: '#fff', borderColor: '#e0d9cc' }}>
            <h2 className="font-bold mb-4" style={{ color: '#1f1b17' }}>Recent Activity</h2>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="material-symbols-outlined text-5xl mb-3" style={{ color: '#e0d9cc' }}>history</span>
              <p style={{ color: '#8c7164' }}>Activity will appear here once backend is connected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}