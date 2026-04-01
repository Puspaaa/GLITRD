'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournalStore, FriendFlower } from '@/lib/store';

const FLOWER_TYPES = [
  { type: 'sunflower' as const, emoji: '🌻', label: 'Sunflower (inspires you)' },
  { type: 'rose' as const, emoji: '🌹', label: 'Rose (deep love)' },
  { type: 'daisy' as const, emoji: '🌼', label: 'Daisy (brings calm)' },
  { type: 'tulip' as const, emoji: '🌷', label: 'Tulip (new beginnings)' },
  { type: 'lavender' as const, emoji: '💜', label: 'Lavender (healing)' },
];

const FLOWER_EMOJIS = { sunflower: '🌻', rose: '🌹', daisy: '🌼', tulip: '🌷', lavender: '💜' };

const REFLECTION_PROMPTS = [
  "What's something that's common about ALL of your friends?",
  "What's one word that ALL of your friends would use to describe you?",
  "How does your relationship with your family influence your friendships?",
  "What insecurities do you observe in ALL of your friendships?",
  "Who would you look for first if you walked into a room full of people?",
];

export default function FriendshipGarden() {
  const { friends, addFriend, removeFriend, getEntry, setEntry } = useJournalStore();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [flowerType, setFlowerType] = useState<FriendFlower['flowerType']>('sunflower');
  const [color, setColor] = useState('#FFD4B8');
  const [activeTab, setActiveTab] = useState<'garden' | 'reflect' | 'lost'>('garden');
  const [hoveredFriend, setHoveredFriend] = useState<string | null>(null);

  const handleAdd = () => {
    if (!name.trim()) return;
    addFriend({ name, description: desc, flowerType, color });
    setName('');
    setDesc('');
  };

  return (
    <div className="space-y-6">
      <div className="carnival-card p-4" style={{ background: '#FFF5F5', borderColor: '#FFB8B8' }}>
        <p className="font-caveat text-lg italic" style={{ color: '#6B5744' }}>
          "I lost a lot of friends in my adolescence and met my closest friends in my adulthood. At 27, I'm still meeting some of my favorite people. Keep an open heart." 🌸 — Ushma
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['garden', 'reflect', 'lost'] as const).map((tab) => (
          <button
            key={tab}
            className="btn-hand"
            style={{ background: activeTab === tab ? '#FFB8B8' : '#FFF' }}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'garden' ? '🌷 My Garden' : tab === 'reflect' ? '🔍 Patterns' : '💌 Lost Friend'}
          </button>
        ))}
      </div>

      {activeTab === 'garden' && (
        <div className="space-y-5">
          {/* Add a friend */}
          <div className="carnival-card p-5" style={{ background: '#FFF5F5', borderColor: '#FFB8B8' }}>
            <h3 className="font-caveat text-xl font-bold mb-3" style={{ color: '#2D2016' }}>🌱 Plant a flower for a friend</h3>
            <div className="space-y-3">
              <input className="input-hand" placeholder="Friend's name" value={name} onChange={(e) => setName(e.target.value)} />
              <input className="input-hand" placeholder="What makes them special?" value={desc} onChange={(e) => setDesc(e.target.value)} />
              <div className="flex gap-2 flex-wrap">
                {FLOWER_TYPES.map((f) => (
                  <button
                    key={f.type}
                    className="btn-hand text-sm"
                    style={{ background: flowerType === f.type ? '#FFB8B8' : '#FFF' }}
                    onClick={() => setFlowerType(f.type)}
                  >
                    {f.emoji} {f.label.split(' (')[0]}
                  </button>
                ))}
              </div>
              <button className="btn-hand" style={{ background: '#FFB8B8' }} onClick={handleAdd}>
                🌸 Plant this flower
              </button>
            </div>
          </div>

          {/* Garden display */}
          {friends.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">🌱</div>
              <p className="font-caveat text-xl" style={{ color: '#6B5744' }}>Your garden is waiting to bloom! Add your first friend.</p>
            </div>
          ) : (
            <div>
              <h3 className="font-caveat text-xl font-bold mb-3" style={{ color: '#2D2016' }}>Your friendship garden 🌺</h3>
              {/* Garden SVG background */}
              <div className="carnival-card overflow-hidden" style={{ background: '#E8F5E0', minHeight: 200, position: 'relative' }}>
                <svg viewBox="0 0 600 180" width="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                  <rect width="600" height="180" fill="#E8F5E0"/>
                  {/* Ground */}
                  <ellipse cx="300" cy="175" rx="300" ry="20" fill="#C8E8A0"/>
                  <rect x="0" y="160" width="600" height="20" fill="#A8D880"/>
                  {/* Sun */}
                  <circle cx="560" cy="30" r="22" fill="#FFD700"/>
                  {/* Clouds */}
                  <ellipse cx="100" cy="25" rx="45" ry="18" fill="white" opacity="0.7"/>
                  <ellipse cx="130" cy="20" rx="30" ry="15" fill="white" opacity="0.7"/>
                  <ellipse cx="300" cy="15" rx="40" ry="14" fill="white" opacity="0.5"/>
                </svg>
                {/* Flowers */}
                <div className="relative flex flex-wrap gap-4 p-6 pt-8" style={{ minHeight: 180 }}>
                  {friends.map((friend, i) => (
                    <motion.div
                      key={friend.id}
                      className="flex flex-col items-center cursor-pointer"
                      style={{ zIndex: 2, position: 'relative' }}
                      onMouseEnter={() => setHoveredFriend(friend.id)}
                      onMouseLeave={() => setHoveredFriend(null)}
                      initial={{ scale: 0, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ delay: i * 0.1, type: 'spring', damping: 12 }}
                    >
                      <motion.div
                        className="text-4xl"
                        animate={{ rotate: hoveredFriend === friend.id ? [0, -10, 10, 0] : 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {FLOWER_EMOJIS[friend.flowerType]}
                      </motion.div>
                      <p className="font-caveat text-sm font-bold text-center mt-1" style={{ color: '#2D2016', maxWidth: 70 }}>
                        {friend.name}
                      </p>
                      <AnimatePresence>
                        {hoveredFriend === friend.id && (
                          <motion.div
                            className="absolute -top-16 left-1/2 carnival-card p-2 whitespace-nowrap"
                            style={{ transform: 'translateX(-50%)', background: '#FFF', zIndex: 10, fontSize: 12 }}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                          >
                            <p className="font-caveat text-sm" style={{ color: '#2D2016', maxWidth: 180, whiteSpace: 'normal' }}>{friend.description || 'Special to me 🌸'}</p>
                            <button className="text-xs text-red-400 mt-1" onClick={() => removeFriend(friend.id)}>Remove</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reflect' && (
        <div className="space-y-4">
          <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>Find patterns in your friendships 🔍</h3>
          {REFLECTION_PROMPTS.map((prompt, i) => (
            <div key={i} className="carnival-card p-4" style={{ background: '#FFF5F5', borderColor: '#FFB8B8' }}>
              <p className="font-caveat text-base font-bold mb-2" style={{ color: '#2D2016' }}>{prompt}</p>
              <textarea
                className="textarea-hand"
                rows={3}
                placeholder="Reflect here..."
                defaultValue={getEntry('friendships', `reflect-${i}`)}
                onChange={(e) => setEntry('friendships', `reflect-${i}`, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'lost' && (
        <div className="space-y-5">
          <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>A letter to a friend you lost 💌</h3>
          <p className="font-patrick text-sm" style={{ color: '#6B5744' }}>
            "I was lucky enough to have a friendship to miss in the first place." — Ushma
          </p>
          <textarea
            className="textarea-hand"
            rows={10}
            placeholder="Dear ___,&#10;&#10;I miss you because..."
            defaultValue={getEntry('friendships', 'lostFriend')}
            onChange={(e) => setEntry('friendships', 'lostFriend', e.target.value)}
          />
          <div className="carnival-card p-4" style={{ background: '#FFF5F5', borderColor: '#FFB8B8' }}>
            <h4 className="font-caveat text-lg font-bold mb-2" style={{ color: '#2D2016' }}>5 ways to navigate adult friendships</h4>
            {[
              'Learn the art of detachment — friends will have different priorities. That doesn\'t mean they don\'t care.',
              'Identify your "core" friendships — the people who know you in and out and have your best interests.',
              'Express gratitude — there are a thousand ways. Find what\'s most suitable for you.',
              'Don\'t take rejection personally — not every connection is meant to be lifelong.',
              'There is no right age to make friends — keep an open heart.',
            ].map((tip, i) => (
              <p key={i} className="font-patrick text-sm py-1 border-b border-dashed last:border-0" style={{ color: '#444', borderColor: '#FFB8B8' }}>
                <strong>{i + 1}.</strong> {tip}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
