'use client';

import { useEffect, useRef, useState } from 'react';
import { useJournalStore } from '@/lib/store';

const STORY_PROMPTS = [
  { num: 1, title: '"What if I said yes?"', desc: 'Think of a moment you said no. Write a short story imagining what would have happened if you said yes...' },
  { num: 2, title: 'The door only I can see', desc: 'You notice a door no one else sees. What happens when you open it?' },
  { num: 3, title: 'A letter to my future self', desc: 'Write a letter to yourself five years from now. What do you hope has changed?' },
  { num: 4, title: 'The day time froze', desc: 'Time stops for everyone but you. You have 24 hours. What do you do?' },
  { num: 5, title: 'My life as a movie scene', desc: 'Pick a recent moment and rewrite it as a movie scene. Add music, drama, or humor.' },
  { num: 6, title: 'If my house could talk', desc: 'What would your home say about the life lived inside it?' },
  { num: 7, title: 'A stranger changed my day', desc: 'Write about an unexpected interaction with a stranger that changed your mood or life.' },
  { num: 8, title: 'The best day that never happened', desc: 'Imagine a perfect day that didn\'t happen — but could have. Describe it like it did.' },
  { num: 9, title: 'My life as a star', desc: 'Imagine if you were famous. What would life look like?' },
  { num: 10, title: 'I got sucked into a book', desc: 'What would happen if you got sucked into your favorite novel? How would the plot change?' },
];

