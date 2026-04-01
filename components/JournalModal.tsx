'use client';

import { lazy, Suspense } from 'react';
import Modal from './ui/Modal';
import { useJournalStore } from '@/lib/store';
import { SECTIONS } from '@/lib/sections';

// Lazy-load all section components for code splitting
const SelfCare = lazy(() => import('./sections/SelfCare'));
const TeaCafe = lazy(() => import('./sections/TeaCafe'));
const ArtCorner = lazy(() => import('./sections/ArtCorner'));
const SocialMediaBreak = lazy(() => import('./sections/SocialMediaBreak'));
const Burnout = lazy(() => import('./sections/Burnout'));
const Grounding = lazy(() => import('./sections/Grounding'));
const Acceptance = lazy(() => import('./sections/Acceptance'));
const HotAirBalloon = lazy(() => import('./sections/HotAirBalloon'));
const TokenArcade = lazy(() => import('./sections/TokenArcade'));
const FlowCarousel = lazy(() => import('./sections/FlowCarousel'));
const BalloonRelease = lazy(() => import('./sections/BalloonRelease'));
const GratitudeJar = lazy(() => import('./sections/GratitudeJar'));
const FriendshipGarden = lazy(() => import('./sections/FriendshipGarden'));
const LoveLIfe = lazy(() => import('./sections/LoveLIfe'));
const ShopSection = lazy(() => import('./sections/ShopSection'));

const SECTION_MAP: Record<string, React.ComponentType> = {
  selfcare: SelfCare,
  anxiety: TeaCafe,
  creativity: ArtCorner,
  socialmedia: SocialMediaBreak,
  burnout: Burnout,
  grounding: Grounding,
  acceptance: Acceptance,
  goals: HotAirBalloon,
  habits: TokenArcade,
  flow: FlowCarousel,
  forgiveness: BalloonRelease,
  gratitude: GratitudeJar,
  friendships: FriendshipGarden,
  lovelife: LoveLIfe,
  shop: ShopSection,
};

const WIDE_SECTIONS = new Set(['creativity', 'goals', 'shop']);

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-5xl bounce-gentle">🐼</div>
      <p className="font-caveat text-xl mt-4" style={{ color: '#6B5744' }}>Loading...</p>
    </div>
  );
}

export default function JournalModal() {
  const { activeSection, setActiveSection, markVisited } = useJournalStore();

  if (!activeSection) return null;

  const section = SECTIONS.find((s) => s.id === activeSection);
  if (!section) return null;

  const SectionComponent = SECTION_MAP[activeSection];
  if (!SectionComponent) return null;

  const handleClose = () => {
    markVisited(activeSection);
    setActiveSection(null);
  };

  return (
    <Modal
      open={!!activeSection}
      onClose={handleClose}
      title={section.carnivalName}
      emoji={section.emoji}
      theme={section.theme}
      wide={WIDE_SECTIONS.has(activeSection)}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <SectionComponent />
      </Suspense>
    </Modal>
  );
}
