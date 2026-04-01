import Phaser from 'phaser';
import { SECTIONS, WORLD_WIDTH, WORLD_HEIGHT, PANDA_START, SectionZone } from '@/lib/sections';

const SPEED = 220;
const STALL_W = 200;
const STALL_H = 180;

export class CarnivalScene extends Phaser.Scene {
  private panda!: Phaser.GameObjects.Image;
  private pandaBody!: Phaser.Physics.Arcade.Body;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
  private interactKey!: Phaser.Input.Keyboard.Key;

  private interactPrompt!: Phaser.GameObjects.Container;
  private promptText!: Phaser.GameObjects.Text;
  private nearZone: SectionZone | null = null;
  private zones: Map<string, Phaser.Geom.Rectangle> = new Map();

  // Touch joystick
  private joystickBase!: Phaser.GameObjects.Arc;
  private joystickThumb!: Phaser.GameObjects.Arc;
  private joystickPointer: Phaser.Input.Pointer | null = null;
  private joystickVec = { x: 0, y: 0 };
  private joystickRadius = 60;

  // Callback to open a section
  public onSectionEnter?: (id: string) => void;

  // Auto-walk target
  private walkTarget: { x: number; y: number } | null = null;

  constructor() {
    super({ key: 'CarnivalScene' });
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.drawWorld();
    this.createPanda();
    this.setupControls();
    this.createInteractPrompt();
    this.createTouchJoystick();
    this.setupZones();
    this.createFairyLights();
    this.createFloatingElements();

    // Follow panda with camera
    this.cameras.main.startFollow(this.panda, true, 0.08, 0.08);
    this.cameras.main.setZoom(1);
  }

  private drawWorld() {
    // Background grass
    for (let x = 0; x < WORLD_WIDTH; x += 64) {
      for (let y = 0; y < WORLD_HEIGHT; y += 64) {
        this.add.image(x + 32, y + 32, 'grass').setDepth(0);
      }
    }

    // Main pathways (cross shape through the world)
    const pathGfx = this.add.graphics().setDepth(1);
    pathGfx.fillStyle(0xF5E6C8);
    // Horizontal main path
    pathGfx.fillRect(0, WORLD_HEIGHT / 2 - 60, WORLD_WIDTH, 120);
    // Vertical main path
    pathGfx.fillRect(WORLD_WIDTH / 2 - 60, 0, 120, WORLD_HEIGHT);
    // Diagonal accent paths connecting entrance to sections
    pathGfx.lineStyle(80, 0xF0DDB8, 0.8);
    SECTIONS.forEach((s) => {
      const cx = s.x + STALL_W / 2;
      const cy = s.y + STALL_H / 2;
      pathGfx.strokeLineShape(new Phaser.Geom.Line(PANDA_START.x, PANDA_START.y, cx, cy));
    });

    // Path border lines
    pathGfx.lineStyle(3, 0xD4B08C, 0.4);
    pathGfx.strokeRect(0, WORLD_HEIGHT / 2 - 60, WORLD_WIDTH, 120);
    pathGfx.strokeRect(WORLD_WIDTH / 2 - 60, 0, 120, WORLD_HEIGHT);

    // Draw entrance arch
    this.add.image(PANDA_START.x, PANDA_START.y + 100, 'entrance').setDepth(2);
    const entranceText = this.add.text(PANDA_START.x, PANDA_START.y + 70, '✨ Welcome ✨', {
      fontFamily: 'Caveat',
      fontSize: '28px',
      color: '#2D2016',
    }).setOrigin(0.5).setDepth(3);
    this.tweens.add({
      targets: entranceText,
      scaleX: 1.05, scaleY: 1.05,
      yoyo: true,
      repeat: -1,
      duration: 1800,
    });

    // Draw stalls
    SECTIONS.forEach((section) => {
      const cx = section.x + STALL_W / 2;
      const cy = section.y + STALL_H / 2;

      // Stall image
      const stall = this.add.image(cx, cy, `stall-${section.id}`).setDepth(4);
      stall.setInteractive({ useHandCursor: true });
      stall.on('pointerdown', () => this.walkToZone(section));
      stall.on('pointerover', () => stall.setTint(0xDDDDDD));
      stall.on('pointerout', () => stall.clearTint());

      // Emoji label
      this.add.text(cx, section.y + 8, section.emoji, {
        fontSize: '28px',
      }).setOrigin(0.5).setDepth(5);

      // Name label
      this.add.text(cx, section.y + STALL_H + 14, section.carnivalName, {
        fontFamily: 'Caveat',
        fontSize: '20px',
        color: '#2D2016',
        align: 'center',
        wordWrap: { width: 220 },
      }).setOrigin(0.5, 0).setDepth(5);

      // Ambient glow under stall
      const glow = this.add.graphics().setDepth(2);
      glow.fillStyle(section.color, 0.12);
      glow.fillEllipse(cx, cy + 30, 240, 100);
    });

    // Border trees / decorations
    this.drawDecorations();
  }