const COLORS = ['#2D2016', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#DDA0DD', '#F7DC6F', '#FF8C42', '#FF6B9D', '#6B5744'];
const BRUSH_SIZES = [2, 5, 10, 18, 30];

export default function ArtCorner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#2D2016');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [activeTab, setActiveTab] = useState<'canvas' | 'story' | 'childhood'>('canvas');
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
  const [storyText, setStoryText] = useState('');
  const { getEntry, setEntry } = useJournalStore();
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (activeTab !== 'canvas') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFDF5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Subtle grid
    ctx.strokeStyle = '#F0E8D0';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 30) ctx.strokeRect(x, 0, 30, canvas.height);
  }, [activeTab]);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDrawing(true);
    const pos = getPos(e, canvas);
    lastPoint.current = pos;
    const ctx = canvas.getContext('2d')!;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, (tool === 'eraser' ? brushSize * 2 : brushSize) / 2, 0, Math.PI * 2);
    ctx.fillStyle = tool === 'eraser' ? '#FFFDF5' : color;
    ctx.fill();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e, canvas);
    const last = lastPoint.current || pos;
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === 'eraser' ? '#FFFDF5' : color;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 2 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPoint.current = pos;
  };

  const endDraw = () => { setDrawing(false); lastPoint.current = null; };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#FFFDF5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'my-glitrd-artwork.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-5">
      {/* Therapist note */}
      <div className="carnival-card p-4" style={{ background: '#FFF8F0', borderColor: '#FFD4B8' }}>
        <p className="font-caveat text-lg italic" style={{ color: '#6B5744' }}>
          "Doodle freely for 5 minutes. Don't worry about making it perfect — just let your hand move and see where it takes you." 🎨
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['canvas', 'story', 'childhood'] as const).map((tab) => (
          <button
            key={tab}
            className="btn-hand"
            style={{ background: activeTab === tab ? '#FFD4B8' : '#FFF' }}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'canvas' ? '🖌️ Free Draw' : tab === 'story' ? '📖 Story Prompts' : '👶 Inner Child'}
          </button>
        ))}
      </div>

      {activeTab === 'canvas' && (
        <div>
          {/* Toolbar */}
          <div className="flex flex-wrap gap-3 mb-3 items-center">
            <div className="flex gap-1">
              {COLORS.map((c) => (
                <button
                  key={c}
                  className="rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    width: 28, height: 28,
                    background: c,
                    borderColor: color === c ? '#2D2016' : 'transparent',
                    transform: color === c ? 'scale(1.2)' : undefined,
                  }}
                  onClick={() => { setColor(c); setTool('pen'); }}
                />
              ))}
            </div>
            <div className="flex gap-2 items-center ml-2">
              {BRUSH_SIZES.map((s) => (
                <button
                  key={s}
                  className="rounded-full border-2 flex items-center justify-center transition-transform hover:scale-110"
                  style={{
                    width: 32, height: 32,
                    borderColor: brushSize === s ? '#2D2016' : '#CCC',
                    background: '#FFF',
                  }}
                  onClick={() => setBrushSize(s)}
                >
                  <div style={{ width: s, height: s, borderRadius: '50%', background: '#2D2016', maxWidth: 24, maxHeight: 24 }} />
                </button>
              ))}
            </div>
            <button className="btn-hand" style={{ background: tool === 'eraser' ? '#FFB8B8' : '#FFF' }} onClick={() => setTool('eraser')}>🧹 Eraser</button>
            <button className="btn-hand" onClick={clearCanvas}>🗑️ Clear</button>
            <button className="btn-hand" style={{ background: '#D4FFB8' }} onClick={downloadCanvas}>💾 Save</button>
          </div>

          <div className="carnival-card overflow-hidden" style={{ cursor: tool === 'eraser' ? 'cell' : 'crosshair' }}>
            <canvas
              ref={canvasRef}
              width={800}
              height={480}
              style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none' }}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
            />
          </div>
        </div>
      )}

      {activeTab === 'story' && (
        <div className="space-y-4">
          <p className="font-patrick text-sm" style={{ color: '#6B5744' }}>Let your inner child run today! Pick a prompt:</p>
          <div className="grid grid-cols-1 gap-2">
            {STORY_PROMPTS.map((p) => (
              <button
                key={p.num}
                className="carnival-card text-left p-3 transition-all"
                style={{
                  background: selectedPrompt === p.num ? '#FFF8F0' : '#FFF',
                  borderColor: selectedPrompt === p.num ? '#FF8C42' : '#2D2016',
                }}
                onClick={() => setSelectedPrompt(p.num)}
              >
                <span className="font-caveat text-base font-bold">{p.num}. {p.title}</span>
                <p className="font-patrick text-xs mt-1" style={{ color: '#888' }}>{p.desc}</p>
              </button>
            ))}
          </div>
          {selectedPrompt && (
            <div className="mt-4">
              <p className="font-caveat text-lg font-bold mb-2" style={{ color: '#2D2016' }}>
                {STORY_PROMPTS.find((p) => p.num === selectedPrompt)?.title}
              </p>
              <textarea
                className="textarea-hand"
                rows={8}
                placeholder="Once upon a time..."
                value={storyText || getEntry('creativity', `story-${selectedPrompt}`)}
                onChange={(e) => {
                  setStoryText(e.target.value);
                  setEntry('creativity', `story-${selectedPrompt}`, e.target.value);
                }}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'childhood' && (
        <div className="space-y-5">
          <div>
            <h3 className="font-caveat text-lg font-bold mb-2" style={{ color: '#2D2016' }}>What parts of your younger self do you miss?</h3>
            <textarea
              className="textarea-hand"
              rows={4}
              placeholder="The fearlessness, the imagination, the way everything felt magical..."
              defaultValue={getEntry('creativity', 'missYounger')}
              onChange={(e) => setEntry('creativity', 'missYounger', e.target.value)}
            />
          </div>
          <div>
            <h3 className="font-caveat text-lg font-bold mb-2" style={{ color: '#2D2016' }}>What was your biggest wish as a child? Did it come true?</h3>
            <textarea
              className="textarea-hand"
              rows={4}
              placeholder="I wished that..."
              defaultValue={getEntry('creativity', 'childhoodWish')}
              onChange={(e) => setEntry('creativity', 'childhoodWish', e.target.value)}
            />
          </div>
          <div>
            <h3 className="font-caveat text-lg font-bold mb-2" style={{ color: '#2D2016' }}>If your childhood self walked in right now...</h3>
            <p className="font-patrick text-sm mb-2" style={{ color: '#6B5744' }}>What would you tell them first? What would excite them most about your life? What parts haven't changed?</p>
            <textarea
              className="textarea-hand"
              rows={6}
              placeholder="Little me, I have so much to tell you..."
              defaultValue={getEntry('creativity', 'letterToChild')}
              onChange={(e) => setEntry('creativity', 'letterToChild', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
