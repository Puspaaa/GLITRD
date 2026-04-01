'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournalStore } from '@/lib/store';

const HABIT_TIPS = [
  { icon: '🎯', title: 'Define your identity', tip: 'Don\'t say "I want to run a marathon." Say "I am a runner."' },
  { icon: '🧹', title: 'Reduce friction', tip: 'Remove obstacles. If you want to read more, keep a book on your pillow.' },
  { icon: '🌅', title: 'Same time, same place', tip: 'Habits are triggered by cues. Make your habit automatic by tying it to a context.' },
  { icon: '🎵', title: 'Make it enjoyable', tip: 'Listen to your favorite podcast only while exercising. Associate the habit with joy.' },
];

export default function TokenArcade() {
  const { habits, setHabit, checkInHabit } = useJournalStore();
  const [newHabitName, setNewHabitName] = useState('');
  const [justEarned, setJustEarned] = useState<string | null>(null);
  const [celebrating, setCelebrating] = useState(false);

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return;
    setHabit(newHabitName.trim());
    setNewHabitName('');
  };

  const handleCheckIn = (name: string) => {
    const habit = habits.find((h) => h.habitName === name);
    const today = new Date().toDateString();
    const alreadyToday = habit?.checkIns.some((t) => new Date(t).toDateString() === today);
    if (alreadyToday) return;

    checkInHabit(name);
    setJustEarned(name);
    setTimeout(() => setJustEarned(null), 2000);

    // Check if milestone reached (every 4 tokens)
    const newCount = (habit?.checkIns.length || 0) + 1;
    if (newCount % 4 === 0) {
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Therapist note */}
      <div className="carnival-card p-4" style={{ background: '#F0FFFF', borderColor: '#B8FFFF' }}>
        <p className="font-caveat text-lg italic" style={{ color: '#6B5744' }}>
          "Give yourself a tiny token each time you do the activity. After 4 tokens in a week, take yourself out to do something you love." 🎮
        </p>
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ type: 'spring', damping: 10 }}
            >
              <div className="text-8xl">🏆</div>
              <p className="font-caveat text-3xl font-bold mt-3" style={{ color: '#FFD700', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                4 tokens earned!<br />Treat yourself! 🎉
              </p>
            </motion.div>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], y: -100, x: Math.random() * 100 - 50 }}
                transition={{ duration: 2, delay: Math.random() * 0.5 }}
              >
                {['⭐', '🎊', '💫', '🎈', '✨'][i % 5]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add new habit */}
      <div className="carnival-card p-5" style={{ background: '#F0FFFF', borderColor: '#B8FFFF' }}>
        <h3 className="font-caveat text-xl font-bold mb-3" style={{ color: '#2D2016' }}>🎯 Add a habit to track</h3>
        <div className="flex gap-3">
          <input
            className="input-hand flex-1"
            placeholder="e.g. Go for a walk, Drink water, Meditate..."
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
          />
          <button className="btn-hand" style={{ background: '#B8FFFF' }} onClick={handleAddHabit}>
            + Add
          </button>
        </div>
      </div>

      {/* Habits list */}
      {habits.length === 0 && (
        <div className="text-center py-8">
          <div className="text-5xl mb-3">🎮</div>
          <p className="font-caveat text-xl" style={{ color: '#6B5744' }}>Add your first habit to start collecting tokens!</p>
        </div>
      )}

      <div className="space-y-4">
        {habits.map((habit) => {
          const today = new Date().toDateString();
          const checkedToday = habit.checkIns.some((t) => new Date(t).toDateString() === today);
          const weeklyCount = habit.checkIns.filter((t) => {
            const d = new Date(t);
            const now = new Date();
            const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
            return diff < 7;
          }).length;
          const tokensToNext = 4 - (habit.checkIns.length % 4);

          return (
            <motion.div
              key={habit.habitName}
              className="carnival-card p-5"
              style={{ background: '#FFFDF5', borderColor: checkedToday ? '#6BFFA8' : '#2D2016' }}
              layout
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-caveat text-xl font-bold" style={{ color: '#2D2016' }}>
                    {checkedToday ? '✅' : '⬜'} {habit.habitName}
                  </h4>
                  <div className="flex gap-4 mt-2 text-sm font-patrick" style={{ color: '#6B5744' }}>
                    <span>🔥 {habit.checkIns.length} total check-ins</span>
                    <span>📅 {weeklyCount} this week</span>
                    <span>🪙 {habit.tokens} reward tokens</span>
                  </div>
                  {/* Token progress dots */}
                  <div className="flex gap-2 mt-3">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                        style={{
                          borderColor: '#2D2016',
                          background: i < (4 - tokensToNext) ? '#FFD700' : '#FFF',
                        }}
                        animate={i < (4 - tokensToNext) ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                      >
                        {i < (4 - tokensToNext) && <span style={{ fontSize: 14 }}>🪙</span>}
                      </motion.div>
                    ))}
                    <span className="font-caveat text-sm self-center" style={{ color: '#6B5744' }}>
                      {tokensToNext === 4 ? '4 more' : `${tokensToNext} to reward!`}
                    </span>
                  </div>
                </div>

                <AnimatePresence>
                  {justEarned === habit.habitName && (
                    <motion.div
                      className="absolute text-3xl"
                      initial={{ y: 0, opacity: 1 }}
                      animate={{ y: -50, opacity: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      🪙
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  className="btn-hand"
                  style={{
                    background: checkedToday ? '#E8E8E8' : '#FFD700',
                    opacity: checkedToday ? 0.6 : 1,
                    minWidth: 100,
                  }}
                  onClick={() => handleCheckIn(habit.habitName)}
                  disabled={checkedToday}
                >
                  {checkedToday ? '✅ Done!' : '🪙 Check in'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Habit tips */}
      <div>
        <h3 className="font-caveat text-xl font-bold mb-3" style={{ color: '#2D2016' }}>💡 Tips that actually work</h3>
        <div className="grid grid-cols-2 gap-3">
          {HABIT_TIPS.map((tip) => (
            <div key={tip.title} className="carnival-card p-4" style={{ background: '#F0FFFF', borderColor: '#B8FFFF' }}>
              <p className="font-caveat text-lg font-bold">{tip.icon} {tip.title}</p>
              <p className="font-patrick text-sm mt-1" style={{ color: '#6B5744' }}>{tip.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
