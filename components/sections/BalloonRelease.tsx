'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournalStore } from '@/lib/store';

export default function BalloonRelease() {
  const { getEntry, setEntry } = useJournalStore();
  const [letter, setLetter] = useState(getEntry('forgiveness', 'unsent') || '');
  const [letterToPast, setLetterToPast] = useState(getEntry('forgiveness', 'pastSelf') || '');
  const [releasing, setReleasing] = useState(false);
  const [released, setReleased] = useState(false);
  const [activeTab, setActiveTab] = useState<'unsent' | 'past' | 'learn'>('unsent');

  const handleRelease = () => {
    if (!letter.trim()) return;
    setEntry('forgiveness', 'unsent', letter);
    setReleasing(true);
    setTimeout(() => {
      setReleased(true);
      setReleasing(false);
    }, 3000);
  };

  const handleReset = () => {
    setReleased(false);
    setLetter('');
    setEntry('forgiveness', 'unsent', '');
  };

  return (
    <div className="space-y-6">
      {/* Therapist note */}
      <div className="carnival-card p-4" style={{ background: '#F5FFF0', borderColor: '#D4FFB8' }}>
        <p className="font-caveat text-lg italic" style={{ color: '#6B5744' }}>
          "Clinging to negativity hurts you more than anyone else. Forgiveness is not about forgetting or condoning past hurts — it's about releasing the emotional burden that holds you back." 🕊️
        </p>
        <p className="font-caveat text-base mt-2 text-right" style={{ color: '#888' }}>— Riddhi</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['unsent', 'past', 'learn'] as const).map((tab) => (
          <button
            key={tab}
            className="btn-hand"
            style={{ background: activeTab === tab ? '#D4FFB8' : '#FFF' }}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'unsent' ? '💌 Unsent letter' : tab === 'past' ? '🪞 Letter to past self' : '💡 Learn'}
          </button>
        ))}
      </div>

      {activeTab === 'unsent' && (
        <div>
          <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>A letter to the one who hurt you 💌</h3>
          <p className="font-patrick text-sm mb-4" style={{ color: '#6B5744' }}>
            Write your unfiltered thoughts. Acknowledge your pain. Release emotional burdens. Begin healing. <strong>This letter is for your eyes only.</strong>
          </p>

          <AnimatePresence mode="wait">
            {!released ? (
              <motion.div key="writing" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <textarea
                  className="textarea-hand"
                  rows={10}
                  placeholder="Dear ___,&#10;&#10;I've been holding onto something for a while..."
                  value={letter}
                  onChange={(e) => setLetter(e.target.value)}
                  disabled={releasing}
                />

                <AnimatePresence>
                  {releasing && (
                    <motion.div
                      className="flex justify-center my-4"
                      initial={{ opacity: 1 }}
                    >
                      <motion.div
                        className="text-7xl"
                        animate={{ y: -300, opacity: 0, rotate: [0, 5, -5, 10] }}
                        transition={{ duration: 2.8, ease: 'easeOut' }}
                      >
                        🎈
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3 mt-3">
                  <button
                    className="btn-hand"
                    style={{ background: releasing ? '#E8E8E8' : '#D4FFB8' }}
                    onClick={handleRelease}
                    disabled={releasing || !letter.trim()}
                  >
                    {releasing ? '🎈 Floating away...' : '🕊️ Let it go'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="released"
                className="carnival-card p-6 text-center"
                style={{ background: '#F5FFF0', borderColor: '#D4FFB8' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                <div className="text-6xl mb-4">🕊️</div>
                <h3 className="font-caveat text-2xl font-bold mb-2" style={{ color: '#2D2016' }}>You let it go 💚</h3>
                <p className="font-patrick text-base" style={{ color: '#6B5744' }}>
                  "It's okay to look at your past — just don't stare for too long."
                </p>
                <button className="btn-hand mt-4" onClick={handleReset}>Write another letter</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {activeTab === 'past' && (
        <div>
          <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>A letter to your past self 🪞</h3>
          <p className="font-patrick text-sm mb-3" style={{ color: '#6B5744' }}>
            Pen down any resentment you hold towards that version of yourself. Release it. Be as nurturing and kind towards yourself as possible.
          </p>
          <textarea
            className="textarea-hand"
            rows={10}
            placeholder="Dear past me,&#10;&#10;I want you to know that..."
            value={letterToPast}
            onChange={(e) => { setLetterToPast(e.target.value); setEntry('forgiveness', 'pastSelf', e.target.value); }}
          />
          <button
            className="btn-hand mt-3"
            style={{ background: '#D4FFB8' }}
            onClick={() => setEntry('forgiveness', 'pastSelf', letterToPast)}
          >
            💾 Save letter
          </button>
        </div>
      )}

      {activeTab === 'learn' && (
        <div className="space-y-4">
          <div className="carnival-card p-5" style={{ background: '#F5FFF0', borderColor: '#D4FFB8' }}>
            <h3 className="font-caveat text-xl font-bold mb-3" style={{ color: '#2D2016' }}>What is something you've been struggling to accept?</h3>
            <textarea
              className="textarea-hand"
              rows={4}
              placeholder="Something I've been resisting is..."
              defaultValue={getEntry('forgiveness', 'struggling')}
              onChange={(e) => setEntry('forgiveness', 'struggling', e.target.value)}
            />
          </div>
          <div className="carnival-card p-5" style={{ background: '#F5FFF0', borderColor: '#D4FFB8' }}>
            <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>What are you doing to avoid it?</h3>
            <textarea
              className="textarea-hand"
              rows={3}
              placeholder="I've been..."
              defaultValue={getEntry('forgiveness', 'avoiding')}
              onChange={(e) => setEntry('forgiveness', 'avoiding', e.target.value)}
            />
          </div>
          <div className="carnival-card p-5" style={{ background: '#FFFDF5' }}>
            <p className="font-caveat text-lg font-bold mb-2">
              "Holding onto anger is like drinking poison and expecting to kill the other person."
            </p>
            <p className="font-patrick text-sm" style={{ color: '#6B5744' }}>
              What would happen if you just let the situation or feeling be? What peace might you find on the other side of acceptance?
            </p>
            <textarea
              className="textarea-hand mt-3"
              rows={4}
              placeholder="If I let go, I think..."
              defaultValue={getEntry('forgiveness', 'whatIf')}
              onChange={(e) => setEntry('forgiveness', 'whatIf', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
