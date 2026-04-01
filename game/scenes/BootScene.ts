import Phaser from 'phaser';
import { SECTIONS, WORLD_WIDTH, WORLD_HEIGHT } from '@/lib/sections';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Generate all textures programmatically (no external assets needed)
  }

  create() {
    this.generateTextures();
    this.scene.start('CarnivalScene');
  }

  private generateTextures() {
    // ---- GRASS TILE ----
    const grassGfx = this.make.graphics();
    grassGfx.fillStyle(0xE8F5E0);
    grassGfx.fillRect(0, 0, 64, 64);
    // subtle texture lines
    grassGfx.lineStyle(1, 0xC8E8B0, 0.4);
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(4, 60);
      const y = Phaser.Math.Between(4, 60);
      grassGfx.strokeLineShape(new Phaser.Geom.Line(x, y, x + Phaser.Math.Between(-5, 5), y - 8));
    }
    grassGfx.generateTexture('grass', 64, 64);
    grassGfx.destroy();

    // ---- PATH TILE ----
    const pathGfx = this.make.graphics();
    pathGfx.fillStyle(0xF5E6C8);
    pathGfx.fillRect(0, 0, 64, 64);
    pathGfx.lineStyle(1, 0xE0C890, 0.3);
    for (let i = 0; i < 3; i++) {
      pathGfx.strokeRect(
        Phaser.Math.Between(2, 10),
        Phaser.Math.Between(2, 10),
        Phaser.Math.Between(20, 40),
        Phaser.Math.Between(20, 40)
      );
    }
    pathGfx.generateTexture('path', 64, 64);
    pathGfx.destroy();

    // ---- PANDA ----
    const pandaGfx = this.make.graphics();
    const pw = 48, ph = 56;
    // Shadow
    pandaGfx.fillStyle(0x000000, 0.12);
    pandaGfx.fillEllipse(pw / 2, ph - 4, 36, 12);
    // Body (white)
    pandaGfx.fillStyle(0xFFFFFF);
    pandaGfx.fillEllipse(pw / 2, ph - 16, 34, 28);
    // Head
    pandaGfx.fillStyle(0xFFFFFF);
    pandaGfx.fillCircle(pw / 2, 18, 16);
    // Ears (black)
    pandaGfx.fillStyle(0x1A1A1A);
    pandaGfx.fillCircle(12, 6, 7);
    pandaGfx.fillCircle(36, 6, 7);
    // Inner ears (white)
    pandaGfx.fillStyle(0xFFFFFF);
    pandaGfx.fillCircle(12, 7, 4);
    pandaGfx.fillCircle(36, 7, 4);
    // Eye patches (black)
    pandaGfx.fillStyle(0x1A1A1A);
    pandaGfx.fillEllipse(18, 17, 10, 9);
    pandaGfx.fillEllipse(30, 17, 10, 9);
    // Eyes (white)
    pandaGfx.fillStyle(0xFFFFFF);
    pandaGfx.fillCircle(18, 16, 3);
    pandaGfx.fillCircle(30, 16, 3);
    // Pupils
    pandaGfx.fillStyle(0x000000);
    pandaGfx.fillCircle(19, 16, 1.5);
    pandaGfx.fillCircle(31, 16, 1.5);
    // Nose
    pandaGfx.fillStyle(0x1A1A1A);
    pandaGfx.fillEllipse(pw / 2, 23, 6, 4);
    // Mouth
    pandaGfx.lineStyle(1.5, 0x1A1A1A, 1);
    // mouth lines (simple approach - no strokeArc in this Phaser version)
    pandaGfx.strokeLineShape(new Phaser.Geom.Line(pw / 2 - 6, 25, pw / 2, 28));
    pandaGfx.strokeLineShape(new Phaser.Geom.Line(pw / 2, 28, pw / 2 + 6, 25));
    // Journal under arm
    pandaGfx.fillStyle(0xFFD4B8);
    pandaGfx.fillRoundedRect(pw / 2 + 10, ph - 24, 14, 18, 3);
    pandaGfx.lineStyle(1.5, 0x8B6914, 1);
    pandaGfx.strokeRoundedRect(pw / 2 + 10, ph - 24, 14, 18, 3);
    pandaGfx.lineStyle(1, 0x8B6914, 0.5);
    pandaGfx.strokeLineShape(new Phaser.Geom.Line(pw / 2 + 11, ph - 20, pw / 2 + 23, ph - 20));
    pandaGfx.strokeLineShape(new Phaser.Geom.Line(pw / 2 + 11, ph - 16, pw / 2 + 23, ph - 16));
    pandaGfx.generateTexture('panda', pw, ph);
    pandaGfx.destroy();

    // ---- ENTRANCE ARCH ----
    const archGfx = this.make.graphics();
    archGfx.lineStyle(6, 0x8B4513, 1);
    archGfx.strokeRect(0, 20, 200, 100);
    archGfx.strokeCircle(100, 20, 100);
    archGfx.fillStyle(0xFF6B6B);
    for (let i = 0; i < 12; i++) {
      archGfx.fillCircle(i * 18 + 9, 10, 6);
    }
    archGfx.fillStyle(0xFFD700);
    archGfx.fillRect(10, 25, 180, 4);
    archGfx.generateTexture('entrance', 200, 130);
    archGfx.destroy();

    // ---- Generate stall textures for each section ----
    SECTIONS.forEach((section) => {
      this.generateStallTexture(section.id, section.color, section.emoji);
    });

    // ---- SIGN (interaction prompt) ----
    const signGfx = this.make.graphics();
    signGfx.fillStyle(0xFFFFFF);
    signGfx.fillRoundedRect(0, 0, 160, 36, 8);
    signGfx.lineStyle(2, 0x2D2016, 1);
    signGfx.strokeRoundedRect(0, 0, 160, 36, 8);
    signGfx.generateTexture('sign-bg', 160, 36);
    signGfx.destroy();

    // ---- Fairy lights ----
    const lightGfx = this.make.graphics();
    const lightColors = [0xFF6B6B, 0xFFD700, 0x6BFFA8, 0x6BB5FF, 0xFF6BFF];
    lightColors.forEach((c, i) => {
      lightGfx.fillStyle(c, 1);
      lightGfx.fillCircle(i * 12 + 6, 6, 5);
    });
    lightGfx.generateTexture('fairy-lights', 70, 12);
    lightGfx.destroy();
  }

  private generateStallTexture(id: string, color: number, emoji: string) {
    const w = 200, h = 180;
    const g = this.make.graphics();

    // Shadow
    g.fillStyle(0x000000, 0.1);
    g.fillRoundedRect(8, 8, w - 8, h - 8, 16);

    // Main building body
    g.fillStyle(color);
    g.fillRoundedRect(4, 40, w - 8, h - 44, 14);
    g.lineStyle(3, 0x2D2016, 1);
    g.strokeRoundedRect(4, 40, w - 8, h - 44, 14);

    // Roof / awning
    const r = (color >> 16) & 0xFF;
    const gr2 = (color >> 8) & 0xFF;
    const b = color & 0xFF;
    const darkerColor = ((Math.max(0, r - 40) << 16) | (Math.max(0, gr2 - 40) << 8) | Math.max(0, b - 40));
    g.fillStyle(darkerColor);
    g.fillTriangle(0, 44, w / 2, 4, w, 44);
    g.lineStyle(3, 0x2D2016, 1);
    g.strokeTriangle(0, 44, w / 2, 4, w, 44);

    // Door
    g.fillStyle(0xFFFFFF, 0.7);
    g.fillRoundedRect(w / 2 - 22, h - 60, 44, 56, 8);
    g.lineStyle(2, 0x2D2016, 0.6);
    g.strokeRoundedRect(w / 2 - 22, h - 60, 44, 56, 8);

    // Window circles
    g.fillStyle(0xFFFFFF, 0.5);
    g.fillCircle(w / 4, h / 2, 16);
    g.fillCircle((3 * w) / 4, h / 2, 16);
    g.lineStyle(2, 0x2D2016, 0.4);
    g.strokeCircle(w / 4, h / 2, 16);
    g.strokeCircle((3 * w) / 4, h / 2, 16);

    // Flag on top
    g.fillStyle(0xFF6B6B);
    g.fillTriangle(w / 2 - 2, 0, w / 2 - 2, 20, w / 2 + 14, 10);
    g.lineStyle(2, 0x2D2016, 0.8);
    g.strokeLineShape(new Phaser.Geom.Line(w / 2 - 2, 0, w / 2 - 2, 4));

    // Decorative dots on awning
    g.fillStyle(0xFFFFFF, 0.6);
    for (let i = 0; i < 5; i++) {
      g.fillCircle(20 + i * 36, 36, 5);
    }

    g.generateTexture(`stall-${id}`, w, h);
    g.destroy();
  }
}
