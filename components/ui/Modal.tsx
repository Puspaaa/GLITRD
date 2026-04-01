'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  emoji: string;
  theme: string;
  children: ReactNode;
  wide?: boolean;
}

export default function Modal({ open, onClose, title, emoji, theme, children, wide }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            className={`carnival-card ${theme} flex flex-col`}
            style={{
              width: '100%',
              maxWidth: wide ? 900 : 640,
              maxHeight: '92vh',
              background: 'var(--section-light, #FFF8F0)',
              overflowY: 'auto',
            }}
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 rounded-t-2xl sticky top-0 z-10"
              style={{ background: 'var(--section-color, #FFD4B8)', borderBottom: '2.5px solid #2D2016' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{emoji}</span>
                <h2 className="font-caveat text-2xl font-bold" style={{ color: '#2D2016' }}>{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="btn-hand text-lg px-3 py-1"
                style={{ fontSize: '22px', lineHeight: 1, padding: '4px 12px' }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 scroll-area flex-1">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
