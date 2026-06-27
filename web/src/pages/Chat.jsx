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

// ── LocalStorage helpers ──────────────────────────────────────────────────────

const HISTORY_KEY = 'aipugyo_chat_history';

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
  catch { return []; }
}

function saveHistory(list) {
  // keep at most 20 sessions
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 20)));
}

// A "session" stored in history looks like:
// {
//   id:       "chat_1719481234567",   ← unique key
//   title:    "Best time to visit…",  ← first user message (truncated)
//   messages: [ { role, content, time }, … ],
//   updatedAt: 1719481234567
// }

// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_GREETING = {
  role: 'assistant',
  content:
    'नमस्ते! I am AI Pugyo 🏔️ — your Nepal expert. Ask me anything in English or Nepali about trails, culture, heritage, visas, or emergencies.',
  time: now(),
};

export default function Chat() {
  const user       = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate   = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────

  const [messages,     setMessages]     = useState([INITIAL_GREETING]);
  const [input,        setInput]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const [recording,    setRecording]    = useState(false);
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // history  – array of session objects persisted in localStorage
  const [history,      setHistory]      = useState(loadHistory);

  // activeChatId
  //   null           → brand-new chat (not yet in history)
  //   "chat_<ts>"    → the session currently loaded from / being saved to history
  const [activeChatId, setActiveChatId] = useState(null);

  // ── Refs ───────────────────────────────────────────────────────────────────

  const bottomRef = useRef(null);
  const fileRef   = useRef(null);
  const recRef    = useRef(null);

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  function addMsg(role, content) {
    setMessages(prev => [...prev, { role, content, time: now() }]);
  }

  /**
   * Persist the current conversation to localStorage.
   * - If activeChatId is set, update the existing session.
   * - If null, create a new session and set activeChatId.
   */
  function persistSession(newMessages, currentId) {
    const allSessions = loadHistory();

    if (currentId) {
      // Update existing session
      const updated = allSessions.map(s =>
        s.id === currentId
          ? { ...s, messages: newMessages, updatedAt: Date.now() }
          : s
      );
      saveHistory(updated);
      setHistory(updated);
    } else {
      // Create a brand-new session
      const id    = `chat_${Date.now()}`;
      const title = newMessages.find(m => m.role === 'user')?.content?.slice(0, 50) || 'New chat';
      const fresh = { id, title, messages: newMessages, updatedAt: Date.now() };
      const next  = [fresh, ...allSessions];
      saveHistory(next);
      setHistory(next);
      setActiveChatId(id);   // ← this is what activeChatId is for
      return id;             // return so the caller can use it immediately
    }
    return currentId;
  }

  // ── Send message ───────────────────────────────────────────────────────────

  async function send(text) {
    const msg = text || input.trim();
    if (!msg && !imageFile) return;
    if (imageFile) { await sendImage(); return; }

    setInput('');
    const userMsg  = { role: 'user', content: msg, time: now() };
    const nextMsgs = [...messages, userMsg];
    setMessages(nextMsgs);
    setLoading(true);

    try {
      const { data } = await api.post('/ai/chat', { message: msg, userId: user._id });
      const aiMsg    = { role: 'assistant', content: data.reply, time: now() };
      const finalMsgs = [...nextMsgs, aiMsg];
      setMessages(finalMsgs);

      // Save / update in localStorage — pass activeChatId so we know which branch to take
      persistSession(finalMsgs, activeChatId);
    } catch {
      addMsg('assistant', 'Sorry, I could not connect. Please check backend is running.');
    } finally {
      setLoading(false);
    }
  }

  // ── Send image ─────────────────────────────────────────────────────────────

  async function sendImage() {
    const userMsg   = { role: 'user', content: '📷 Identifying this image…', time: now() };
    const nextMsgs  = [...messages, userMsg];
    setMessages(nextMsgs);
    setLoading(true);

    const fd = new FormData();
    fd.append('image', imageFile);

    try {
      const { data }  = await api.post('/ai/image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const aiMsg     = { role: 'assistant', content: data.description, time: now() };
      const finalMsgs = [...nextMsgs, aiMsg];
      setMessages(finalMsgs);
      persistSession(finalMsgs, activeChatId);
    } catch {
      addMsg('assistant', 'Could not identify image. Please try again.');
    } finally {
      setLoading(false);
      setImageFile(null);
      setImagePreview(null);
    }
  }

  // ── Voice ──────────────────────────────────────────────────────────────────

  function toggleVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error('Voice not supported in this browser'); return; }
    if (recording) { recRef.current?.stop(); setRecording(false); return; }

    const r = new SR();
    r.lang          = 'en-US';
    r.interimResults = false;
    r.onresult = e  => { setInput(e.results[0][0].transcript); setRecording(false); };
    r.onerror  = ()  => setRecording(false);
    r.onend    = ()  => setRecording(false);
    r.start();
    recRef.current = r;
    setRecording(true);
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  }

  /** Start a completely fresh chat. */
  function startNewChat() {
    setMessages([{ ...INITIAL_GREETING, time: now() }]);
    setActiveChatId(null);   // ← reset: next send() will create a new session
    setInput('');
    setImageFile(null);
    setImagePreview(null);
  }

  /**
   * Load an old session from the sidebar.
   * Sets activeChatId so future send() calls update THAT session, not a new one.
   */
  function loadSession(session) {
    setMessages(session.messages);
    setActiveChatId(session.id);   // ← activeChatId now points to the loaded session
    setInput('');
    setImageFile(null);
    setImagePreview(null);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

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
          <button
            onClick={startNewChat}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, padding: '10px 16px', borderRadius: 999,
              background: '#f97316', color: '#fff', fontWeight: 700,
              fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'Manrope',
            }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            Start Chat
          </button>
        </div>

        {/* Recent sessions from localStorage */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: '#8c7164',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            padding: '4px 10px 8px',
          }}>Recent Explorations</p>

          {history.length === 0 && (
            <p style={{ fontSize: 12, color: '#bbb', padding: '4px 12px' }}>
              No chats yet — start one!
            </p>
          )}

          {history.map(session => (
            <button
              key={session.id}
              onClick={() => loadSession(session)}
              style={{
                width: '100%', textAlign: 'left', padding: '10px 12px',
                borderRadius: 10, marginBottom: 2,
                background: activeChatId === session.id ? '#fff8f4' : 'transparent',
                border: activeChatId === session.id ? '1px solid #f97316' : '1px solid transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                color: '#584237', fontSize: 13, fontFamily: 'Manrope',
              }}
              onMouseEnter={e => { if (activeChatId !== session.id) e.currentTarget.style.background = '#fff8f4'; }}
              onMouseLeave={e => { if (activeChatId !== session.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#f97316', flexShrink: 0 }}>
                chat_bubble
              </span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {session.title}
              </span>
            </button>
          ))}
        </div>

        {/* Bottom links */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid #e0d9cc' }}>
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
          <button onClick={logout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px', borderRadius: 10, color: '#ba1a1a',
            fontSize: 13, background: 'transparent', border: 'none',
            cursor: 'pointer', fontFamily: 'Manrope',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#fff0f0'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
            Exit
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
                background: '#f97316', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0,
              }}>
                <span className="material-symbols-outlined" style={{
                  fontSize: 18, color: '#fff', fontVariationSettings: "'FILL' 1",
                }}>travel_explore</span>
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

        {/* Quick suggestions (only on first message of a fresh chat) */}
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
            {/* Hidden file input */}
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