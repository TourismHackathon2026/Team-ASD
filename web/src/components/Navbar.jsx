import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  }

  const links = [
    { to: '/chat', label: 'Chat', icon: 'chat_bubble' },
    { to: '/planner', label: 'Planner', icon: 'map' },
    { to: '/heritage', label: 'Explorer', icon: 'temple_hindu' },
    { to: '/map', label: 'Map', icon: 'explore' },
    { to: '/safety', label: 'Alerts', icon: 'emergency' },
  ];

  return (
    <nav style={{ background: 'rgba(255,248,244,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e0d9cc', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="flex justify-between items-center w-full px-6 py-2 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
  <img src="/logo.png" alt="AI Pugyo" style={{ height: 44, width: 'auto' }} />
  <span style={{ fontWeight: 800, fontSize: 18, color: '#9d4300', fontFamily: 'Manrope, sans-serif' }}>AI Pugyo</span>
</Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map(({ to, label }) => (
            <Link key={to} to={to}
              className="text-sm font-semibold transition-all hover:scale-105"
              style={{
                color: pathname === to ? '#9d4300' : '#584237',
                borderBottom: pathname === to ? '2px solid #9d4300' : '2px solid transparent',
                paddingBottom: 2
              }}>
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user?.name && (
            <Link to="/dashboard" className="text-sm font-semibold" style={{ color: '#9d4300' }}>
              {user.name.split(' ')[0]}
            </Link>
          )}
          <button onClick={logout}
            className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:brightness-95"
            style={{ background: '#f97316' }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-full px-4 py-2 flex items-center gap-1 shadow-xl"
        style={{ background: '#9d4300' }}>
        {links.map(({ to, label, icon }) => (
          <Link key={to} to={to} className="flex flex-col items-center px-3 py-1"
            style={{ color: pathname === to ? '#ffdbca' : 'rgba(255,255,255,0.7)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: pathname === to ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
            <span style={{ fontSize: 10 }}>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}