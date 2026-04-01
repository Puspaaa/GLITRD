'use client';

import { useState } from 'react';
import { useJournalStore } from '@/lib/store';

const LIFE_AREAS = ['Love', 'Friendship', 'Health', 'Work', 'Family', 'Travel', 'Hobbies'];
const AREA_COLORS = ['#FFB8D4', '#FFB8B8', '#B8FFD4', '#B8D4FF', '#FFD4B8', '#FFF5B8', '#D4B8FF'];

export default function LoveLIfe() {
  const { getEntry, setEntry } = useJournalStore();
  const [activeTab, setActiveTab] = useState<'story' | 'unfinished' | 'chart' | 'guide'>('story');
  const [slices, setSlices] = useState<number[]>(LIFE_AREAS.map(() => 14));

  const total = slices.reduce((a, b) => a + b, 0);
  let cumAngle = -Math.PI / 2;
  const pieSlices = slices.map((s, i) => {
    const angle = (s / total) * 2 * Math.PI;
    const x1 = 100 + Math.cos(cumAngle) * 80;
    const y1 = 100 + Math.sin(cumAngle) * 80;
    cumAngle += angle;
    const x2 = 100 + Math.cos(cumAngle) * 80;
    const y2 = 100 + Math.sin(cumAngle) * 80;
    const largeArc = angle > Math.PI ? 1 : 0;
    const midAngle = cumAngle - angle / 2;
    const tx = 100 + Math.cos(midAngle) * 52;
    const ty = 100 + Math.sin(midAngle) * 52;
    return { path: `M100,100 L${x1},${y1} A80,80 0 ${largeArc},1 ${x2},${y2} Z`, color: AREA_COLORS[i], label: LIFE_AREAS[i], emoji: ['💕', '🌸', '💪', '💼', '🏠', '✈️', '🎨'][i], tx, ty };
  });

  return (
    <div className="space-y-5">
      <div className="carnival-card p-4" style={{ background: '#FFF0F6', borderColor: '#FFB8D4' }}>
        <p className="font-caveat text-lg italic" style={{ color: '#6B5744' }}>
          "The reward is the journey; the end goal is just the bonus. Keep an open heart — good luck!" 💕 — Ushma
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['story', 'unfinished', 'chart', 'guide'] as const).map((tab) => (
          <button key={tab} className="btn-hand" style={{ background: activeTab === tab ? '#FFB8D4' : '#FFF' }} onClick={() => setActiveTab(tab)}>
            {tab === 'story' ? '💌 Reflect' : tab === 'unfinished' ? '📝 Unfinished' : tab === 'chart' ? '🥧 Life Pie' : '🗺️ Survival Guide'}
          </button>
        ))}
      </div>

      {activeTab === 'story' && (
        <div className="space-y-4">
          <div className="carnival-card p-4" style={{ background: '#FFF0F6', borderColor: '#FFB8D4' }}>
            <h3 className="font-caveat text-lg font-bold mb-2" style={{ color: '#2D2016' }}>What are your flaws and insecurities?</h3>
            <p className="font-patrick text-xs mb-2" style={{ color: '#888' }}>Be honest with yourself. How can you learn to love them?</p>
            <textarea className="textarea-hand" rows={4} placeholder="My insecurities are...&#10;I can love them by..." defaultValue={getEntry('lovelife', 'flaws')} onChange={(e) => setEntry('lovelife', 'flaws', e.target.value)} />
          </div>
          <div className="carnival-card p-4" style={{ background: '#FFF0F6', borderColor: '#FFB8D4' }}>
            <h3 className="font-caveat text-lg font-bold mb-2" style={{ color: '#2D2016' }}>Know your needs 💗</h3>
            <p className="font-patrick text-xs mb-2" style={{ color: '#888' }}>What do you want in a relationship? Be clear and unapologetic.</p>
            <textarea className="textarea-hand" rows={4} placeholder="I need..." defaultValue={getEntry('lovelife', 'needs')} onChange={(e) => setEntry('lovelife', 'needs', e.target.value)} />
          </div>
        </div>
      )}

      {activeTab === 'unfinished' && (
        <div>
          <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>Unfinished Business 📝</h3>
          <p className="font-patrick text-sm mb-3" style={{ color: '#6B5744' }}>
            Write a letter to someone in your past with whom you have unfinished business. Recognizing this helps you move on and gain clarity about what you want in future relationships.
          </p>
          <textarea className="textarea-hand" rows={10} placeholder="Dear ___,&#10;&#10;I've never said this but..." defaultValue={getEntry('lovelife', 'unfinished')} onChange={(e) => setEntry('lovelife', 'unfinished', e.target.value)} />
        </div>
      )}

      {activeTab === 'chart' && (
        <div>
          <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>How much of your mind is occupied by each area? 🥧</h3>
          <p className="font-patrick text-sm mb-4" style={{ color: '#6B5744' }}>Drag the sliders to reflect how much mental space each area of your life takes up.</p>
          <div className="flex flex-col items-center gap-4">
            <svg viewBox="0 0 200 200" width="200" height="200">
              {pieSlices.map((s, i) => (
                <g key={i}>
                  <path d={s.path} fill={s.color} stroke="#2D2016" strokeWidth="2"/>
                  <text x={s.tx} y={s.ty} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontFamily="Caveat, cursive" fill="#2D2016">{s.emoji}</text>
                </g>
              ))}
              <circle cx="100" cy="100" r="28" fill="white" stroke="#2D2016" strokeWidth="2"/>
              <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontFamily="Caveat, cursive" fill="#2D2016">💭</text>
            </svg>
            <div className="grid grid-cols-2 gap-2 w-full">
              {LIFE_AREAS.map((area, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: AREA_COLORS[i] }} />
                  <span className="font-caveat text-sm" style={{ color: '#2D2016', width: 80 }}>{area}</span>
                  <input type="range" min="1" max="40" value={slices[i]}
                    onChange={(e) => { const updated = [...slices]; updated[i] = parseInt(e.target.value); setSlices(updated); }}
                    style={{ accentColor: AREA_COLORS[i], flex: 1 }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'guide' && (
        <div className="space-y-3">
          <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>The Love Life Survival Guide 🗺️</h3>
          {[
            { icon: '👥', title: 'Misery loves company', desc: 'Build a community you can talk to, get support from, and possibly relate to.' },
            { icon: '💡', title: 'Know your needs', desc: 'Knowing what you want and being assertive about it saves countless heartbreaks.' },
            { icon: '🌟', title: 'Have a life beyond', desc: 'Hobbies, dreams, and travel plans aligned with your ideal life soften every blow.' },
            { icon: '😢', title: 'Allow grief', desc: 'Losses are painful. Even the loss of a potential you saw in someone. Cry it out. Rejoice — you\'re human.' },
            { icon: '🛋️', title: 'Go to therapy', desc: 'It helps unlearn harmful ideas and allows you to honour yourself enough to know what you deserve.' },
          ].map((item, i) => (
            <div key={i} className="carnival-card p-4" style={{ background: '#FFF0F6', borderColor: '#FFB8D4' }}>
              <p className="font-caveat text-lg font-bold" style={{ color: '#2D2016' }}>{item.icon} {item.title}</p>
              <p className="font-patrick text-sm mt-1" style={{ color: '#6B5744' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
