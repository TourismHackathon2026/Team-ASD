import { Link } from 'react-router-dom';

const features = [
  { icon: 'chat_bubble', title: 'Intelligent Assistant', desc: 'Instant answers about weather, difficulty, and cultural etiquette in any regional dialect.' },
  { icon: 'map', title: 'Trek Planner', desc: 'Custom itineraries based on your fitness level, time, and budget. Optimized for local teahouses.' },
  { icon: 'temple_hindu', title: 'Heritage Explorer', desc: 'Discover hidden gems in Kathmandu Valley and beyond with AI-narrated historical guides.' },
  { icon: 'emergency', title: 'SOS Guard', desc: 'One-tap emergency hub connecting you to nearest rescue teams and health posts.' },
];

export default function Landing() {
  return (
    <div style={{ background: '#fff8f4', color: '#1f1b17', fontFamily: 'Manrope, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ background: 'rgba(255,248,244,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e0d9cc', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="flex justify-between items-center px-6 py-3 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
  <img src="/logo.png" alt="AI Pugyo" style={{ height: 44, width: 'auto' }} />
  <span style={{ fontWeight: 800, fontSize: 18, color: '#9d4300', fontFamily: 'Manrope, sans-serif' }}>AI Pugyo</span>
</Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/chat" className="text-sm font-semibold transition-all hover:scale-105" style={{ color: '#584237' }}>Chat</Link>
            <Link to="/planner" className="text-sm font-semibold transition-all hover:scale-105" style={{ color: '#584237' }}>Planner</Link>
            <Link to="/heritage" className="text-sm font-semibold transition-all hover:scale-105" style={{ color: '#584237' }}>Explorer</Link>
            <Link to="/map" className="text-sm font-semibold transition-all hover:scale-105" style={{ color: '#584237' }}>Map</Link>
          </div>
          <Link to="/login"
            className="px-6 py-2 rounded-full text-sm font-semibold text-white transition-all hover:brightness-95"
            style={{ background: '#f97316' }}>
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden">
        <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: 'radial-gradient(circle at top right, rgba(249,115,22,0.08), transparent)', pointerEvents: 'none' }} />
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full w-fit mb-2"
              style={{ background: '#ffdbca', color: '#341100' }}>
              <span className="text-lg">🇳🇵</span>
              <span className="text-sm font-semibold">Nepal's First AI Tourist Assistant</span>
            </div>
            <h1 className="flex flex-col">
              <span style={{ fontSize: 40, lineHeight: '48px', fontWeight: 800, color: '#1f1b17' }}>AI पुग्यो —</span>
              <span style={{ fontSize: 40, lineHeight: '48px', fontWeight: 800, color: '#f97316' }}>Your AI Has Arrived</span>
            </h1>
            <p className="text-lg mt-4 max-w-lg" style={{ color: '#584237', lineHeight: '28px' }}>
              Ask about any trail, teahouse, or heritage site in English or Nepali. Plan your trek. Stay safe with real-time alerts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link to="/register"
                className="px-10 py-4 rounded-full text-sm font-semibold text-white flex items-center justify-center gap-2 shadow-md transition-all hover:brightness-95"
                style={{ background: '#f97316' }}>
                Start Chatting <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link to="/login"
                className="px-10 py-4 rounded-full text-sm font-semibold transition-all hover:bg-orange-50 flex items-center justify-center"
                style={{ border: '2px solid #8c7164', color: '#1f1b17' }}>
                Plan Your Trek
              </Link>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative flex justify-center items-center">
            <div className="w-full h-[500px] rounded-3xl overflow-hidden border shadow-lg relative group"
              style={{ borderColor: '#e0d9cc' }}>
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                alt="Nepal mountains"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/40 flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full" style={{ animation: 'pulse 2s infinite' }}></div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold" style={{ color: '#1f1b17' }}>Active in Nepal</span>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: '#8c7164' }}>Real-time AI monitoring</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6" style={{ background: '#fbf2eb' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 style={{ fontSize: 32, fontWeight: 700, color: '#1f1b17' }}>Smarter Travel, Safer Journeys</h2>
            <p className="max-w-md mx-auto mt-2" style={{ color: '#584237' }}>Leveraging advanced AI to make every mile of your journey seamless.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map(({ icon, title, desc }) => (
              <Link key={title}
                to={icon === 'chat_bubble' ? '/chat' : icon === 'map' ? '/planner' : icon === 'temple_hindu' ? '/heritage' : '/safety'}
                className="p-10 rounded-xl border transition-all hover:shadow-md group cursor-pointer block"
                style={{ background: '#fff', borderColor: 'rgba(224,217,204,0.5)', textDecoration: 'none' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    background: icon === 'emergency' ? 'rgba(186,26,26,0.1)' : 'rgba(249,115,22,0.1)',
                    color: icon === 'emergency' ? '#ba1a1a' : '#9d4300',
                  }}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: '#1f1b17' }}>{title}</h3>
                <p style={{ color: '#584237' }}>{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80')` }}></div>
        <div className="absolute inset-0" style={{ background: 'rgba(31,27,23,0.5)' }}></div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
          <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Explore Every Corner</h2>
          <p className="max-w-2xl text-lg text-white/90 mb-10">From the subtropical jungles of Terai to the high deserts of Manang, our AI knows every trail.</p>
          <Link to="/map"
            className="px-10 py-4 rounded-full text-sm font-semibold text-white flex items-center gap-2 transition-all hover:brightness-95"
            style={{ background: '#f97316' }}>
            Launch Explorer Map <span className="material-symbols-outlined">rocket_launch</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#f5ece6', borderTop: '1px solid rgba(224,217,204,0.3)' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 px-6 py-10 max-w-7xl mx-auto">
          <div className="flex flex-col gap-3">
            <img src="/logo.png" alt="AI Pugyo" style={{ height: 48, width: 'auto', objectFit: 'contain', objectPosition: 'left' }} />
            <p className="text-xs" style={{ color: '#584237' }}>Empowering tourism in Nepal with Heritage-Modern AI technology.</p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold mb-2" style={{ color: '#1f1b17' }}>Platform</h4>
            <Link to="/" className="text-sm hover:underline" style={{ color: '#584237' }}>Home</Link>
            <Link to="/chat" className="text-sm hover:underline" style={{ color: '#584237' }}>Chat Assistant</Link>
            <Link to="/planner" className="text-sm hover:underline" style={{ color: '#584237' }}>Trek Planner</Link>
            <Link to="/heritage" className="text-sm hover:underline" style={{ color: '#584237' }}>Heritage Explorer</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold mb-2" style={{ color: '#1f1b17' }}>Admin</h4>
            <Link to="/dashboard" className="text-sm hover:underline" style={{ color: '#584237' }}>User Dashboard</Link>
            <Link to="/admin/login" className="text-sm hover:underline" style={{ color: '#584237' }}>Admin Login</Link>
            <Link to="/admin/dashboard" className="text-sm hover:underline" style={{ color: '#584237' }}>Admin Dashboard</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold mb-2" style={{ color: '#1f1b17' }}>Hackathon Project</h4>
            <p className="text-xs leading-relaxed" style={{ color: '#584237' }}>
              Created by Team ADS (Aayush, Dikshant, Shishir) for the Bagmati Province Tourism Hackathon 2083.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating chat button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link to="/register"
          className="px-6 py-4 rounded-full shadow-xl flex items-center gap-3 text-white font-semibold transition-all hover:scale-105 active:scale-95"
          style={{ background: '#f97316' }}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
          Start Chat
        </Link>
      </div>
    </div>
  );
}