  private drawDecorations() {
    const deco = this.add.graphics().setDepth(2);
    // Trees around the edge
    const treePositions = [
      { x: 100, y: 100 }, { x: 500, y: 80 }, { x: 1000, y: 60 }, { x: 1500, y: 90 },
      { x: 2000, y: 70 }, { x: 2500, y: 100 }, { x: 3100, y: 80 },
      { x: 80, y: 600 }, { x: 80, y: 1200 }, { x: 80, y: 1800 },
      { x: 3120, y: 600 }, { x: 3120, y: 1200 }, { x: 3120, y: 1800 },
      { x: 200, y: 2300 }, { x: 700, y: 2320 }, { x: 1200, y: 2300 },
      { x: 1800, y: 2320 }, { x: 2400, y: 2300 }, { x: 3000, y: 2320 },
    ];
    treePositions.forEach(({ x, y }) => {
      // Trunk
      deco.fillStyle(0x8B6914);
      deco.fillRect(x - 6, y + 20, 12, 30);
      // Foliage
      deco.fillStyle(0x5DBB63);
      deco.fillCircle(x, y + 10, 28);
      deco.fillStyle(0x45A049);
      deco.fillCircle(x - 8, y, 18);
      deco.fillCircle(x + 8, y, 18);
    });

    // Decorative flowers scattered around
    const flowerColors = [0xFF6B9D, 0xFFD700, 0xFF8C42, 0xA8E6CF];
    for (let i = 0; i < 60; i++) {
      const fx = Phaser.Math.Between(150, WORLD_WIDTH - 150);
      const fy = Phaser.Math.Between(150, WORLD_HEIGHT - 150);
      // Avoid stall zones
      const tooClose = SECTIONS.some((s) =>
        Math.abs(fx - (s.x + 100)) < 200 && Math.abs(fy - (s.y + 90)) < 200
      );
      if (tooClose) return;
      const col = flowerColors[i % flowerColors.length];
      deco.fillStyle(col);
      deco.fillCircle(fx, fy, 5);
      deco.fillStyle(0xFFFFFF);
      deco.fillCircle(fx, fy, 2);
    }

    // Carnival banner strings across the top
    const bannerGfx = this.add.graphics().setDepth(6);
    bannerGfx.lineStyle(2, 0x8B4513, 0.6);
    for (let x = 0; x < WORLD_WIDTH; x += 400) {
      bannerGfx.strokeLineShape(new Phaser.Geom.Line(x, 160, x + 400, 160));
      const colors = [0xFF6B6B, 0xFFD700, 0x6BFFA8, 0x6BB5FF, 0xFF6BFF];
      colors.forEach((c, i) => {
        bannerGfx.fillStyle(c);
        bannerGfx.fillTriangle(x + i * 80 + 10, 150, x + i * 80 + 30, 150, x + i * 80 + 20, 175);
      });
    }
  }

