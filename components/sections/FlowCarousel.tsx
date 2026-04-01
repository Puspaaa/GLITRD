'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useJournalStore } from '@/lib/store';

export default function FlowCarousel() {
  const { getEntry, setEntry } = useJournalStore();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [activeTab, setActiveTab] = useState<'intro' | 'find' | 'tree' | 'balance'>('intro');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (spinning) {
      interval = setInterval(() => setRotation((r) => r + 2), 16);
    }
    return () => clearInterval(interval);
  }, [spinning]);

  return (
    <div className="space-y-5">
      <div className="carnival-card p-4" style={{ background: '#F0F5FF', borderColor: '#B8D4FF' }}>
        <p className="font-caveat text-lg italic" style={{ color: '#6B5744' }}>
          "Flow is like being in the zone — where everything clicks and you feel unstoppable. It's not about doing something easy (that gets boring fast!) or impossibly hard (hello, frustration!). It's finding that perfect challenge." 🎠
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['intro', 'find', 'tree', 'balance'] as const).map((tab) => (
          <button key={tab} className="btn-hand" style={{ background: activeTab === tab ? '#B8D4FF' : '#FFF' }} onClick={() => setActiveTab(tab)}>
            {tab === 'intro' ? '🎠 Carousel' : tab === 'find' ? '🔍 Find Flow' : tab === 'tree' ? '🌳 Life Tree' : '⚖️ Balance'}
          </button>
        ))}
      </div>

      {activeTab === 'intro' && (
        <div className="text-center space-y-5">
          <h3 className="font-caveat text-2xl font-bold" style={{ color: '#2D2016' }}>Hop on the Flow Carousel 🎠</h3>
          <div className="relative flex justify-center items-center" style={{ height: 200 }}>
            <motion.div animate={{ rotate: rotation }} style={{ width: 180, height: 180, position: 'relative' }}>
              {['🎨', '🎵', '📚', '🏃', '🧘', '🍳', '💻', '✍️'].map((emoji, i) => {
                const angle = (i / 8) * Math.PI * 2;
                return (
                  <div key={i} className="absolute text-3xl" style={{ left: 75 + Math.cos(angle) * 70, top: 75 + Math.sin(angle) * 70 }}>
                    {emoji}
                  </div>
                );
              })}
              <div className="absolute inset-0 flex items-center justify-center text-5xl">🐼</div>
            </motion.div>
          </div>
          <button className="btn-hand" style={{ background: spinning ? '#FFB8B8' : '#B8D4FF' }} onClick={() => setSpinning(!spinning)}>
            {spinning ? '⏹️ Stop spinning' : '▶️ Spin to find flow!'}
          </button>
          <p className="font-patrick text-sm" style={{ color: '#6B5744' }}>
            Think of the activity that came to mind while the carousel spun. That might be your flow.
          </p>
        </div>
      )}

      {activeTab === 'find' && (
        <div className="space-y-4">
          <h3 className="font-caveat text-xl font-bold" style={{ color: '#2D2016' }}>Let's help you find your flow 🔍</h3>
          <p className="font-patrick text-sm" style={{ color: '#6B5744' }}>Imagine your perfect day where time flies because you're doing something you love.</p>
          <textarea className="textarea-hand" rows={6} placeholder="On my perfect day, I'd be doing...&#10;I'd be in...&#10;It would feel like..." defaultValue={getEntry('flow', 'perfectDay')} onChange={(e) => setEntry('flow', 'perfectDay', e.target.value)} />
          <div className="carnival-card p-4" style={{ background: '#F0F5FF', borderColor: '#B8D4FF' }}>
            <h4 className="font-caveat text-lg font-bold mb-2" style={{ color: '#2D2016' }}>Which parts can you bring into your daily life?</h4>
            <p className="font-patrick text-xs mb-2" style={{ color: '#6B5744' }}>Example: If your ideal day is being in nature, how can you incorporate that into your everyday routine?</p>
            <textarea className="textarea-hand" rows={4} placeholder="I could..." defaultValue={getEntry('flow', 'integrate')} onChange={(e) => setEntry('flow', 'integrate', e.target.value)} />
          </div>
        </div>
      )}

      {activeTab === 'tree' && (
        <div className="space-y-4">
          <h3 className="font-caveat text-xl font-bold" style={{ color: '#2D2016' }}>If your life were a tree 🌳</h3>
          <p className="font-patrick text-sm" style={{ color: '#6B5744' }}>Each branch would represent something that makes you feel deeply engaged. Write as many as come to mind.</p>
          <div className="flex justify-center">
            <svg viewBox="0 0 300 260" width="280" height="260">
              <rect x="140" y="200" width="20" height="55" fill="#8B6914" rx="4"/>
              <ellipse cx="150" cy="160" rx="80" ry="60" fill="#5DBB63"/>
              <ellipse cx="110" cy="140" rx="55" ry="45" fill="#45A049"/>
              <ellipse cx="190" cy="140" rx="55" ry="45" fill="#45A049"/>
              <ellipse cx="150" cy="120" rx="50" ry="40" fill="#5DBB63"/>
              {/* Branch labels area */}
              <text x="72" y="145" fontFamily="Caveat" fontSize="10" fill="white" textAnchor="middle">🎵</text>
              <text x="228" y="145" fontFamily="Caveat" fontSize="10" fill="white" textAnchor="middle">🎨</text>
              <text x="150" y="115" fontFamily="Caveat" fontSize="10" fill="white" textAnchor="middle">✍️</text>
              <text x="150" y="175" fontFamily="Caveat" fontSize="10" fill="white" textAnchor="middle">🏃</text>
            </svg>
          </div>
          <textarea className="textarea-hand" rows={6} placeholder="My flow branches:&#10;- When I paint...&#10;- When I play music...&#10;- When I cook...&#10;- When I write...&#10;- When I exercise..." defaultValue={getEntry('flow', 'tree')} onChange={(e) => setEntry('flow', 'tree', e.target.value)} />
        </div>
      )}

      {activeTab === 'balance' && (
        <div className="space-y-4">
          <h3 className="font-caveat text-xl font-bold" style={{ color: '#2D2016' }}>Finding the middle ground ⚖️</h3>
          <p className="font-patrick text-sm" style={{ color: '#6B5744' }}>Imagine a day where your responsibilities intersect effortlessly with your passions. What small change could you make to bring that balance into your life?</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="carnival-card p-4" style={{ background: '#F0F5FF', borderColor: '#B8D4FF' }}>
              <p className="font-caveat text-lg font-bold mb-2">My responsibilities 📋</p>
              <textarea className="textarea-hand" rows={4} placeholder="Work, family, health..." defaultValue={getEntry('flow', 'responsibilities')} onChange={(e) => setEntry('flow', 'responsibilities', e.target.value)} />
            </div>
            <div className="carnival-card p-4" style={{ background: '#F0F5FF', borderColor: '#B8D4FF' }}>
              <p className="font-caveat text-lg font-bold mb-2">My passions 🎯</p>
              <textarea className="textarea-hand" rows={4} placeholder="Art, music, nature..." defaultValue={getEntry('flow', 'passions')} onChange={(e) => setEntry('flow', 'passions', e.target.value)} />
            </div>
          </div>
          <div className="carnival-card p-4" style={{ background: '#F0F5FF', borderColor: '#B8D4FF' }}>
            <p className="font-caveat text-lg font-bold mb-2">One small change I can make ✨</p>
            <textarea className="textarea-hand" rows={3} placeholder="I could..." defaultValue={getEntry('flow', 'smallChange')} onChange={(e) => setEntry('flow', 'smallChange', e.target.value)} />
          </div>
        </div>
      )}
    </div>
  );
}
