'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournalStore } from '@/lib/store';

export default function GratitudeJar() {
  const { gratitudeNotes, addGratitudeNote, removeGratitudeNote } = useJournalStore();
  const [newNote, setNewNote] = useState('');
  const [showDrop, setShowDrop] = useState(false);
  const [pickedNote, setPickedNote] = useState<string | null>(null);
  const [gratitudeLetter, setGratitudeLetter] = useState('');

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addGratitudeNote(newNote.trim());
    setNewNote('');
    setShowDrop(true);
    setTimeout(() => setShowDrop(false), 1000);
  };

  const pickRandomNote = () => {
    if (gratitudeNotes.length === 0) return;
    const idx = Math.floor(Math.random() * gratitudeNotes.length);
    setPickedNote(gratitudeNotes[idx].text);
    setTimeout(() => setPickedNote(null), 5000);
  };

  const jarFill = Math.min(gratitudeNotes.length / 20, 1); // Fill up to 20 notes = full jar

  return (
    <div className="space-y-6">
      {/* Therapist note */}
      <div className="carnival-card p-4" style={{ background: '#FFF8F0', borderColor: '#FFD4B8' }}>
        <p className="font-caveat text-lg italic" style={{ color: '#6B5744' }}>
          "Everyday, think of 3 things you are grateful for. It can be coffee from your favourite place, a meal a loved one cooked, or any achievement. Write them on small chits of paper and fill up the jar!" 🪴
        </p>
      </div>

      {/* Jar visualization */}
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: 160, height: 200 }}>
          {/* Jar outline */}
          <svg viewBox="0 0 160 200" width="160" height="200">
            {/* Jar body */}
            <path d="M30 50 Q25 80 25 120 Q25 180 80 180 Q135 180 135 120 Q135 80 130 50 Z" fill="#FFFEF0" stroke="#2D2016" strokeWidth="3"/>
            {/* Lid */}
            <rect x="25" y="30" width="110" height="28" rx="8" fill="#D4B8FF" stroke="#2D2016" strokeWidth="2.5"/>
            {/* Fill level */}
            <clipPath id="jar-clip">
              <path d="M30 50 Q25 80 25 120 Q25 180 80 180 Q135 180 135 120 Q135 80 130 50 Z"/>
            </clipPath>
            <rect
              x="25"
              y={180 - (130 * jarFill)}
              width="110"
              height={130 * jarFill}
              fill="#FFD4B8"
              opacity="0.6"
              clipPath="url(#jar-clip)"
            />
            {/* Notes inside */}
            {gratitudeNotes.slice(-8).map((n, i) => (
              <rect
                key={n.id}
                x={35 + (i % 3) * 28}
                y={160 - Math.floor(i / 3) * 24}
                width={22}
                height={16}
                rx={3}
                fill={n.color}
                stroke="#2D2016"
                strokeWidth="1"
                transform={`rotate(${(i % 3 - 1) * 8} ${46 + (i % 3) * 28} ${168 - Math.floor(i / 3) * 24})`}
              />
            ))}
            {/* Jar shine */}
            <path d="M40 60 Q35 100 35 140" stroke="white" strokeWidth="6" fill="none" opacity="0.4" strokeLinecap="round"/>
          </svg>
          {/* Drop animation */}
          <AnimatePresence>
            {showDrop && (
              <motion.div
                className="absolute left-1/2 -top-10 text-2xl"
                style={{ x: '-50%' }}
                initial={{ y: -20, opacity: 1 }}
                animate={{ y: 80, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeIn' }}
              >
                📝
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="font-caveat text-lg mt-2" style={{ color: '#6B5744' }}>
          {gratitudeNotes.length} {gratitudeNotes.length === 1 ? 'note' : 'notes'} in your jar ✨
        </p>
      </div>

      {/* Add note */}
      <div className="carnival-card p-5" style={{ background: '#FFF8F0', borderColor: '#FFD4B8' }}>
        <h3 className="font-caveat text-xl font-bold mb-3" style={{ color: '#2D2016' }}>What are you grateful for today?</h3>
        <textarea
          className="textarea-hand"
          rows={3}
          placeholder="Today I'm grateful for..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAddNote())}
        />
        <button className="btn-hand mt-3" style={{ background: '#FFD4B8' }} onClick={handleAddNote}>
          📝 Drop it in the jar
        </button>
      </div>

      {/* Pick a random note */}
      {gratitudeNotes.length > 0 && (
        <div className="text-center">
          <button className="btn-hand" style={{ background: '#FFF5B8' }} onClick={pickRandomNote}>
            🎲 Pick a random gratitude note
          </button>
          <AnimatePresence>
            {pickedNote && (
              <motion.div
                className="carnival-card mt-4 p-5 text-center"
                style={{ background: '#FFF5B8', borderColor: '#FFD700' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <p className="text-3xl mb-2">✨</p>
                <p className="font-caveat text-2xl" style={{ color: '#2D2016' }}>{pickedNote}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Notes list */}
      {gratitudeNotes.length > 0 && (
        <div>
          <h3 className="font-caveat text-xl font-bold mb-3" style={{ color: '#2D2016' }}>Your gratitude collection 📚</h3>
          <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto">
            {[...gratitudeNotes].reverse().map((note) => (
              <motion.div
                key={note.id}
                className="carnival-card p-3 relative"
                style={{ background: note.color, borderColor: '#2D2016' }}
                layout
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <p className="font-caveat text-base pr-6" style={{ color: '#2D2016' }}>{note.text}</p>
                <p className="font-patrick text-xs mt-1 opacity-60" style={{ color: '#2D2016' }}>
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
                <button
                  className="absolute top-2 right-2 text-xs opacity-50 hover:opacity-100"
                  onClick={() => removeGratitudeNote(note.id)}
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Gratitude letter */}
      <div>
        <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>Write a gratitude letter 💌</h3>
        <p className="font-patrick text-sm mb-3" style={{ color: '#6B5744' }}>Write a heartfelt letter to someone special in your life.</p>
        <textarea
          className="textarea-hand"
          rows={8}
          placeholder="Dear ___,&#10;&#10;Thank you for being my..."
          value={gratitudeLetter}
          onChange={(e) => setGratitudeLetter(e.target.value)}
        />
      </div>
    </div>
  );
}
