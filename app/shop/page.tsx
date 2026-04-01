'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function ShopPage() {
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', address: '', phone: '' });
  const [step, setStep] = useState<'details' | 'confirm' | 'success'>('details');

  const PRICE = 499;
  const ORIGINAL = 699;

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirm');
  };

  const handleConfirm = () => {
    setStep('success');
  };

  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(160deg, #FFF8F0 0%, #F5FFF0 100%)' }}>
      {/* Nav */}
      <nav className="carnival-card m-4 px-6 py-3 flex items-center justify-between" style={{ background: 'white' }}>
        <Link href="/" className="font-caveat text-xl font-bold" style={{ color: '#2D2016' }}>
          🐼 GLITRD
        </Link>
        <Link href="/carnival" className="btn-hand text-sm">
          🎪 Enter Carnival
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Hero */}
        <div className="text-center py-12">
          <motion.div className="text-6xl mb-4" animate={{ y: [0, -10, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
            📖
          </motion.div>
          <h1 className="font-caveat text-5xl font-bold mb-2" style={{ color: '#2D2016' }}>Order the Hardcopy</h1>
          <p className="font-patrick text-lg" style={{ color: '#6B5744' }}>Get Lost in the Right Direction — the physical journal</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Book info */}
          <div className="space-y-5">
            {/* Book visual */}
            <div className="carnival-card p-6 text-center" style={{ background: '#FFF8F0' }}>
              <div
                className="inline-block rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, #FFD4B8 0%, #D4B8FF 50%, #B8FFD4 100%)',
                  width: 200, height: 270,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  border: '4px solid #2D2016',
                  boxShadow: '6px 6px 0 #2D2016',
                  padding: 16,
                }}
              >
                <div className="text-5xl mb-3">🐼</div>
                <p className="font-caveat text-lg font-bold text-center" style={{ color: '#2D2016' }}>Get Lost in the Right Direction</p>
                <div className="mt-2 w-full h-0.5" style={{ background: '#2D2016' }} />
                <p className="font-patrick text-xs mt-2 text-center" style={{ color: '#6B5744' }}>Ushma Asher & Riddhi Panchal</p>
                <p className="font-patrick text-xs mt-1 text-center" style={{ color: '#999' }}>Illus. Himani Ruparelia</p>
              </div>
            </div>

            {/* Features */}
            <div className="carnival-card p-5" style={{ background: '#FFF8F0' }}>
              <h3 className="font-caveat text-xl font-bold mb-3" style={{ color: '#2D2016' }}>What you get 🎁</h3>
              <div className="space-y-2">
                {[
                  ['📄', '88 pages of non-linear journaling'],
                  ['✍️', 'Therapist-written stories & reflections'],
                  ['🎨', 'Black & white for you to color'],
                  ['🧠', '14 sections for every emotional need'],
                  ['📚', 'Hardcover, beautifully illustrated'],
                  ['💌', 'Includes a personal note from the authors'],
                ].map(([icon, feat]) => (
                  <p key={feat} className="font-patrick text-sm" style={{ color: '#444' }}>
                    {icon} {feat}
                  </p>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="carnival-card p-5 text-center" style={{ background: '#FFF5B8', borderColor: '#FFD700' }}>
              <p className="font-caveat text-5xl font-bold" style={{ color: '#2D2016' }}>₹{PRICE}</p>
              <p className="font-patrick text-base line-through mt-1" style={{ color: '#999' }}>₹{ORIGINAL}</p>
              <p className="font-caveat text-xl mt-1" style={{ color: '#2D2016' }}>You save ₹{ORIGINAL - PRICE} (29% off) 🎉</p>
              <p className="font-patrick text-sm mt-2" style={{ color: '#6B5744' }}>Free delivery across India • Arrives in 5–7 days</p>
            </div>

            {/* Testimonials */}
            <div className="space-y-3">
              {[
                { text: '"This journal has been my companion through some of my toughest days. The exercises actually work."', name: 'Priya, 26' },
                { text: '"I love that it\'s not linear. I go to exactly what I need each day. The anxiety section alone was worth it."', name: 'Aryan, 24' },
                { text: '"The illustrations are beautiful and I love coloring while I reflect."', name: 'Sneha, 28' },
              ].map((t, i) => (
                <div key={i} className="carnival-card p-4" style={{ background: '#FFFDF5' }}>
                  <p className="font-caveat text-base italic" style={{ color: '#2D2016' }}>{t.text}</p>
                  <p className="font-patrick text-xs mt-2" style={{ color: '#888' }}>— {t.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order form */}
          <div className="carnival-card p-6" style={{ background: 'white' }}>
            <AnimatePresence mode="wait">
              {step === 'details' && (
                <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="font-caveat text-2xl font-bold mb-5" style={{ color: '#2D2016' }}>Delivery Details 📦</h2>
                  <form onSubmit={handleOrder} className="space-y-4">
                    <div>
                      <label className="font-caveat text-base block mb-1" style={{ color: '#2D2016' }}>Full name *</label>
                      <input className="input-hand" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                    </div>
                    <div>
                      <label className="font-caveat text-base block mb-1" style={{ color: '#2D2016' }}>Email *</label>
                      <input className="input-hand" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className="font-caveat text-base block mb-1" style={{ color: '#2D2016' }}>Phone *</label>
                      <input className="input-hand" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
                    </div>
                    <div>
                      <label className="font-caveat text-base block mb-1" style={{ color: '#2D2016' }}>Delivery address *</label>
                      <textarea className="textarea-hand" required rows={4} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Flat/House No, Street, City, State, PIN code" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <label className="font-caveat text-base" style={{ color: '#2D2016' }}>Qty:</label>
                        <button type="button" className="btn-hand px-3 py-1" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                        <span className="font-caveat text-xl font-bold" style={{ color: '#2D2016' }}>{quantity}</span>
                        <button type="button" className="btn-hand px-3 py-1" onClick={() => setQuantity(quantity + 1)}>+</button>
                      </div>
                      <span className="font-caveat text-2xl font-bold" style={{ color: '#2D2016' }}>₹{PRICE * quantity}</span>
                    </div>
                    <motion.button
                      type="submit"
                      className="btn-hand w-full py-4 text-xl"
                      style={{ background: '#FFD4B8' }}
                      whileHover={{ scale: 1.02 }}
                    >
                      📦 Review order
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {step === 'confirm' && (
                <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="font-caveat text-2xl font-bold mb-5" style={{ color: '#2D2016' }}>Confirm your order 📋</h2>
                  <div className="space-y-3 mb-6">
                    {[
                      ['📖', 'Item', `Get Lost in the Right Direction × ${quantity}`],
                      ['👤', 'Name', form.name],
                      ['📧', 'Email', form.email],
                      ['📍', 'Address', form.address],
                      ['💰', 'Total', `₹${PRICE * quantity}`],
                    ].map(([icon, label, val]) => (
                      <div key={label} className="carnival-card p-3" style={{ background: '#FFF8F0' }}>
                        <span className="font-caveat text-sm font-bold" style={{ color: '#888' }}>{icon} {label}</span>
                        <p className="font-patrick text-sm mt-1" style={{ color: '#2D2016' }}>{val}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button className="btn-hand flex-1" onClick={() => setStep('details')}>← Edit</button>
                    <motion.button className="btn-hand flex-1 py-4" style={{ background: '#B8FFD4' }} onClick={handleConfirm} whileHover={{ scale: 1.02 }}>
                      ✅ Place order
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  className="text-center py-8"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <div className="text-7xl mb-4">🎉</div>
                  <h2 className="font-caveat text-3xl font-bold mb-3" style={{ color: '#2D2016' }}>Order placed! 🐼</h2>
                  <p className="font-patrick text-base mb-2" style={{ color: '#6B5744' }}>
                    Thank you, {form.name}! Your journal is on its way to you.
                  </p>
                  <p className="font-patrick text-sm mb-6" style={{ color: '#888' }}>
                    Confirmation sent to {form.email} • Expected delivery: 5–7 business days
                  </p>
                  <div className="carnival-card p-4 mb-6" style={{ background: '#F5FFF0', borderColor: '#B8FFD4' }}>
                    <p className="font-caveat text-lg" style={{ color: '#2D2016' }}>
                      While you wait, explore the interactive version of the journal in our carnival! 🎪
                    </p>
                  </div>
                  <Link href="/carnival" className="btn-hand inline-block" style={{ background: '#FFD4B8', fontSize: '1.1rem' }}>
                    🐼 Explore the Carnival →
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Authors section */}
        <div className="carnival-card mt-10 p-8 text-center" style={{ background: '#F0F5FF' }}>
          <h2 className="font-caveat text-3xl font-bold mb-6" style={{ color: '#2D2016' }}>The authors 🌟</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: 'Ushma Asher', emoji: '🌸', bio: 'Psychologist & therapist with a passion for making mental health personal, sustainable, and accessible. Known for her warm stories and practical exercises.', color: '#FFB8D4' },
              { name: 'Riddhi Panchal', emoji: '🌿', bio: 'Therapist & mental health advocate who believes in the transformative power of journaling and goal-setting. Her stories about acceptance and letting go resonate deeply.', color: '#B8FFD4' },
            ].map((a) => (
              <div key={a.name} className="carnival-card p-6" style={{ background: a.color }}>
                <div className="text-5xl mb-3">{a.emoji}</div>
                <h3 className="font-caveat text-2xl font-bold mb-2" style={{ color: '#2D2016' }}>{a.name}</h3>
                <p className="font-patrick text-sm" style={{ color: '#444' }}>{a.bio}</p>
              </div>
            ))}
          </div>
          <p className="font-patrick text-sm mt-4" style={{ color: '#888' }}>
            Book cover & illustrations by Himani Ruparelia (phantasmagothica)
          </p>
        </div>
      </div>
    </main>
  );
}
