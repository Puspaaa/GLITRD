'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ShopSection() {
  const [added, setAdded] = useState(false);

  return (
    <div className="space-y-6">
      {/* Book preview */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Book cover illustration */}
        <div className="flex-shrink-0 mx-auto">
          <div className="carnival-card p-4" style={{ background: '#FFF8F0', width: 180 }}>
            <div className="rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFD4B8, #D4B8FF)', height: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '3px solid #2D2016' }}>
              <div className="text-5xl mb-3">🐼</div>
              <p className="font-caveat text-xl font-bold text-center px-3" style={{ color: '#2D2016' }}>Get Lost in the Right Direction</p>
              <p className="font-patrick text-xs mt-3 text-center px-3" style={{ color: '#6B5744' }}>Ushma Asher & Riddhi Panchal</p>
            </div>
          </div>
        </div>

        {/* Book info */}
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="font-caveat text-3xl font-bold" style={{ color: '#2D2016' }}>Get Lost in the Right Direction</h2>
            <p className="font-patrick text-base mt-1" style={{ color: '#6B5744' }}>by Ushma Asher & Riddhi Panchal</p>
            <p className="font-patrick text-sm mt-1" style={{ color: '#888' }}>Illustrated by Himani Ruparelia</p>
          </div>

          <div className="flex gap-3 items-center flex-wrap">
            <span className="font-caveat text-3xl font-bold" style={{ color: '#2D2016' }}>₹499</span>
            <span className="font-patrick text-sm line-through" style={{ color: '#999' }}>₹699</span>
            <span className="font-caveat text-base px-3 py-1 rounded-full" style={{ background: '#B8FFD4', color: '#2D2016', border: '1.5px solid #2D2016' }}>Save 29%</span>
          </div>

          <div className="space-y-2">
            {['88 pages of non-linear journaling', 'Therapist-written personal stories', 'Creative activities & prompts', 'Black & white for you to color', 'Hardcover, hand-illustrated'].map((feat, i) => (
              <p key={i} className="font-patrick text-sm" style={{ color: '#444' }}>✨ {feat}</p>
            ))}
          </div>

          <motion.button
            className="btn-hand w-full text-xl py-4"
            style={{ background: added ? '#B8FFD4' : '#FFD4B8', fontSize: '1.2rem' }}
            onClick={() => setAdded(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {added ? '✅ Added to cart!' : '📖 Order the hardcopy'}
          </motion.button>

          {added && (
            <motion.div
              className="carnival-card p-4 text-center"
              style={{ background: '#F0FFF8', borderColor: '#B8FFD4' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="font-caveat text-lg" style={{ color: '#2D2016' }}>
                🎉 Thank you! You'll receive a confirmation email shortly.
              </p>
              <p className="font-patrick text-sm mt-1" style={{ color: '#6B5744' }}>
                Delivered within 5–7 business days across India.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* What's inside */}
      <div className="carnival-card p-5" style={{ background: '#FFF8F0', borderColor: '#FFD4B8' }}>
        <h3 className="font-caveat text-xl font-bold mb-3" style={{ color: '#2D2016' }}>What's inside 📖</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            ['🌸', 'Self-care'], ['☕', 'Tea with Anxiety'], ['🎨', 'Creativity & Inner Child'],
            ['📵', 'Social Media Break'], ['🕯️', 'Burnout'], ['🌿', 'Grounding'],
            ['🐘', 'Acceptance'], ['🎈', 'Goals & Dreams'], ['🎮', 'Habit Formation'],
            ['🎠', 'Joy of Flow'], ['🕊️', 'Forgiveness & Letting Go'], ['🪴', 'Gratitude'],
            ['🌻', 'Adult Friendships'], ['💕', 'Love Life'],
          ].map(([emoji, name]) => (
            <p key={name} className="font-patrick text-sm" style={{ color: '#444' }}>
              {emoji} {name}
            </p>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div>
        <h3 className="font-caveat text-xl font-bold mb-3" style={{ color: '#2D2016' }}>What readers say 💬</h3>
        <div className="grid grid-cols-1 gap-3">
          {[
            { text: '"This journal has been my companion through some of my toughest days. The exercises actually work."', name: 'Priya, 26' },
            { text: '"I love that it\'s not linear — I go to exactly what I need each day. The anxiety section alone was worth it."', name: 'Aryan, 24' },
            { text: '"The illustrations are beautiful and I love coloring while I reflect. This is unlike any journal I\'ve used."', name: 'Sneha, 28' },
          ].map((t, i) => (
            <div key={i} className="carnival-card p-4" style={{ background: '#FFFDF5', borderColor: '#FFD4B8' }}>
              <p className="font-caveat text-base italic" style={{ color: '#2D2016' }}>{t.text}</p>
              <p className="font-patrick text-xs mt-2" style={{ color: '#888' }}>— {t.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Authors */}
      <div className="carnival-card p-5" style={{ background: '#F0F5FF', borderColor: '#B8D4FF' }}>
        <h3 className="font-caveat text-xl font-bold mb-3" style={{ color: '#2D2016' }}>About the authors 🌟</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'Ushma Asher', emoji: '🌸', desc: 'Psychologist & therapist. Believes in making mental health personal, sustainable, and consistent.' },
            { name: 'Riddhi Panchal', emoji: '🌿', desc: 'Therapist & mental health advocate. Passionate about making healing accessible to everyone.' },
          ].map((a) => (
            <div key={a.name} className="text-center">
              <div className="text-4xl mb-2">{a.emoji}</div>
              <p className="font-caveat text-lg font-bold" style={{ color: '#2D2016' }}>{a.name}</p>
              <p className="font-patrick text-xs mt-1" style={{ color: '#6B5744' }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
