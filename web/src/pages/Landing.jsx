import { Link, useNavigate } from 'react-router-dom';

const features = [
  { icon: 'chat_bubble', title: 'Intelligent Assistant', desc: 'Instant answers about weather, difficulty, and cultural etiquette in any regional dialect.', to: '/chat' },
  { icon: 'map', title: 'Trek Planner', desc: 'Custom itineraries based on your fitness level, time, and budget. Optimized for local teahouses.', to: '/planner' },
  { icon: 'temple_hindu', title: 'Heritage Explorer', desc: 'Discover hidden gems in Kathmandu Valley and beyond with AI-narrated historical guides.', to: '/heritage' },
  { icon: 'emergency', title: 'SOS Guard', desc: 'One-tap emergency hub connecting you to nearest rescue teams and health posts.', to: '/safety' },
];

export default function Landing() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  }

  function guardedNavigate(to, label) {
    if (!user) {
      navigate('/login', { state: { message: `Please sign in first to access ${label}.` } });
    } else {
      navigate(to);
    }
  }

  return (
    <div style={{ background: '#fff8f4', color: '#1f1b17', fontFamily: 'Manrope, sans-serif' }}>

      {/* ── Navbar ── */}
      <nav style={{
        background: 'rgba(255,248,244,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e0d9cc', position: 'sticky', top: 0, zIndex: 50
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 24px', maxWidth: 1280, margin: '0 auto'
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <img src="/logo.png" alt="AI Pugyo" style={{ height: 44, width: 'auto' }} />
            <span style={{ fontWeight: 800, fontSize: 18, color: '#9d4300', fontFamily: 'Manrope, sans-serif' }}>
              AI Pugyo
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden md:flex">
            {[
              { label: 'Chat', to: '/chat' },
              { label: 'Planner', to: '/planner' },
              { label: 'Explorer', to: '/heritage' },
              { label: 'Map', to: '/map' },
            ].map(({ label, to }) => (
              <button key={label} onClick={() => guardedNavigate(to, label)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: 600, color: '#584237',
                  fontFamily: 'Manrope', padding: 0
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#9d4300'}
                onMouseLeave={e => e.currentTarget.style.color = '#584237'}>
                {label}
              </button>
            ))}
          </div>

          {/* Right: user avatar or sign in */}
          <div style={{ position: 'relative' }}>
            {user ? (
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
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#9d4300' }}>
                    {user.name?.split(' ')[0]}
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
                  <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #f0e8e0' }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: '#1f1b17', margin: 0 }}>{user.name}</p>
                    <p style={{ fontSize: 11, color: '#8c7164', margin: '2px 0 0' }}>{user.email}</p>
                  </div>
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
                  <Link to="/chat" style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '11px 16px', color: '#1f1b17', textDecoration: 'none',
                    fontSize: 13, fontWeight: 600, background: '#fff'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fff8f4'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#f97316' }}>chat_bubble</span>
                    Chat
                  </Link>
                  <div style={{ borderTop: '1px solid #f0e8e0' }} />
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
                </div>
              </div>
            ) : (
              <Link to="/login" style={{
                padding: '9px 26px', borderRadius: 999, fontSize: 14,
                fontWeight: 700, color: '#fff', background: '#f97316',
                textDecoration: 'none', display: 'inline-block'
              }}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', padding: '64px 24px 96px', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '50%', height: '100%',
          background: 'radial-gradient(circle at top right, rgba(249,115,22,0.08), transparent)',
          pointerEvents: 'none'
        }} />
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center'
        }} className="grid-cols-1 md:grid-cols-2">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 999, width: 'fit-content',
              background: '#ffdbca', color: '#341100', marginBottom: 8
            }}>
              <span style={{ fontSize: 18 }}>🇳🇵</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Nepal's First AI Tourist Assistant</span>
            </div>
            <h1 style={{ margin: 0 }}>
              <span style={{ display: 'block', fontSize: 44, lineHeight: '52px', fontWeight: 800, color: '#1f1b17' }}>
                AI पुग्यो —
              </span>
              <span style={{ display: 'block', fontSize: 44, lineHeight: '52px', fontWeight: 800, color: '#f97316' }}>
                Your AI Has Arrived
              </span>
            </h1>
            <p style={{ fontSize: 17, color: '#584237', lineHeight: '28px', maxWidth: 480, marginTop: 8 }}>
              Ask about any trail, teahouse, or heritage site in English or Nepali. Plan your trek. Stay safe with real-time alerts.
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
              <button onClick={() => guardedNavigate('/chat', 'Chat')}
                style={{
                  padding: '14px 32px', borderRadius: 999, fontSize: 14,
                  fontWeight: 700, color: '#fff', background: '#f97316',
                  border: 'none', cursor: 'pointer', fontFamily: 'Manrope',
                  display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 14px rgba(249,115,22,0.35)'
                }}>
                Start Chatting
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
              </button>
              <button onClick={() => guardedNavigate('/planner', 'Planner')}
                style={{
                  padding: '14px 32px', borderRadius: 999, fontSize: 14,
                  fontWeight: 700, color: '#1f1b17', background: 'transparent',
                  border: '2px solid #8c7164', cursor: 'pointer', fontFamily: 'Manrope'
                }}>
                Plan Your Trek
              </button>
            </div>
          </div>

          {/* Hero image */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '100%', height: 500, borderRadius: 24,
              overflow: 'hidden', border: '1px solid #e0d9cc', boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              position: 'relative'
            }}>
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=100"
                alt="Nepal mountains"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', top: 24, right: 24,
                background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
                padding: '12px 16px', borderRadius: 14, boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                display: 'flex', alignItems: 'center', gap: 10
              }}>
                <div style={{ width: 10, height: 10, background: '#22c55e', borderRadius: '50%' }} />
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1f1b17' }}>Active in Nepal</p>
                  <p style={{ margin: 0, fontSize: 10, color: '#8c7164', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Real-time AI monitoring</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '80px 24px', background: '#fbf2eb' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 34, fontWeight: 700, color: '#1f1b17', margin: 0 }}>
              Smarter Travel, Safer Journeys
            </h2>
            <p style={{ color: '#584237', marginTop: 8, maxWidth: 440, margin: '8px auto 0' }}>
              Leveraging advanced AI to make every mile of your journey seamless.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}
            className="grid-cols-1 md:grid-cols-2">
            {features.map(({ icon, title, desc, to }) => (
              <button key={title} onClick={() => guardedNavigate(to, title)}
                style={{
                  padding: 40, borderRadius: 16, border: '1px solid rgba(224,217,204,0.5)',
                  background: '#fff', textAlign: 'left', cursor: 'pointer',
                  fontFamily: 'Manrope', transition: 'box-shadow 0.2s', width: '100%'
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, marginBottom: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: icon === 'emergency' ? 'rgba(186,26,26,0.1)' : 'rgba(249,115,22,0.1)',
                  color: icon === 'emergency' ? '#ba1a1a' : '#9d4300',
                }}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: '#1f1b17' }}>{title}</h3>
                <p style={{ color: '#584237', margin: 0, lineHeight: '24px' }}>{desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Banner ── */}
      <section style={{ position: 'relative', height: 400, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=100')`,
          backgroundSize: 'cover', backgroundPosition: 'center'
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(31,27,23,0.55)' }} />
        <div style={{
          position: 'relative', zIndex: 10, height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', textAlign: 'center', padding: '0 24px'
        }}>
          <h2 style={{ fontSize: 42, fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>
            Explore Every Corner
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', maxWidth: 560, margin: '0 0 36px' }}>
            From the subtropical jungles of Terai to the high deserts of Manang, our AI knows every trail.
          </p>
          <button onClick={() => guardedNavigate('/map', 'Map')}
            style={{
              padding: '14px 36px', borderRadius: 999, fontSize: 14,
              fontWeight: 700, color: '#fff', background: '#f97316',
              border: 'none', cursor: 'pointer', fontFamily: 'Manrope',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
            Launch Explorer Map
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>rocket_launch</span>
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#f5ece6', borderTop: '1px solid rgba(224,217,204,0.3)' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
          padding: '48px 24px', maxWidth: 1280, margin: '0 auto'
        }} className="grid-cols-1 md:grid-cols-4">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <img src="/logo.png" alt="AI Pugyo" style={{ height: 48, width: 'auto', objectFit: 'contain', objectPosition: 'left' }} />
            <p style={{ fontSize: 12, color: '#584237', margin: 0, lineHeight: '20px' }}>
              Empowering tourism in Nepal with Heritage-Modern AI technology.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h4 style={{ fontWeight: 700, color: '#1f1b17', margin: '0 0 8px', fontSize: 14 }}>Platform</h4>
            <Link to="/" style={{ fontSize: 13, color: '#584237', textDecoration: 'none' }}>Home</Link>
            <button onClick={() => guardedNavigate('/chat', 'Chat')} style={{ fontSize: 13, color: '#584237', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'Manrope' }}>Chat Assistant</button>
            <button onClick={() => guardedNavigate('/planner', 'Planner')} style={{ fontSize: 13, color: '#584237', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'Manrope' }}>Trek Planner</button>
            <button onClick={() => guardedNavigate('/heritage', 'Explorer')} style={{ fontSize: 13, color: '#584237', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'Manrope' }}>Heritage Explorer</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h4 style={{ fontWeight: 700, color: '#1f1b17', margin: '0 0 8px', fontSize: 14 }}>Quick Links</h4>
            <button onClick={() => guardedNavigate('/map', 'Map')} style={{ fontSize: 13, color: '#584237', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'Manrope' }}>Explorer Map</button>
            <button onClick={() => guardedNavigate('/safety', 'Safety')} style={{ fontSize: 13, color: '#584237', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'Manrope' }}>Safety & Alerts</button>
            <button onClick={() => guardedNavigate('/dashboard', 'Dashboard')} style={{ fontSize: 13, color: '#584237', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'Manrope' }}>My Dashboard</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h4 style={{ fontWeight: 700, color: '#1f1b17', margin: '0 0 8px', fontSize: 14 }}>Hackathon Project</h4>
            <p style={{ fontSize: 12, color: '#584237', margin: 0, lineHeight: '20px' }}>
              Created by Team ADS (Aayush, Dikshant, Shishir) for the Bagmati Province Tourism Hackathon 2083.
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '16px 24px', borderTop: '1px solid rgba(224,217,204,0.3)' }}>
          <p style={{ fontSize: 12, color: '#8c7164', margin: 0 }}>© 2083 AI Pugyo — Nepal's AI Tourist Assistant</p>
        </div>
      </footer>

      {/* ── Floating chat button ── */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50 }}>
        <button onClick={() => guardedNavigate('/chat', 'Chat')}
          style={{
            padding: '14px 24px', borderRadius: 999, boxShadow: '0 8px 24px rgba(249,115,22,0.4)',
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#f97316', color: '#fff', fontWeight: 700,
            fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'Manrope'
          }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
          Start Chat
        </button>
      </div>
    </div>
  );
}