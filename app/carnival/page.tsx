'use client';

import dynamic from 'next/dynamic';
import JournalModal from '@/components/JournalModal';
import CarnivalHUD from '@/components/CarnivalHUD';

// Load Phaser game only on client side (no SSR)
const PhaserGame = dynamic(() => import('@/components/PhaserGame'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#E8F5E0' }}>
      <div className="text-center">
        <div className="text-8xl bounce-gentle">🐼</div>
        <p className="font-caveat text-2xl mt-4" style={{ color: '#2D2016' }}>Loading the carnival...</p>
        <p className="font-patrick text-base mt-2" style={{ color: '#6B5744' }}>Setting up the stalls just for you ✨</p>
      </div>
    </div>
  ),
});

export default function CarnivalPage() {
  return (
    <main style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      {/* Phaser carnival world (z-index: 0) */}
      <PhaserGame />

      {/* HUD overlay (z-index: 10+) */}
      <div id="carnival-hud">
        <CarnivalHUD />
      </div>

      {/* Section modals (z-index: 100) */}
      <JournalModal />
    </main>
  );
}
