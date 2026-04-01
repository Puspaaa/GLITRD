'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useJournalStore } from '@/lib/store';

export default function Burnout() {
  const { getEntry, setEntry } = useJournalStore();
  const [flame, setFlame] = useState(0.8);

  return (
    <div className="space-y-6">
      <div className="carnival-card p-4" style={{ background: '#FFFAF0', borderColor: '#FFE5B8' }}>
        <p className="font-caveat text-lg italic" style={{ color: '#6B5744' }}>
          "A candle with the highest flames also burns the fastest. Balance your work with rest, stress management, and hobbies." 🕯️ — Riddhi
        </p>
      </div>

      {/* Animated candle */}
      <div className="flex flex-col items-center py-4">
        <div className="relative flex flex-col items-center">
          <motion.div
            className="text-4xl"
            animate={{ scaleY: [1, 1.1, 0.95, 1.05, 1], scaleX: [1, 0.95, 1.05, 0.98, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ color: '#FF8C42', transformOrigin: 'bottom' }}
          >
            🔥
          </motion.div>
          <div style={{ width: 30, height: 120, background: `linear-gradient(to bottom, #FFD700, #FFF5B8)`, borderRadius: '4px 4px 2px 2px', border: '2px solid #E0C060' }} />
        </div>
        <div className="flex items-center gap-4 mt-4">
          <button className="btn-hand" style={{ background: '#FFE5B8' }} onClick={() => setFlame(Math.max(0, flame - 0.2))}>
            💨 Blow a little
          </button>
          <span className="font-caveat text-lg" style={{ color: '#6B5744' }}>Flame: {Math.round(flame * 100)}%</span>
          <button className="btn-hand" style={{ background: '#FFF' }} onClick={() => setFlame(1)}>
            🔥 Relight
          </button>
        </div>
        <p className="font-patrick text-sm mt-2 text-center" style={{ color: '#6B5744', maxWidth: 320 }}>
          Your energy works like a candle. Rest a little. Lower the flame.
        </p>
      </div>

      <div>
        <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>What's something simple you've always wanted to do but never had time for?</h3>
        <textarea className="textarea-hand" rows={4} placeholder="Make a list..." defaultValue={getEntry('burnout', 'simpleThings')} onChange={(e) => setEntry('burnout', 'simpleThings', e.target.value)} />
        <p className="font-patrick text-sm mt-2" style={{ color: '#6B5744' }}>
          ✨ Pick ONE from your list and commit to just 5 minutes of it today.
        </p>
        <input className="input-hand mt-2" placeholder="I will try: ..." defaultValue={getEntry('burnout', 'pickOne')} onChange={(e) => setEntry('burnout', 'pickOne', e.target.value)} />
      </div>

      <div>
        <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>List things that refill your tank 🚗</h3>
        <p className="font-patrick text-sm mb-3" style={{ color: '#6B5744' }}>Just as a vehicle requires regular fueling, humans need periodic breaks to replenish their resources.</p>
        <textarea className="textarea-hand" rows={5} placeholder="Things that restore me:&#10;- A walk outside&#10;- Cooking something I love&#10;- ..." defaultValue={getEntry('burnout', 'tankRefill')} onChange={(e) => setEntry('burnout', 'tankRefill', e.target.value)} />
      </div>
    </div>
  );
}
