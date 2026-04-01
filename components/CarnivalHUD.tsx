'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournalStore } from '@/lib/store';
import { SECTIONS } from '@/lib/sections';

export default function CarnivalHUD() {
  const { visitedSections, setActiveSection, user, setUser } = useJournalStore();
  const [showMap, setShowMap] = useState(false);
  const [showFeeling, setShowFeeling] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const progress = Math.round((visitedSections.filter((id) => id !== 'shop').length / 14) * 100);

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between p-3 pointer-events-none">
        {/* Logo */}
        <div className="carnival-card px-4 py-2 pointer-events-auto" style={{ background: 'white' }}>
          <p className="font-caveat text-xl font-bold" style={{ color: '#2D2016' }}>
            🐼 Get Lost in the Right Direction
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-2 pointer-events-auto">
          <button className="btn-hand" onClick={() => setShowFeeling(!showFeeling)}>
            💭 How do I feel?
          </button>
          <button className="btn-hand" onClick={() => setShowMap(!showMap)}>
            🗺️ Map
          </button>
          <button className="btn-hand" onClick={() => setShowAuth(!showAuth)}>
            {user ? `👤 ${user.email.split('@')[0]}` : '🔐 Save progress'}
          </button>
        </div>
      </div>

      {/* Progress bar at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-20 p-3 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto" style={{ maxWidth: 300 }}>
          <div className="carnival-card px-3 py-2 flex-1" style={{ background: 'white' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-caveat text-sm" style={{ color: '#2D2016' }}>Journal progress</span>
              <span className="font-caveat text-sm font-bold" style={{ color: '#2D2016' }}>{progress}%</span>
            </div>
            <div className="h-3 rounded-full" style={{ background: '#F0E8D0', border: '1.5px solid #2D2016' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #FFD4B8, #D4B8FF)' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Move hint (shown briefly on load) */}
      <div className="fixed bottom-16 left-1/2 z-20 pointer-events-none" style={{ transform: 'translateX(-50%)' }}>
        <div className="carnival-card px-4 py-2 text-center" style={{ background: 'rgba(255,255,255,0.9)' }}>
          <p className="font-caveat text-base" style={{ color: '#2D2016' }}>
            Use ↑↓←→ or WASD to walk • 🎮 Touch joystick on mobile
          </p>
        </div>
      </div>

      {/* "How do I feel?" panel */}
      <AnimatePresence>
        {showFeeling && (
          <motion.div
            className="fixed inset-0 z-30 flex items-center justify-center p-4"
            style={{ background: 'rgba(45,32,22,0.5)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowFeeling(false); }}
          >
            <motion.div
              className="carnival-card p-6"
              style={{ background: '#FFF8F0', maxWidth: 520, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-caveat text-2xl font-bold" style={{ color: '#2D2016' }}>🧭 What do you need right now?</h2>
                <button className="btn-hand" onClick={() => setShowFeeling(false)}>✕</button>
              </div>
              <p className="font-patrick text-sm mb-4" style={{ color: '#6B5744' }}>
                Choose how you're feeling and your panda will walk to the right area of the carnival.
              </p>
              <div className="space-y-2">
                {SECTIONS.filter((s) => s.id !== 'shop').map((section) => (
                  <button
                    key={section.id}
                    className="carnival-card w-full text-left p-3 transition-all"
                    style={{
                      background: visitedSections.includes(section.id) ? '#F0FFF8' : 'white',
                      borderColor: visitedSections.includes(section.id) ? '#B8FFD4' : '#2D2016',
                    }}
                    onClick={() => {
                      setShowFeeling(false);
                      setActiveSection(section.id);
                    }}
                  >
                    <span className="text-xl mr-3">{section.emoji}</span>
                    <span className="font-caveat text-base" style={{ color: '#2D2016' }}>{section.feeling}</span>
                    {visitedSections.includes(section.id) && (
                      <span className="ml-2 text-xs font-patrick" style={{ color: '#888' }}>✓ visited</span>
                    )}
                  </button>
                ))}
                <button
                  className="carnival-card w-full text-left p-3"
                  style={{ background: 'white' }}
                  onClick={() => { setShowFeeling(false); setActiveSection('shop'); }}
                >
                  <span className="text-xl mr-3">📖</span>
                  <span className="font-caveat text-base" style={{ color: '#2D2016' }}>I want the physical book</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini map */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            className="fixed inset-0 z-30 flex items-center justify-center p-4"
            style={{ background: 'rgba(45,32,22,0.5)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowMap(false); }}
          >
            <motion.div
              className="carnival-card p-6"
              style={{ background: '#FFF8F0', maxWidth: 620, width: '100%' }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-caveat text-2xl font-bold" style={{ color: '#2D2016' }}>🗺️ Carnival Map</h2>
                <button className="btn-hand" onClick={() => setShowMap(false)}>✕</button>
              </div>
              {/* Mini map SVG */}
              <div className="carnival-card overflow-hidden" style={{ background: '#E8F5E0' }}>
                <svg viewBox="0 0 600 450" width="100%" style={{ display: 'block' }}>
                  <rect width="600" height="450" fill="#E8F5E0"/>
                  {/* Paths */}
                  <rect x="0" y="200" width="600" height="50" fill="#F5E6C8" opacity="0.7"/>
                  <rect x="275" y="0" width="50" height="450" fill="#F5E6C8" opacity="0.7"/>
                  {/* Stalls */}
                  {SECTIONS.map((s) => {
                    const mx = (s.x / 3200) * 600;
                    const my = (s.y / 2400) * 450;
                    const visited = visitedSections.includes(s.id);
                    return (
                      <g key={s.id} style={{ cursor: 'pointer' }} onClick={() => { setShowMap(false); setActiveSection(s.id); }}>
                        <rect x={mx} y={my} width={38} height={34} rx={6}
                          fill={visited ? '#B8FFD4' : 'white'} stroke="#2D2016" strokeWidth="1.5"/>
                        <text x={mx + 19} y={my + 14} textAnchor="middle" dominantBaseline="middle" fontSize="14">
                          {s.emoji}
                        </text>
                        <text x={mx + 19} y={my + 44} textAnchor="middle" fontSize="8" fontFamily="Caveat, cursive" fill="#2D2016">
                          {s.name.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}
                  {/* Panda dot */}
                  <circle cx="300" cy="320" r="8" fill="#2D2016"/>
                  <text x="300" y="321" textAnchor="middle" dominantBaseline="middle" fontSize="10">🐼</text>
                </svg>
              </div>
              <p className="font-caveat text-sm mt-3 text-center" style={{ color: '#6B5744' }}>
                Click any area to visit it directly ✨
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth panel */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            className="fixed inset-0 z-30 flex items-center justify-center p-4"
            style={{ background: 'rgba(45,32,22,0.5)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowAuth(false); }}
          >
            <motion.div
              className="carnival-card p-6"
              style={{ background: '#FFF8F0', maxWidth: 400, width: '100%' }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-caveat text-2xl font-bold" style={{ color: '#2D2016' }}>🔐 Save your progress</h2>
                <button className="btn-hand" onClick={() => setShowAuth(false)}>✕</button>
              </div>
              {user ? (
                <div className="text-center space-y-4">
                  <div className="text-4xl">👤</div>
                  <p className="font-caveat text-xl" style={{ color: '#2D2016' }}>Signed in as {user.email}</p>
                  <p className="font-patrick text-sm" style={{ color: '#6B5744' }}>Your journal entries are automatically saved.</p>
                  <button className="btn-hand" onClick={() => setUser(null)}>Sign out</button>
                </div>
              ) : (
                <AuthForm onClose={() => setShowAuth(false)} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AuthForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const { signInWithEmail } = await import('@/lib/supabase');
      const result = await signInWithEmail(email);
      if (!result.error) setSent(true);
      else alert('Check your Supabase configuration. Running in local-only mode.');
    } catch {
      alert('Cloud sync not configured. Your entries are saved locally on this device.');
    }
  };

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="text-5xl">📧</div>
        <h3 className="font-caveat text-xl font-bold" style={{ color: '#2D2016' }}>Check your email!</h3>
        <p className="font-patrick text-base" style={{ color: '#6B5744' }}>We've sent a magic link to <strong>{email}</strong>. Click it to sign in.</p>
        <button className="btn-hand" onClick={onClose}>Got it!</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="font-patrick text-sm" style={{ color: '#6B5744' }}>
        Enter your email to save your journal entries across devices. No password needed.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="input-hand"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn-hand w-full" style={{ background: '#FFD4B8' }}>
          ✨ Send magic link
        </button>
      </form>
      <p className="font-patrick text-xs text-center" style={{ color: '#888' }}>
        Your entries are also saved locally on this device, even without signing in.
      </p>
    </div>
  );
}

