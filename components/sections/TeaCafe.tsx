'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournalStore } from '@/lib/store';

export default function TeaCafe() {
  const { getEntry, setEntry } = useJournalStore();
  const [worry, setWorry] = useState(getEntry('anxiety', 'worry') || '');
  const [showTeaSteam, setShowTeaSteam] = useState(false);
  const [butterflying, setButterflying] = useState(false);
  const [butterflyCount, setButterflyCount] = useState(0);
  const [safeSpace, setSafeSpace] = useState(getEntry('anxiety', 'safeSpace') || '');
  const [circleControl, setCircleControl] = useState(getEntry('anxiety', 'circleControl') || '');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);

  const serveWorry = () => {
    if (!worry.trim()) return;
    setEntry('anxiety', 'worry', worry);
    setShowTeaSteam(true);
    setTimeout(() => setShowTeaSteam(false), 3000);
  };

  const startButterflyHug = () => {
    if (timerRunning) return;
    setButterflying(true);
    setTimerRunning(true);
    setTimeLeft(30);
    let count = 0;
    timerRef.current = setInterval(() => {
      count++;
      setButterflyCount((c) => c + 1);
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setTimerRunning(false);
          setButterflying(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Therapist Story */}
      <div className="carnival-card p-5" style={{ borderColor: '#B8D4FF', background: '#F0F5FF' }}>
        <p className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>A word from your therapist... ☕</p>
        <p className="font-patrick text-base leading-relaxed" style={{ color: '#444' }}>
          When an unwelcome guest arrives, you don't shoo them away. You invite them in, kindly — keep conversations brief, but let them in. Your anxiety is exactly like that unwelcome guest. Invite it in for tea. Ask it what brings it here. Let it pass.
        </p>
        <p className="font-caveat text-base mt-3 italic" style={{ color: '#6B5744' }}>
          "The more you engage, the longer it lingers. Have some tea and let it pass." 🌸
        </p>
      </div>

      {/* Tea Cup Worry Feeder */}
      <div>
        <h3 className="font-caveat text-xl font-bold mb-3" style={{ color: '#2D2016' }}>Feed me your worries ☕</h3>
        <p className="font-patrick text-sm mb-3" style={{ color: '#6B5744' }}>Write your worry into the teacup. Make it tangible. Let it steep.</p>
        <div className="relative">
          <textarea
            className="textarea-hand"
            rows={3}
            placeholder="What's brewing in your mind right now?"
            value={worry}
            onChange={(e) => setWorry(e.target.value)}
          />
          <AnimatePresence>
            {showTeaSteam && (
              <motion.div
                className="absolute top-0 left-1/2 pointer-events-none"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 1, 1, 0], y: [-10, -50] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.5 }}
              >
                <span className="text-3xl">☁️</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex gap-3 mt-3">
          <button className="btn-hand" style={{ background: '#B8D4FF' }} onClick={serveWorry}>
            ☕ Serve it tea
          </button>
          <button
            className="btn-hand"
            style={{ background: '#E8F5FF' }}
            onClick={() => { setWorry(''); setEntry('anxiety', 'worry', ''); }}
          >
            Let it pass 🌬️
          </button>
        </div>
      </div>

      {/* Circle of Control */}
      <div>
        <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>Focus on your circle of control 🎯</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="carnival-card p-4 text-center" style={{ background: '#E8F5FF', borderColor: '#B8D4FF' }}>
            <p className="font-caveat text-lg font-bold mb-2">In my control ✅</p>
            <textarea
              className="textarea-hand"
              rows={3}
              placeholder="My reactions, my choices, my effort..."
              value={circleControl}
              onChange={(e) => { setCircleControl(e.target.value); setEntry('anxiety', 'circleControl', e.target.value); }}
            />
          </div>
          <div className="carnival-card p-4 text-center" style={{ background: '#FFF0F0', borderColor: '#FFB8B8' }}>
            <p className="font-caveat text-lg font-bold mb-2">Not in my control 🌊</p>
            <textarea
              className="textarea-hand"
              rows={3}
              placeholder="Other people's actions, the past, the weather..."
              defaultValue={getEntry('anxiety', 'notControl')}
              onChange={(e) => setEntry('anxiety', 'notControl', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Butterfly Hug Timer */}
      <div className="carnival-card p-5 text-center" style={{ borderColor: '#B8D4FF' }}>
        <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>The Butterfly Hug 🦋</h3>
        <p className="font-patrick text-sm mb-4" style={{ color: '#6B5744' }}>
          Cross your arms over your chest, palms facing down. Tap alternately, left-right, for 30 seconds. Let your body relax.
        </p>
        <motion.div
          className="text-7xl my-4 inline-block"
          animate={butterflying ? { x: [0, -12, 12, -12, 0] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          🦋
        </motion.div>
        {timerRunning && (
          <div className="font-caveat text-4xl font-bold mt-2" style={{ color: '#4A7FBF' }}>
            {timeLeft}s
          </div>
        )}
        {!timerRunning && timeLeft === 0 && (
          <p className="font-caveat text-lg text-green-600 mt-2">Wonderful! How do you feel? 💙</p>
        )}
        <button
          className="btn-hand mt-4"
          style={{ background: timerRunning ? '#E8E8E8' : '#B8D4FF' }}
          onClick={startButterflyHug}
          disabled={timerRunning}
        >
          {timerRunning ? `Tapping... ${timeLeft}s` : '🤗 Start butterfly hug'}
        </button>
        {timeLeft === 0 && !timerRunning && (
          <button className="btn-hand ml-3 mt-4" onClick={() => setTimeLeft(30)}>Try again</button>
        )}
      </div>

      {/* Safe Space */}
      <div>
        <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>Your safe space 🏡</h3>
        <p className="font-patrick text-sm mb-3" style={{ color: '#6B5744' }}>What does safety look and feel like to you?</p>
        <textarea
          className="textarea-hand"
          rows={4}
          placeholder="Describe your safe space in detail — sights, sounds, smells, textures..."
          value={safeSpace}
          onChange={(e) => { setSafeSpace(e.target.value); setEntry('anxiety', 'safeSpace', e.target.value); }}
        />
      </div>
    </div>
  );
}
