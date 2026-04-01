'use client';

import { useJournalStore } from '@/lib/store';

export default function SelfCare() {
  const { getEntry, setEntry } = useJournalStore();
  return (
    <div className="space-y-6">
      <div className="carnival-card p-4" style={{ background: '#FFF0F6', borderColor: '#FFB8D4' }}>
        <p className="font-caveat text-lg italic" style={{ color: '#6B5744' }}>
          "Self-care is supposed to be personal, sustainable, & consistent. It's not bubble baths or spa days — it's choosing yourself, every day." 🌸 — Ushma
        </p>
      </div>

      <div>
        <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>Design your dream self-care day 🌅</h3>
        <p className="font-patrick text-sm mb-3" style={{ color: '#6B5744' }}>Imagine a day dedicated entirely to your well-being. What would it include?</p>
        <textarea className="textarea-hand" rows={6} placeholder="Morning: I'd start with...&#10;Afternoon: ...&#10;Evening: ..." defaultValue={getEntry('selfcare', 'dreamDay')} onChange={(e) => setEntry('selfcare', 'dreamDay', e.target.value)} />
      </div>

      <div>
        <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>Let's declutter that mind! 🧹</h3>
        <p className="font-patrick text-sm mb-3" style={{ color: '#6B5744' }}>Write down everything on your mind. Then cross out what you can let go of for now.</p>
        <textarea className="textarea-hand" rows={6} placeholder="Everything on my mind right now:&#10;- ...&#10;- ...&#10;(Cross out what you can release)" defaultValue={getEntry('selfcare', 'declutter')} onChange={(e) => setEntry('selfcare', 'declutter', e.target.value)} />
      </div>

      <div>
        <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>Create your comfort playlist 🎵</h3>
        <p className="font-patrick text-sm mb-3" style={{ color: '#6B5744' }}>What songs make you feel held and at home?</p>
        <textarea className="textarea-hand" rows={5} placeholder="1. Song name - Artist&#10;2. ...&#10;3. ..." defaultValue={getEntry('selfcare', 'playlist')} onChange={(e) => setEntry('selfcare', 'playlist', e.target.value)} />
      </div>

      <div className="carnival-card p-5" style={{ background: '#FFF0F6', borderColor: '#FFB8D4' }}>
        <h3 className="font-caveat text-xl font-bold mb-3" style={{ color: '#2D2016' }}>Ushma's top self-care practices 💕</h3>
        {['Being mindful of who I surround myself with — honour yourself.', 'Regular therapy: it relieves stress, energises you, and puts things in perspective.', 'Alone time: paint, dance, play guitar, shop, reflect. Reconnect with yourself.', 'Unplug: put your phone aside and allow your brain to be bored.'].map((tip, i) => (
          <p key={i} className="font-patrick text-sm py-2 border-b border-dashed last:border-0" style={{ color: '#444', borderColor: '#FFB8D4' }}>💗 {tip}</p>
        ))}
      </div>
    </div>
  );
}
