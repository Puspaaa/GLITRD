'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SECTIONS_PREVIEW = [
  { emoji: '☕', label: 'Tea with Anxiety', color: '#B8D4FF' },
  { emoji: '🎨', label: 'Creativity & Inner Child', color: '#FFD4B8' },
  { emoji: '🎠', label: 'Joy of Flow', color: '#D4B8FF' },
  { emoji: '🕊️', label: 'Forgiveness & Letting Go', color: '#D4FFB8' },
  { emoji: '🌻', label: 'Friendship Garden', color: '#FFB8B8' },
  { emoji: '🎮', label: 'Habit Arcade', color: '#B8FFFF' },
];

export default function LandingPage() {
  const router = useRouter();
  const [entering, setEntering] = useState(false);

  const handleEnter = () => {
    setEntering(true);
    setTimeout(() => router.push('/carnival'), 800);
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-auto"
      style={{ background: 'linear-gradient(160deg, #FFF8F0 0%, #F0F5FF 50%, #F5FFF0 100%)', minHeight: '100vh' }}
    >
      {/* Floating decorative elements */}
      {['🌸', '✨', '🦋', '🌟', '💫', '🎪', '🌈', '🍃'].map((emoji, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none select-none"
          style={{
            left: `${[8, 88, 15, 80, 5, 92, 45, 70][i]}%`,
            top: `${[12, 8, 75, 80, 45, 40, 5, 60][i]}%`,
            fontSize: '2rem',
            opacity: 0.25,
          }}
          animate={{ y: [0, -14, 0], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Main card */}
      <motion.div
        className="carnival-card p-8 md:p-12 max-w-2xl w-full text-center relative"
        style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', zIndex: 1 }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: entering ? 0 : 1, y: entering ? -40 : 0, scale: entering ? 0.95 : 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Panda hero */}
        <motion.div
          className="text-8xl mb-4 inline-block"
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          🐼
        </motion.div>

        <h1 className="font-caveat text-5xl md:text-6xl font-bold leading-tight mb-1" style={{ color: '#2D2016' }}>
          Get Lost in the
        </h1>
        <h1 className="font-caveat text-5xl md:text-6xl font-bold mb-4" style={{ color: '#2D2016' }}>
          Right Direction
        </h1>

        <p className="font-patrick text-lg mb-1" style={{ color: '#6B5744' }}>
          by Ushma Asher & Riddhi Panchal
        </p>
        <p className="font-patrick text-sm mb-6" style={{ color: '#999' }}>
          Illustrated by Himani Ruparelia
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-0.5 rounded" style={{ background: '#FFD4B8' }} />
          <span className="text-2xl">🎪</span>
          <div className="flex-1 h-0.5 rounded" style={{ background: '#D4B8FF' }} />
        </div>

        <p className="font-patrick text-base leading-relaxed mb-6" style={{ color: '#6B5744' }}>
          A mental wellness journal brought to life as an interactive carnival. Walk your panda through 14 themed areas — each one a section of the journal, complete with activities, reflections, and a little magic.
        </p>

        {/* Section previews */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          {SECTIONS_PREVIEW.map((s) => (
            <motion.div
              key={s.label}
              className="carnival-card p-3 text-center"
              style={{ background: s.color }}
              whileHover={{ scale: 1.05, y: -3 }}
            >
              <div className="text-2xl">{s.emoji}</div>
              <p className="font-caveat text-xs mt-1 leading-tight" style={{ color: '#2D2016' }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="space-y-3 mb-6">
          <motion.button
            className="btn-hand w-full py-5"
            style={{ background: 'linear-gradient(135deg, #FFD4B8, #D4B8FF)', fontSize: '1.4rem' }}
            whileHover={{ scale: 1.02, boxShadow: '6px 6px 0px #2D2016' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEnter}
          >
            🐼 Enter the Carnival ✨
          </motion.button>

          <a href="/shop" className="btn-hand block w-full text-center py-3" style={{ background: '#FFF5B8', fontSize: '1rem' }}>
            📖 Order the physical book
          </a>
        </div>

        <p className="font-patrick text-sm mb-6" style={{ color: '#888' }}>
          Free to use • No account needed • Entries saved to your device
        </p>

        {/* How to play */}
        <div className="p-4 rounded-xl text-left" style={{ background: '#FFF8F0', border: '1.5px dashed #D4B8FF' }}>
          <p className="font-caveat text-base font-bold mb-2 text-center" style={{ color: '#2D2016' }}>How to explore the carnival 🗺️</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['⌨️', 'Arrow keys or WASD to walk'],
              ['🎮', 'Touch joystick on mobile'],
              ['💭', '"How do I feel?" to jump to what you need'],
              ['[Space]', 'Enter a stall when the prompt appears'],
            ].map(([icon, desc]) => (
              <p key={desc} className="font-patrick text-xs" style={{ color: '#6B5744' }}>
                <strong>{icon}</strong> {desc}
              </p>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.p
        className="font-patrick text-sm mt-6 text-center"
        style={{ color: '#888', zIndex: 1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Made with 💕 for healing even when it's tedious
      </motion.p>
    </main>
  );
}
