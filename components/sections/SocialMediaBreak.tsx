'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useJournalStore } from '@/lib/store';

const FUN_FACTS = [
  { fact: 'Bananas are berries, but strawberries aren\'t!', note: 'Talk about an identity crisis.' },
  { fact: 'Sea otters hold hands while they sleep so they don\'t drift apart.', note: '💕' },
  { fact: 'A group of flamingos is called a "flamboyance".', note: 'With a name like that, it\'s no wonder they\'re so fancy!' },
  { fact: 'Scotland\'s national animal is the unicorn.', note: 'Magical realism at its finest.' },
  { fact: 'An octopus has three hearts.', note: 'That\'s triple the love, but also triple the heartbreak!' },
  { fact: 'Cows have best friends and get stressed when they\'re apart.', note: 'Who knew cows were so emotionally deep?' },
  { fact: 'Bubble wrap was originally intended to be wallpaper.', note: 'Imagine living in a bubble!' },
  { fact: 'There\'s a species of jellyfish that can live forever.', note: 'It\'s called Turritopsis dohrnii.' },
];

const DARES = [
  'Do a 30-second plank on the floor 💪',
  'Walk to the nearest window and count how many birds or clouds you see ☁️',
  'Stand up and do 10 slow toe-touches 🦶',
  'Write down 3 things you love about your current surroundings ✍️',
  'Draw a smiley face and stick it somewhere visible 😊',
  'Go grab a glass of water and drink it all in one go 💧',
  'Find a comfortable spot, sit in silence for 1 minute, and listen 🤫',
  'Write a quick note of appreciation to someone in your life 💌',
  'Do five deep squats wherever you are 🏋️',
  'Smile for 20 seconds straight and notice how you feel 😄',
];

export default function SocialMediaBreak() {
  const { getEntry, setEntry } = useJournalStore();
  const [activeTab, setActiveTab] = useState<'emotions' | 'dares' | 'facts' | 'stories'>('emotions');
  const [currentFact, setCurrentFact] = useState(0);
  const [completedDares, setCompletedDares] = useState<Set<number>>(new Set());
  const [currentDare, setCurrentDare] = useState(Math.floor(Math.random() * DARES.length));

  const EMOTIONS = ['😊', '😢', '😡', '😰', '😍', '🥱', '😶', '🤩', '😔', '🥰'];
  const EMOTION_COLORS = ['#FFD700', '#6BB5FF', '#FF6B6B', '#D4B8FF', '#FFB8D4', '#B8D4FF', '#D4D4D4', '#FFD4B8', '#B8D4FF', '#FFB8D4'];

  return (
    <div className="space-y-5">
      <div className="carnival-card p-4" style={{ background: '#F5F0FF', borderColor: '#D4B8FF' }}>
        <p className="font-caveat text-lg italic" style={{ color: '#6B5744' }}>
          "Put your phone away. Let your brain be bored for a bit. Studies have shown that's actually important." 📵 — Ushma
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['emotions', 'dares', 'facts', 'stories'] as const).map((tab) => (
          <button key={tab} className="btn-hand" style={{ background: activeTab === tab ? '#D4B8FF' : '#FFF' }} onClick={() => setActiveTab(tab)}>
            {tab === 'emotions' ? '🎨 Emotions' : tab === 'dares' ? '🎲 I Dare You' : tab === 'facts' ? '🤓 Fun Facts' : '📖 Story Time'}
          </button>
        ))}
      </div>

      {activeTab === 'emotions' && (
        <div>
          <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>Reflect on your week & color your emotions 🎨</h3>
          <p className="font-patrick text-sm mb-4" style={{ color: '#6B5744' }}>Think about all the emotions you felt. How prominent was each one?</p>
          <div className="grid grid-cols-5 gap-3 mb-5">
            {EMOTIONS.map((emoji, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="text-3xl">{emoji}</div>
                <input
                  type="range" min="0" max="100"
                  style={{ accentColor: EMOTION_COLORS[i] }}
                  defaultValue={parseInt(getEntry('socialmedia', `emotion-${i}`)) || 50}
                  onChange={(e) => setEntry('socialmedia', `emotion-${i}`, e.target.value)}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          <textarea className="textarea-hand" rows={4} placeholder="What dominated your emotional landscape this week?" defaultValue={getEntry('socialmedia', 'weekReflect')} onChange={(e) => setEntry('socialmedia', 'weekReflect', e.target.value)} />
        </div>
      )}

      {activeTab === 'dares' && (
        <div className="text-center space-y-5">
          <h3 className="font-caveat text-xl font-bold" style={{ color: '#2D2016' }}>I dare you to... 🎲</h3>
          <motion.div
            className="carnival-card p-6"
            style={{ background: '#F5F0FF', borderColor: '#D4B8FF' }}
            key={currentDare}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-5xl mb-3">🎯</div>
            <p className="font-caveat text-2xl font-bold" style={{ color: '#2D2016' }}>{DARES[currentDare]}</p>
          </motion.div>
          <div className="flex gap-3 justify-center">
            <button className="btn-hand" style={{ background: '#D4B8FF' }} onClick={() => {
              setCompletedDares((prev) => new Set([...prev, currentDare]));
              setCurrentDare(Math.floor(Math.random() * DARES.length));
            }}>✅ Done! Next dare →</button>
            <button className="btn-hand" onClick={() => setCurrentDare(Math.floor(Math.random() * DARES.length))}>🔀 Different dare</button>
          </div>
          <p className="font-caveat text-lg" style={{ color: '#6B5744' }}>Completed: {completedDares.size} dares 🏆</p>
        </div>
      )}

      {activeTab === 'facts' && (
        <div>
          <h3 className="font-caveat text-xl font-bold mb-4" style={{ color: '#2D2016' }}>Did you know? 🤓</h3>
          <motion.div className="carnival-card p-6" style={{ background: '#F5F0FF', borderColor: '#D4B8FF' }} key={currentFact} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <p className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>{FUN_FACTS[currentFact].fact}</p>
            <p className="font-patrick text-sm italic" style={{ color: '#6B5744' }}>{FUN_FACTS[currentFact].note}</p>
          </motion.div>
          <div className="flex gap-3 mt-4 justify-center">
            <button className="btn-hand" style={{ background: '#D4B8FF' }} onClick={() => setCurrentFact((c) => (c + 1) % FUN_FACTS.length)}>Next fact →</button>
          </div>
        </div>
      )}

      {activeTab === 'stories' && (
        <div className="space-y-4">
          <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>Creative story writing 📖</h3>
          <div className="grid grid-cols-2 gap-3">
            {['What if I said yes?', 'The door only I can see', 'A letter to my future self', 'The day time froze'].map((prompt, i) => (
              <button key={i} className="carnival-card p-3 text-left" style={{ background: '#F5F0FF', borderColor: '#D4B8FF' }} onClick={() => setActiveTab('stories')}>
                <p className="font-caveat text-base font-bold" style={{ color: '#2D2016' }}>📝 {prompt}</p>
              </button>
            ))}
          </div>
          <textarea className="textarea-hand" rows={8} placeholder="Once upon a time..." defaultValue={getEntry('socialmedia', 'story')} onChange={(e) => setEntry('socialmedia', 'story', e.target.value)} />
        </div>
      )}
    </div>
  );
}
