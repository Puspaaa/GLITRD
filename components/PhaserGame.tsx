'use client';

import { useEffect, useRef } from 'react';
import type { Game as PhaserGameType } from 'phaser';
import { useJournalStore } from '@/lib/store';

export default function PhaserGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<PhaserGameType | null>(null);
  const setActiveSection = useJournalStore((s) => s.setActiveSection);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    let game: PhaserGameType;

    const initGame = async () => {
      const Phaser = (await import('phaser')).default;
      const { BootScene } = await import('@/game/scenes/BootScene');
      const { CarnivalScene } = await import('@/game/scenes/CarnivalScene');

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerRef.current!,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: '#E8F5E0',
        physics: {
          default: 'arcade',
          arcade: { gravity: { x: 0, y: 0 }, debug: false },
        },
        scene: [BootScene, CarnivalScene],
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        audio: { disableWebAudio: true },
      });

      gameRef.current = game;

      // Wait for carnival scene to be active, then wire up callback
      game.events.on('ready', () => {
        const checkScene = setInterval(() => {
          const scene = game.scene.getScene('CarnivalScene') as import('@/game/scenes/CarnivalScene').CarnivalScene;
          if (scene && scene.onSectionEnter !== undefined) {
            scene.onSectionEnter = (id: string) => {
              setActiveSection(id);
            };
            clearInterval(checkScene);
          }
        }, 100);
      });
    };

    initGame();

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [setActiveSection]);

  return (
    <div
      id="phaser-carnival"
      ref={containerRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    />
  );
}
