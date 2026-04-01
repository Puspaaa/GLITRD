'use client';

import { useState, useRef, useEffect } from 'react';
import { useJournalStore } from '@/lib/store';

interface MindNode {
  id: string;
  text: string;
  x: number;
  y: number;
  parent?: string;
  color: string;
}

const NODE_COLORS = ['#FFD4B8', '#D4B8FF', '#B8FFD4', '#B8D4FF', '#FFB8D4', '#FFF5B8'];

export default function HotAirBalloon() {
  const { getEntry, setEntry } = useJournalStore();
  const [activeTab, setActiveTab] = useState<'mindmap' | 'letter' | 'vision' | 'backward'>('mindmap');
  const [nodes, setNodes] = useState<MindNode[]>([
    { id: 'root', text: 'My Dreams', x: 200, y: 160, color: '#FFD4B8' },
  ]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [newNodeText, setNewNodeText] = useState('');
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const [letter, setLetter] = useState(getEntry('goals', 'futureLetter') || '');
  const [backwardGoal, setBackwardGoal] = useState(getEntry('goals', 'backwardGoal') || '');
  const [visionItems, setVisionItems] = useState<string[]>(
    (getEntry('goals', 'vision') || '').split('||').filter(Boolean)
  );
  const [visionInput, setVisionInput] = useState('');

  const addNode = () => {
    if (!newNodeText.trim()) return;
    const parent = selectedNode || 'root';
    const parentNode = nodes.find((n) => n.id === parent)!;
    const angle = Math.random() * 2 * Math.PI;
    const dist = 120;
    const newNode: MindNode = {
      id: `node-${Date.now()}`,
      text: newNodeText.trim(),
      x: Math.max(40, Math.min(360, parentNode.x + Math.cos(angle) * dist)),
      y: Math.max(30, Math.min(290, parentNode.y + Math.sin(angle) * dist)),
      parent,
      color: NODE_COLORS[nodes.length % NODE_COLORS.length],
    };
    setNodes((prev) => [...prev, newNode]);
    setNewNodeText('');
  };

  const startDrag = (e: React.MouseEvent, id: string) => {
    const node = nodes.find((n) => n.id === id)!;
    const rect = svgRef.current!.getBoundingClientRect();
    const scaleX = 400 / rect.width;
    const scaleY = 320 / rect.height;
    setDragging(id);
    setDragOffset({
      x: (e.clientX - rect.left) * scaleX - node.x,
      y: (e.clientY - rect.top) * scaleY - node.y,
    });
  };

  const onDrag = (e: React.MouseEvent) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 400 / rect.width;
    const scaleY = 320 / rect.height;
    const nx = (e.clientX - rect.left) * scaleX - dragOffset.x;
    const ny = (e.clientY - rect.top) * scaleY - dragOffset.y;
    setNodes((prev) => prev.map((n) => n.id === dragging ? { ...n, x: nx, y: ny } : n));
  };

  const addVisionItem = () => {
    if (!visionInput.trim()) return;
    const updated = [...visionItems, visionInput.trim()];
    setVisionItems(updated);
    setEntry('goals', 'vision', updated.join('||'));
    setVisionInput('');
  };

  return (
    <div className="space-y-5">
      <div className="carnival-card p-4" style={{ background: '#FFFFF0', borderColor: '#FFF5B8' }}>
        <p className="font-caveat text-lg italic" style={{ color: '#6B5744' }}>
          "Having dreams and goals in life is essential for giving meaning to one's existence. With teamwork and a clear vision, we can overcome any obstacle." 🎈 — Riddhi
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['mindmap', 'letter', 'vision', 'backward'] as const).map((tab) => (
          <button key={tab} className="btn-hand" style={{ background: activeTab === tab ? '#FFF5B8' : '#FFF' }} onClick={() => setActiveTab(tab)}>
            {tab === 'mindmap' ? '🗺️ Mind Map' : tab === 'letter' ? '✉️ Future Self' : tab === 'vision' ? '📌 Vision Board' : '🔄 Backward Goals'}
          </button>
        ))}
      </div>

      {activeTab === 'mindmap' && (
        <div>
          <div className="flex gap-2 mb-3">
            <input className="input-hand flex-1" placeholder="Add a branch (select a node first)" value={newNodeText} onChange={(e) => setNewNodeText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addNode()} />
            <button className="btn-hand" style={{ background: '#FFF5B8' }} onClick={addNode}>+ Branch</button>
            <button className="btn-hand text-sm" onClick={() => setNodes([{ id: 'root', text: 'My Dreams', x: 200, y: 160, color: '#FFD4B8' }])}>Reset</button>
          </div>
          <div className="carnival-card overflow-hidden" style={{ background: '#FFFDF5' }}>
            <svg
              ref={svgRef}
              viewBox="0 0 400 320"
              width="100%"
              style={{ cursor: dragging ? 'grabbing' : 'default', userSelect: 'none' }}
              onMouseMove={onDrag}
              onMouseUp={() => setDragging(null)}
              onMouseLeave={() => setDragging(null)}
            >
              {/* Connections */}
              {nodes.filter((n) => n.parent).map((n) => {
                const parent = nodes.find((p) => p.id === n.parent);
                if (!parent) return null;
                return (
                  <line key={`line-${n.id}`} x1={parent.x} y1={parent.y} x2={n.x} y2={n.y}
                    stroke="#2D2016" strokeWidth="2" strokeDasharray="5,3" opacity="0.5"/>
                );
              })}
              {/* Nodes */}
              {nodes.map((n) => (
                <g key={n.id} style={{ cursor: 'grab' }}
                  onMouseDown={(e) => { setSelectedNode(n.id); startDrag(e, n.id); }}
                  onClick={() => setSelectedNode(n.id)}
                >
                  <ellipse cx={n.x} cy={n.y} rx={Math.max(35, n.text.length * 5)} ry={20}
                    fill={n.color} stroke={selectedNode === n.id ? '#2D2016' : '#8B6914'} strokeWidth={selectedNode === n.id ? 3 : 1.5}/>
                  <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle"
                    fontSize="11" fontFamily="Caveat, cursive" fill="#2D2016" fontWeight="600">
                    {n.text.length > 16 ? n.text.slice(0, 14) + '…' : n.text}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          {selectedNode && selectedNode !== 'root' && (
            <button className="btn-hand mt-2 text-sm" style={{ background: '#FFB8B8' }} onClick={() => setNodes((prev) => prev.filter((n) => n.id !== selectedNode && n.parent !== selectedNode))}>
              🗑️ Remove selected branch
            </button>
          )}
        </div>
      )}

      {activeTab === 'letter' && (
        <div>
          <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>Letter to your future self ✉️</h3>
          <p className="font-patrick text-sm mb-3" style={{ color: '#6B5744' }}>Imagine yourself 1–5 years from now. What is your ideal life? Be specific, honest, and kind.</p>
          <textarea
            className="textarea-hand"
            rows={12}
            placeholder="Dear future me,&#10;&#10;By the time you read this, I hope you..."
            value={letter}
            onChange={(e) => { setLetter(e.target.value); setEntry('goals', 'futureLetter', e.target.value); }}
          />
          <p className="font-caveat text-sm mt-2 opacity-60" style={{ color: '#2D2016' }}>Set a reminder to read this in 1 year. 🔔</p>
        </div>
      )}

      {activeTab === 'vision' && (
        <div>
          <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>Your vision board 📌</h3>
          <p className="font-patrick text-sm mb-3" style={{ color: '#6B5744' }}>Add things you want to achieve in: Love, Friendship, Health, Work, Family, Travel, Hobbies</p>
          <div className="flex gap-2 mb-4">
            <input className="input-hand flex-1" placeholder="Add a dream, goal, or intention..." value={visionInput} onChange={(e) => setVisionInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addVisionItem()} />
            <button className="btn-hand" style={{ background: '#FFF5B8' }} onClick={addVisionItem}>+ Add</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {visionItems.map((item, i) => (
              <div key={i} className="carnival-card p-3 flex justify-between items-start" style={{ background: NODE_COLORS[i % NODE_COLORS.length], borderColor: '#2D2016' }}>
                <p className="font-caveat text-base" style={{ color: '#2D2016' }}>✨ {item}</p>
                <button className="text-xs opacity-50" onClick={() => { const u = visionItems.filter((_, j) => j !== i); setVisionItems(u); setEntry('goals', 'vision', u.join('||')); }}>✕</button>
              </div>
            ))}
          </div>
          {visionItems.length === 0 && <div className="text-center py-8"><div className="text-5xl">🎈</div><p className="font-caveat text-xl mt-2" style={{ color: '#6B5744' }}>Dream big! Add your first vision.</p></div>}
        </div>
      )}

      {activeTab === 'backward' && (
        <div className="space-y-4">
          <h3 className="font-caveat text-xl font-bold mb-2" style={{ color: '#2D2016' }}>Backward goal setting 🔄</h3>
          <p className="font-patrick text-sm" style={{ color: '#6B5744' }}>Start with the end in mind. Work backwards step by step.</p>
          <div className="carnival-card p-4" style={{ background: '#FFFFF0', borderColor: '#FFF5B8' }}>
            <p className="font-caveat text-base font-bold mb-2">1. Define your end goal 🎯</p>
            <input className="input-hand" placeholder="My end goal is..." value={backwardGoal} onChange={(e) => { setBackwardGoal(e.target.value); setEntry('goals', 'backwardGoal', e.target.value); }} />
          </div>
          {['2. What is the last step before that goal is achieved?', '3. The step before that?', '4. The step before that?', '5. What can I do today?'].map((q, i) => (
            <div key={i} className="carnival-card p-4" style={{ background: '#FFFFF0', borderColor: '#FFF5B8' }}>
              <p className="font-caveat text-base font-bold mb-2">{q}</p>
              <input className="input-hand" placeholder="Step..." defaultValue={getEntry('goals', `backward-step-${i}`)} onChange={(e) => setEntry('goals', `backward-step-${i}`, e.target.value)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