  private createFairyLights() {
    // Ambient twinkle effect on some light spots
    const lightPoints = [
      { x: 800, y: 600 }, { x: 1600, y: 400 }, { x: 2400, y: 600 },
      { x: 600, y: 1400 }, { x: 2800, y: 1200 }, { x: 1200, y: 2000 },
    ];
    lightPoints.forEach(({ x, y }) => {
      const light = this.add.graphics().setDepth(3);
      light.fillStyle(0xFFFFAA, 0.5);
      light.fillCircle(x, y, 15);
      this.tweens.add({
        targets: light,
        alpha: { from: 0.2, to: 0.7 },
        scaleX: { from: 0.8, to: 1.2 },
        scaleY: { from: 0.8, to: 1.2 },
        yoyo: true,
        repeat: -1,
        duration: Phaser.Math.Between(1500, 3000),
      });
    });
  }

  private createFloatingElements() {
    // Floating emoji elements
    const floaters = ['✨', '🌟', '💫', '🎪', '🎠', '🎡', '🎢', '🌸', '🦋'];
    floaters.forEach((emoji, i) => {
      const x = Phaser.Math.Between(300, WORLD_WIDTH - 300);
      const y = Phaser.Math.Between(300, WORLD_HEIGHT - 300);
      const txt = this.add.text(x, y, emoji, { fontSize: '22px' }).setDepth(3).setAlpha(0.35);
      this.tweens.add({
        targets: txt,
        y: y - 20,
        alpha: 0.55,
        yoyo: true,
        repeat: -1,
        duration: 2000 + i * 300,
        ease: 'Sine.easeInOut',
      });
    });
  }

  private createPanda() {
    this.panda = this.add.image(PANDA_START.x, PANDA_START.y, 'panda').setDepth(10).setScale(1.6);
    this.physics.add.existing(this.panda);
    this.pandaBody = this.panda.body as Phaser.Physics.Arcade.Body;
    this.pandaBody.setCollideWorldBounds(true);
    this.pandaBody.setSize(40, 30);
    this.pandaBody.setOffset(4, 26);

    // Breathing idle animation
    this.tweens.add({
      targets: this.panda,
      scaleY: 1.65,
      scaleX: 1.55,
      yoyo: true,
      repeat: -1,
      duration: 1200,
      ease: 'Sine.easeInOut',
      paused: false,
    });
  }

