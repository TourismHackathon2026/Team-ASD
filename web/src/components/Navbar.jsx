import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

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
    <nav style={{
      background: 'rgba(255,248,244,0.95)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e0d9cc', position: 'sticky', top: 0, zIndex: 50
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 24px', maxWidth: 1280, margin: '0 auto'
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src="/logo.png" alt="AI Pugyo" style={{ height: 44, width: 'auto' }} />
          <span style={{ fontWeight: 800, fontSize: 18, color: '#9d4300', fontFamily: 'Manrope, sans-serif' }}>
            AI Pugyo
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="hidden md:flex">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} style={{
              fontSize: 14, fontWeight: 600, textDecoration: 'none',
              color: pathname === to ? '#9d4300' : '#584237',
              borderBottom: pathname === to ? '2px solid #9d4300' : '2px solid transparent',
              paddingBottom: 2, transition: 'color 0.15s'
            }}>
              {label}
            </Link>
          ))}
        </div>

        {/* User avatar + dropdown */}
        <div className="group" style={{ position: 'relative' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#fff', border: '1.5px solid #e0d9cc',
            borderRadius: 999, padding: '6px 14px 6px 8px',
            cursor: 'pointer', fontFamily: 'Manrope'
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: '#f97316', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 14, flexShrink: 0
            }}>
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#9d4300' }}>
              {user?.name?.split(' ')[0] || 'Account'}
            </span>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#8c7164' }}>
              expand_more
            </span>
          </button>

          {/* Dropdown */}
          <div className="group-hover:block hidden" style={{
            position: 'absolute', right: 0, top: 'calc(100% + 8px)',
            background: '#fff', border: '1px solid #e0d9cc',
            borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            minWidth: 190, zIndex: 200, overflow: 'hidden'
          }}>
            {user && (
              <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid #f0e8e0' }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#1f1b17', margin: 0 }}>{user.name}</p>
                <p style={{ fontSize: 11, color: '#8c7164', margin: '2px 0 0' }}>{user.email}</p>
              </div>
            )}
            <Link to="/dashboard" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '11px 16px', color: '#1f1b17', textDecoration: 'none',
              fontSize: 13, fontWeight: 600, background: '#fff'
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff8f4'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#f97316' }}>dashboard</span>
              My Dashboard
            </Link>
            <div style={{ borderTop: '1px solid #f0e8e0' }} />
            {user ? (
              <button onClick={logout} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '11px 16px', color: '#ba1a1a', background: '#fff',
                border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                fontFamily: 'Manrope', textAlign: 'left'
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#fff0f0'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
                Sign Out
              </button>
            ) : (
              <Link to="/login" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '11px 16px', color: '#9d4300', textDecoration: 'none',
                fontSize: 13, fontWeight: 600, background: '#fff'
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#fff8f4'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>login</span>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden" style={{
        position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)',
        zIndex: 50, borderRadius: 999, padding: '8px 16px',
        display: 'flex', alignItems: 'center', gap: 4,
        background: '#9d4300', boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
      }}>
        {links.map(({ to, label, icon }) => (
          <Link key={to} to={to} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '4px 12px', textDecoration: 'none',
            color: pathname === to ? '#ffdbca' : 'rgba(255,255,255,0.7)'
          }}>
            <span className="material-symbols-outlined" style={{
              fontSize: 20,
              fontVariationSettings: pathname === to ? "'FILL' 1" : "'FILL' 0"
            }}>{icon}</span>
            <span style={{ fontSize: 10 }}>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}