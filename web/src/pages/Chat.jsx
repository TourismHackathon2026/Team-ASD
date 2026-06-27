import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import ChatBubble from '../components/ChatBubble';

const suggestions = [
  'Best time to visit Everest Base Camp?',
  'म अन्नपूर्ण सर्किट जान चाहन्छु',
  'Emergency contacts for Solukhumbu?',
  'What permits do I need for trekking?',
];

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const HISTORY_KEY = 'aipugyo_chat_history';

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
  catch { return []; }
}

function saveHistory(list) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 20)));
}

const INITIAL_GREETING = {
  role: 'assistant',
  content: 'नमस्ते! I am AI Pugyo 🏔️ — your Nepal expert. Ask me anything in English or Nepali about trails, culture, heritage, visas, or emergencies.',
  time: now(),
};

export default function Chat() {
  const user         = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate     = useNavigate();

  const [messages,     setMessages]     = useState([INITIAL_GREETING]);
  const [input,        setInput]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const [recording,    setRecording]    = useState(false);
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [history,      setHistory]      = useState(loadHistory);
  const [activeChatId, setActiveChatId] = useState(null);

  const bottomRef = useRef(null);
  const fileRef   = useRef(null);
  const recRef    = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-persist whenever messages change and there's at least one user message
  useEffect(() => {
    const firstUserMsg = messages.find(m => m.role === 'user');
    if (!firstUserMsg) return;
    const id = activeChatId || `chat_${Date.now()}`;
    if (!activeChatId) setActiveChatId(id);
    const title = firstUserMsg.content.length > 40
      ? firstUserMsg.content.slice(0, 40) + '…'
      : firstUserMsg.content;
    setHistory(prev => {
      const next = [
        { id, title, messages, updatedAt: Date.now() },
        ...prev.filter(h => h.id !== id),
      ];
      saveHistory(next);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  function addMsg(role, content) {
    setMessages(prev => [...prev, { role, content, time: now() }]);
  }

  function loadChat(id) {
    const entry = history.find(h => h.id === id);
    if (!entry) return;
    setMessages(entry.messages);
    setActiveChatId(id);
    setInput('');
    setImageFile(null);
    setImagePreview(null);
  }

  async function send(text) {
    const msg = text || input.trim();
    if (!msg && !imageFile) return;
    if (imageFile) { await sendImage(); return; }

    setInput('');
    const userMsg   = { role: 'user', content: msg, time: now() };
    const nextMsgs  = [...messages, userMsg];
    setMessages(nextMsgs);
    setLoading(true);

    try {
      const { data } = await api.post('/ai/chat', { message: msg, userId: user._id });
      const aiMsg    = { role: 'assistant', content: data.reply, time: now() };
      setMessages([...nextMsgs, aiMsg]);
    } catch {
      addMsg('assistant', 'Sorry, I could not connect. Please check backend is running.');
    } finally {
      setLoading(false);
    }
  }

  async function sendImage() {
    const userMsg  = { role: 'user', content: '📷 Identifying this image…', time: now() };
    const nextMsgs = [...messages, userMsg];
    setMessages(nextMsgs);
    setLoading(true);

    const fd = new FormData();
    fd.append('image', imageFile);

    try {
      const { data } = await api.post('/ai/image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const aiMsg = { role: 'assistant', content: data.description, time: now() };
      setMessages([...nextMsgs, aiMsg]);
    } catch {
      addMsg('assistant', 'Could not identify image. Please try again.');
    } finally {
      setLoading(false);
      setImageFile(null);
      setImagePreview(null);
    }
  }

  function toggleVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error('Voice not supported in this browser'); return; }
    if (recording) { recRef.current?.stop(); setRecording(false); return; }
    const r = new SR();
    r.lang           = 'en-US';
    r.interimResults = false;
    r.onresult = e   => { setInput(e.results[0][0].transcript); setRecording(false); };
    r.onerror  = ()  => setRecording(false);
    r.onend    = ()  => setRecording(false);
    r.start();
    recRef.current = r;
    setRecording(true);
  }

  // ── Goes HOME (not logout) ─────────────────────────────────────────────────
  function goHome() {
    navigate('/');
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  }

  function startNewChat() {
    setMessages([{ ...INITIAL_GREETING, time: now() }]);
    setActiveChatId(null);
    setInput('');
    setImageFile(null);
    setImagePreview(null);
  }

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      background: '#fff8f4', fontFamily: 'Manrope, sans-serif', color: '#1f1b17',
    }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 260, display: 'flex', flexDirection: 'column',
        height: '100vh', position: 'sticky', top: 0, flexShrink: 0,
        background: '#fff', borderRight: '1px solid #e0d9cc',
      }} className="hidden md:flex">

        {/* Logo + New chat */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #f0e8e0' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 14 }}>
            <img src="/logo.png" alt="AI Pugyo" style={{ height: 38, width: 'auto' }} />
            <span style={{ fontWeight: 800, fontSize: 16, color: '#9d4300' }}>AI Pugyo</span>
          </Link>
          <button onClick={startNewChat} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, padding: '10px 16px', borderRadius: 999,
            background: '#f97316', color: '#fff', fontWeight: 700,
            fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'Manrope',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            Start Chat
          </button>
        </div>

        {/* Recent chats */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: '#8c7164',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            padding: '4px 10px 8px',
          }}>Recent Explorations</p>

          {history.length === 0 && (
            <p style={{ padding: '4px 10px', fontSize: 12, color: '#8c7164' }}>
              Your conversations will appear here.
            </p>
          )}

          {history.map(h => (
            <button key={h.id} onClick={() => loadChat(h.id)} style={{
              width: '100%', textAlign: 'left', padding: '10px 12px',
              borderRadius: 10, marginBottom: 2,
              background: activeChatId === h.id ? '#fff8f4' : 'transparent',
              border: activeChatId === h.id ? '1px solid #f97316' : '1px solid transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              color: activeChatId === h.id ? '#9d4300' : '#584237',
              fontSize: 13, fontFamily: 'Manrope',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff8f4'}
              onMouseLeave={e => e.currentTarget.style.background = activeChatId === h.id ? '#fff8f4' : 'transparent'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#f97316', flexShrink: 0 }}>chat_bubble</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.title}</span>
            </button>
          ))}
        </div>

        {/* Bottom links */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid #e0d9cc' }}>
          {/* Home — navigates to landing without logging out */}
          <button onClick={goHome} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px', borderRadius: 10, color: '#584237',
            fontSize: 13, background: 'transparent', border: 'none',
            cursor: 'pointer', fontFamily: 'Manrope', marginBottom: 2,
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#fff8f4'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>home</span>
            Home
          </button>

          <Link to="/dashboard" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px', borderRadius: 10, color: '#584237',
            fontSize: 13, textDecoration: 'none', marginBottom: 2,
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#fff8f4'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person</span>
            Dashboard
          </Link>

          {/* Sign Out — clears auth and redirects home */}
          <button onClick={logout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px', borderRadius: 10, color: '#ba1a1a',
            fontSize: 13, background: 'transparent', border: 'none',
            cursor: 'pointer', fontFamily: 'Manrope',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#fff0f0'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main chat area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

        {/* Header */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 24px', background: '#fff',
          borderBottom: '1px solid #e0d9cc', flexShrink: 0,
        }}>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: 15, color: '#1f1b17', margin: 0 }}>AI Pugyo Chat</h1>
            <p style={{ fontSize: 12, color: '#8c7164', margin: 0 }}>
              Your Nepal travel expert • Replies in English &amp; Nepali
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#584237' }}>AI Online</span>
          </div>
        </header>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px' }}>
          {messages.map((m, i) => <ChatBubble key={i} message={m} />)}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: '#fff', border: '1px solid #e0d9cc',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0, overflow: 'hidden',
              }}>
                <img src="/logo.png" alt="AI Pugyo" style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
              </div>
              <div style={{
                padding: '12px 16px', borderRadius: '18px 18px 18px 4px',
                background: '#fff', border: '1px solid #e0d9cc',
              }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: '50%', background: '#f97316',
                      animation: `bounce 1s ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick suggestions — only on fresh chat */}
        {messages.length === 1 && (
          <div style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {suggestions.map(s => (
              <button key={s} onClick={() => send(s)} style={{
                padding: '7px 14px', borderRadius: 999, fontSize: 12,
                fontWeight: 500, border: '1px solid #e0d9cc',
                background: '#fff', color: '#584237', cursor: 'pointer',
                fontFamily: 'Manrope', transition: 'all 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#fff8f4'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Image preview */}
        {imagePreview && (
          <div style={{ padding: '0 16px 8px' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img src={imagePreview} alt="preview" style={{
                height: 64, borderRadius: 10,
                border: '1px solid #e0d9cc', display: 'block',
              }} />
              <button onClick={() => { setImageFile(null); setImagePreview(null); }} style={{
                position: 'absolute', top: -6, right: -6,
                width: 20, height: 20, borderRadius: '50%',
                background: '#ba1a1a', color: '#fff', border: 'none',
                cursor: 'pointer', fontSize: 11, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>✕</button>
            </div>
          </div>
        )}

        {/* Input bar */}
        <div style={{
          borderTop: '1px solid #e0d9cc', padding: '14px 16px',
          background: '#fff', flexShrink: 0,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            maxWidth: 800, margin: '0 auto',
          }}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => {
                const f = e.target.files[0];
                if (!f) return;
                setImageFile(f);
                setImagePreview(URL.createObjectURL(f));
                toast('Image ready — press Send to identify it 🏛️');
              }} />

            {/* Image button */}
            <button onClick={() => fileRef.current?.click()} style={{
              padding: 10, borderRadius: 10, background: 'transparent',
              border: 'none', cursor: 'pointer', color: '#8c7164',
              display: 'flex', alignItems: 'center',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff8f4'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>image</span>
            </button>

            {/* Mic button */}
            <button onClick={toggleVoice} style={{
              padding: 10, borderRadius: 10, border: 'none', cursor: 'pointer',
              background: recording ? '#f97316' : 'transparent',
              color: recording ? '#fff' : '#8c7164',
              display: 'flex', alignItems: 'center', transition: 'all 0.2s',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                {recording ? 'mic_off' : 'mic'}
              </span>
            </button>

            {/* Text input */}
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
              placeholder="Ask anything in English or Nepali…"
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 12,
                border: '1.5px solid #e0d9cc', background: '#f5ece6',
                color: '#1f1b17', fontSize: 14, fontFamily: 'Manrope', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#f97316'}
              onBlur={e  => e.target.style.borderColor = '#e0d9cc'}
            />

            {/* Send button */}
            <button
              onClick={() => send()}
              disabled={loading || (!input.trim() && !imageFile)}
              style={{
                padding: 12, borderRadius: 12,
                background: (loading || (!input.trim() && !imageFile)) ? '#fdd5b4' : '#f97316',
                color: '#fff', border: 'none',
                cursor: (loading || (!input.trim() && !imageFile)) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', transition: 'all 0.2s',
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}