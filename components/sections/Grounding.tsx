'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournalStore } from '@/lib/store';

const SENSES = [
  { count: 5, sense: 'touch', emoji: '🤚', prompt: '5 things you can touch right now', color: '#B8FFD4' },
  { count: 4, sense: 'see', emoji: '👁️', prompt: '4 things you can see right now', color: '#B8D4FF' },
  { count: 3, sense: 'hear', emoji: '👂', prompt: '3 things you can hear right now', color: '#FFD4B8' },
  { count: 2, sense: 'smell', emoji: '👃', prompt: '2 things you can smell right now', color: '#D4B8FF' },
  { count: 1, sense: 'taste', emoji: '👅', prompt: '1 thing you can taste right now', color: '#FFB8D4' },
];

export default function Grounding() {
  const { getEntry, setEntry } = useJournalStore();
  const [step, setStep] = useState(-1);
  const [inputs, setInputs] = useState<Record<string, string[]>>({});

  const startExercise = () => { setStep(0); setInputs({}); };

  const updateInput = (sense: string, i: number, val: string) => {
    setInputs((prev) => {
      const arr = [...(prev[sense] || [])];
      arr[i] = val;
      return { ...prev, [sense]: arr };
    });
    const all = Object.values(inputs).flat().concat(val);
    setEntry('grounding', '54321', all.join('\n'));
  };

  return (
    <div className="space-y-6">
      <div className="carnival-card p-4" style={{ background: '#F0FFF8', borderColor: '#B8FFD4' }}>
        <p className="font-caveat text-lg italic" style={{ color: '#6B5744' }}>
          "Whenever I feel overwhelmed, I take a few deep breaths and focus on my surroundings using the 5-4-3-2-1 technique. It helps me regain control and approach challenges with clarity." 🌿 — Riddhi
        </p>
      </div>

      {step === -1 && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🌿</div>
          <h3 className="font-caveat text-2xl font-bold mb-3" style={{ color: '#2D2016' }}>The 5-4-3-2-1 Grounding Exercise</h3>
          <p className="font-patrick text-base mb-6" style={{ color: '#6B5744' }}>Take a few deep breaths. Then, notice the world around you through each sense.</p>
          <button className="btn-hand" style={{ background: '#B8FFD4', fontSize: '1.2rem', padding: '14px 28px' }} onClick={startExercise}>
            🌱 Begin grounding
          </button>
        </div>
      )}

      {step >= 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-caveat text-xl font-bold" style={{ color: '#2D2016' }}>
              Step {step + 1} of 5
            </h3>
            <div className="flex gap-1">
              {SENSES.map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full border-2" style={{ borderColor: '#2D2016', background: i <= step ? '#B8FFD4' : '#FFF' }} />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="carnival-card p-5"
              style={{ background: SENSES[step].color, borderColor: '#2D2016' }}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
            >
              <div className="text-4xl mb-2">{SENSES[step].emoji}</div>
              <h4 className="font-caveat text-2xl font-bold mb-4" style={{ color: '#2D2016' }}>{SENSES[step].prompt}</h4>
              <div className="space-y-2">
                {[...Array(SENSES[step].count)].map((_, i) => (
                  <input
                    key={i}
                    className="input-hand"
                    placeholder={`${i + 1}.`}
                    value={inputs[SENSES[step].sense]?.[i] || ''}
                    onChange={(e) => updateInput(SENSES[step].sense, i, e.target.value)}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-3 justify-between">
            {step > 0 && <button className="btn-hand" onClick={() => setStep(step - 1)}>← Back</button>}
            {step < 4 && <button className="btn-hand ml-auto" style={{ background: '#B8FFD4' }} onClick={() => setStep(step + 1)}>Next →</button>}
            {step === 4 && (
              <motion.button
                className="btn-hand ml-auto"
                style={{ background: '#B8FFD4' }}
                onClick={() => setStep(5)}
                whileHover={{ scale: 1.05 }}
              >
                ✨ I'm grounded!
              </motion.button>
            )}
          </div>

          {step === 5 && (
            <motion.div
              className="carnival-card p-6 text-center"
              style={{ background: '#F0FFF8', borderColor: '#B8FFD4' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              <div className="text-5xl mb-3">🌿</div>
              <h3 className="font-caveat text-2xl font-bold mb-2" style={{ color: '#2D2016' }}>You're grounded 💚</h3>
              <p className="font-patrick" style={{ color: '#6B5744' }}>No matter what's happening around you, you have the power to stay present.</p>
              <button className="btn-hand mt-4" onClick={() => setStep(-1)}>Do it again</button>
            </motion.div>
          )}
        </div>
      )}

      <div>
        <h3 className="font-caveat text-xl font-bold mb-3" style={{ color: '#2D2016' }}>More mindfulness activities 🧘</h3>
        <div className="space-y-2">
          {[
            'Count backwards from 100 by 7',
            'Pick up an object and describe it in detail: color, texture, size, weight, scent',
            'Spell your full name backwards, then the names of 3 other people',
            'Choose 3 categories (movies, countries, animals) and name as many items as you can',
          ].map((a, i) => (
            <div key={i} className="carnival-card p-3" style={{ background: '#F0FFF8', borderColor: '#B8FFD4' }}>
              <p className="font-patrick text-sm" style={{ color: '#2D2016' }}>🌱 {a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
