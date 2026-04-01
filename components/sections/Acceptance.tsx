'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useJournalStore } from '@/lib/store';

export default function Acceptance() {
  const { getEntry, setEntry } = useJournalStore();
  const [elephantColored, setElephantColored] = useState(false);
  const [elephantColor, setElephantColor] = useState('#FFB8F0');

  const COLORS = ['#FFB8F0', '#D4B8FF', '#B8D4FF', '#B8FFD4', '#FFD4B8', '#FFF5B8'];

  return (
    <div className="space-y-6">
      <div className="carnival-card p-4" style={{ background: '#FFF0FD', borderColor: '#FFB8F0' }}>
        <p className="font-caveat text-lg italic" style={{ color: '#6B5744' }}>
          "Acceptance was the catalyst for growth. By embracing our situation rather than resisting it, we open ourselves up to new experiences, lessons, and love." 🐘 — Riddhi
        </p>
      </div>

      {/* Pink elephant */}
      <div className="text-center">
        <h3 className="font-caveat text-xl font-bold mb-3" style={{ color: '#2D2016' }}>There's a pink elephant in the room 🐘</h3>
        <p className="font-patrick text-sm mb-4" style={{ color: '#6B5744' }}>No matter what you do, the first step is always acknowledging it. Choose your elephant's color:</p>
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          {COLORS.map((c) => (
            <button key={c} className="rounded-full border-2 w-8 h-8 transition-transform hover:scale-110"
              style={{ background: c, borderColor: elephantColor === c ? '#2D2016' : 'transparent', transform: elephantColor === c ? 'scale(1.2)' : undefined }}
              onClick={() => { setElephantColor(c); setElephantColored(true); }}
            />
          ))}
        </div>
        <motion.div
          className="inline-block"
          animate={elephantColored ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          <svg viewBox="0 0 220 180" width="220" height="180">
            {/* Body */}
            <ellipse cx="120" cy="110" rx="70" ry="55" fill={elephantColor} stroke="#2D2016" strokeWidth="2.5"/>
            {/* Head */}
            <circle cx="65" cy="80" r="42" fill={elephantColor} stroke="#2D2016" strokeWidth="2.5"/>
            {/* Ear */}
            <ellipse cx="30" cy="68" rx="22" ry="30" fill={elephantColor} stroke="#2D2016" strokeWidth="2"/>
            {/* Trunk */}
            <path d="M42 100 Q20 130 35 155 Q42 165 50 155 Q38 135 55 110" fill={elephantColor} stroke="#2D2016" strokeWidth="2.5"/>
            {/* Legs */}
            {[70, 100, 130, 155].map((x, i) => (
              <rect key={i} x={x} y={150} width={22} height={28} rx={8} fill={elephantColor} stroke="#2D2016" strokeWidth="2"/>
            ))}
            {/* Eye */}
            <circle cx="55" cy="70" r="6" fill="#2D2016"/>
            <circle cx="57" cy="68" r="2" fill="white"/>
            {/* Tail */}
            <path d="M190 105 Q210 90 205 115" stroke="#2D2016" strokeWidth="2.5" fill="none"/>
            {/* Spots if colored */}
            {elephantColored && (
              <>
                <circle cx="90" cy="95" r="8" fill="white" opacity="0.3"/>
                <circle cx="130" cy="120" r="6" fill="white" opacity="0.3"/>
              </>
            )}
          </svg>
        </motion.div>
        <p className="font-caveat text-base mt-2" style={{ color: '#6B5744' }}>
          {elephantColored ? `You acknowledged it! That's the first step. 💕` : 'Pick a color to acknowledge your elephant'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="carnival-card p-4" style={{ background: '#FFF0FD', borderColor: '#FFB8F0' }}>
          <h3 className="font-caveat text-lg font-bold mb-2" style={{ color: '#2D2016' }}>What are you struggling to accept?</h3>
          <textarea className="textarea-hand" rows={3} placeholder="Something I've been resisting..." defaultValue={getEntry('acceptance', 'struggling')} onChange={(e) => setEntry('acceptance', 'struggling', e.target.value)} />
        </div>
        <div className="carnival-card p-4" style={{ background: '#FFF0FD', borderColor: '#FFB8F0' }}>
          <h3 className="font-caveat text-lg font-bold mb-2" style={{ color: '#2D2016' }}>What have you been doing to avoid or control it?</h3>
          <textarea className="textarea-hand" rows={3} placeholder="I've been..." defaultValue={getEntry('acceptance', 'avoiding')} onChange={(e) => setEntry('acceptance', 'avoiding', e.target.value)} />
        </div>
        <div className="carnival-card p-4" style={{ background: '#FFF0FD', borderColor: '#FFB8F0' }}>
          <h3 className="font-caveat text-lg font-bold mb-2" style={{ color: '#2D2016' }}>Is it helping or making things harder?</h3>
          <textarea className="textarea-hand" rows={3} placeholder="Honestly..." defaultValue={getEntry('acceptance', 'helping')} onChange={(e) => setEntry('acceptance', 'helping', e.target.value)} />
        </div>
        <div className="carnival-card p-4" style={{ background: '#FFF0FD', borderColor: '#FFB8F0' }}>
          <h3 className="font-caveat text-lg font-bold mb-2" style={{ color: '#2D2016' }}>What would happen if you just let the situation be?</h3>
          <textarea className="textarea-hand" rows={3} placeholder="If I accepted it..." defaultValue={getEntry('acceptance', 'letBe')} onChange={(e) => setEntry('acceptance', 'letBe', e.target.value)} />
        </div>
      </div>

      {/* Affirmations */}
      <div className="carnival-card p-5 text-center" style={{ background: '#FFF0FD', borderColor: '#FFB8F0' }}>
        <h3 className="font-caveat text-xl font-bold mb-4" style={{ color: '#2D2016' }}>Say this out loud 🗣️</h3>
        {[
          "What didn't happen wasn't supposed to.",
          'I accept what I cannot change.',
          'I make peace with the story of my life.',
        ].map((aff, i) => (
          <motion.p
            key={i}
            className="font-caveat text-xl my-3 p-3 rounded-xl"
            style={{ background: COLORS[i], color: '#2D2016' }}
            whileHover={{ scale: 1.02 }}
          >
            ✨ {aff}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