  private setupControls() {
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
      this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.interactKey.on('down', () => {
        if (this.nearZone) {
          this.onSectionEnter?.(this.nearZone.id);
        }
      });
    }
  }

  private setupZones() {
    SECTIONS.forEach((section) => {
      this.zones.set(section.id, new Phaser.Geom.Rectangle(section.x, section.y, STALL_W, STALL_H + 40));
    });
  }

  private createInteractPrompt() {
    this.interactPrompt = this.add.container(0, 0).setDepth(20).setVisible(false);
    const bg = this.add.graphics();
    bg.fillStyle(0xFFFFFF, 0.95);
    bg.fillRoundedRect(-85, -20, 170, 40, 10);
    bg.lineStyle(2.5, 0x2D2016, 1);
    bg.strokeRoundedRect(-85, -20, 170, 40, 10);
    this.promptText = this.add.text(0, 0, '', {
      fontFamily: 'Caveat',
      fontSize: '18px',
      color: '#2D2016',
    }).setOrigin(0.5);
    this.interactPrompt.add([bg, this.promptText]);

    // Bounce animation
    this.tweens.add({
      targets: this.interactPrompt,
      y: '-=6',
      yoyo: true,
      repeat: -1,
      duration: 700,
      ease: 'Sine.easeInOut',
    });
  }

  private createTouchJoystick() {
    const isTouchDevice = this.sys.game.device.input.touch;
    if (!isTouchDevice) return;

    const cam = this.cameras.main;
    const baseX = 120;
    const baseY = cam.height - 120;

    this.joystickBase = this.add.circle(baseX, baseY, this.joystickRadius, 0xFFFFFF, 0.35)
      .setDepth(50).setScrollFactor(0);
    this.joystickBase.setStrokeStyle(3, 0x2D2016, 0.6);

    this.joystickThumb = this.add.circle(baseX, baseY, 30, 0x2D2016, 0.6)
      .setDepth(51).setScrollFactor(0);

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.x < cam.width / 2) {
        this.joystickPointer = pointer;
        this.joystickBase.setPosition(pointer.x, pointer.y);
        this.joystickThumb.setPosition(pointer.x, pointer.y);
      }
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.joystickPointer?.id === pointer.id) {
        const dx = pointer.x - this.joystickBase.x;
        const dy = pointer.y - this.joystickBase.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const clamp = Math.min(dist, this.joystickRadius);
        const angle = Math.atan2(dy, dx);
        this.joystickThumb.setPosition(
          this.joystickBase.x + Math.cos(angle) * clamp,
          this.joystickBase.y + Math.sin(angle) * clamp
        );
        this.joystickVec = {
          x: (dist > 10) ? Math.cos(angle) : 0,
          y: (dist > 10) ? Math.sin(angle) : 0,
        };
      }
    });

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (this.joystickPointer?.id === pointer.id) {
        this.joystickPointer = null;
        this.joystickVec = { x: 0, y: 0 };
        this.joystickThumb.setPosition(this.joystickBase.x, this.joystickBase.y);
      }
    });
  }

  walkToZone(section: SectionZone) {
    const cx = section.x + STALL_W / 2;
    const cy = section.y + STALL_H - 20;
    this.walkTarget = { x: cx, y: cy };
  }

  update() {
    if (!this.pandaBody) return;

    this.pandaBody.setVelocity(0, 0);
    let vx = 0, vy = 0;

    // Auto-walk to target
    if (this.walkTarget) {
      const dx = this.walkTarget.x - this.panda.x;
      const dy = this.walkTarget.y - this.panda.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 20) {
        this.walkTarget = null;
        // Open section if close enough
        const near = this.getNearestZone();
        if (near) this.onSectionEnter?.(near.id);
      } else {
        vx = (dx / dist) * SPEED;
        vy = (dy / dist) * SPEED;
      }
    } else {
      // Keyboard input
      if (this.cursors?.left.isDown || this.wasd?.left.isDown) vx = -SPEED;
      if (this.cursors?.right.isDown || this.wasd?.right.isDown) vx = SPEED;
      if (this.cursors?.up.isDown || this.wasd?.up.isDown) vy = -SPEED;
      if (this.cursors?.down.isDown || this.wasd?.down.isDown) vy = SPEED;

      // Joystick
      if (this.joystickVec.x !== 0 || this.joystickVec.y !== 0) {
        vx = this.joystickVec.x * SPEED;
        vy = this.joystickVec.y * SPEED;
      }
    }

    // Diagonal normalization
    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    this.pandaBody.setVelocity(vx, vy);

    // Flip panda based on direction
    if (vx < 0) this.panda.setFlipX(true);
    else if (vx > 0) this.panda.setFlipX(false);

    // Subtle walk bounce
    if (vx !== 0 || vy !== 0) {
      const t = this.time.now / 180;
      this.panda.setY(this.panda.y);
      this.panda.angle = Math.sin(t) * 3;
    } else {
      this.panda.angle = 0;
    }

    // Check zone proximity
    this.checkZoneProximity();
  }

  private getNearestZone(): SectionZone | null {
    let nearest: SectionZone | null = null;
    let nearestDist = 180;
    SECTIONS.forEach((section) => {
      const cx = section.x + STALL_W / 2;
      const cy = section.y + STALL_H / 2;
      const dx = this.panda.x - cx;
      const dy = this.panda.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = section;
      }
    });
    return nearest;
  }

  private checkZoneProximity() {
    const nearest = this.getNearestZone();
    if (nearest) {
      this.nearZone = nearest;
      this.interactPrompt.setVisible(true);
      this.promptText.setText(`[Space] Enter ${nearest.carnivalName}`);
      this.interactPrompt.setPosition(this.panda.x, this.panda.y - 70);
    } else {
      this.nearZone = null;
      this.interactPrompt.setVisible(false);
    }
  }
}
