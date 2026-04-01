import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface JournalEntry {
  id: string;
  sectionId: string;
  type: 'text' | 'drawing' | 'list' | 'vision';
  key: string;
  value: string;
  updatedAt: number;
}

export interface HabitEntry {
  habitName: string;
  checkIns: number[]; // timestamps
  tokens: number;
}

export interface GratitudeNote {
  id: string;
  text: string;
  createdAt: number;
  color: string;
}

export interface FriendFlower {
  id: string;
  name: string;
  description: string;
  flowerType: 'sunflower' | 'rose' | 'daisy' | 'tulip' | 'lavender';
  color: string;
}

interface JournalStore {
  // Active modal
  activeSection: string | null;
  setActiveSection: (id: string | null) => void;

  // Journal entries
  entries: JournalEntry[];
  setEntry: (sectionId: string, key: string, value: string, type?: JournalEntry['type']) => void;
  getEntry: (sectionId: string, key: string) => string;

  // Habits
  habits: HabitEntry[];
  setHabit: (name: string) => void;
  checkInHabit: (name: string) => void;

  // Gratitude notes
  gratitudeNotes: GratitudeNote[];
  addGratitudeNote: (text: string) => void;
  removeGratitudeNote: (id: string) => void;

  // Friend flowers
  friends: FriendFlower[];
  addFriend: (friend: Omit<FriendFlower, 'id'>) => void;
  removeFriend: (id: string) => void;

  // Auth
  user: { email: string; id: string } | null;
  setUser: (user: { email: string; id: string } | null) => void;

  // Visited sections (for progress)
  visitedSections: string[];
  markVisited: (id: string) => void;
}

const NOTE_COLORS = ['#FFD4B8', '#D4B8FF', '#B8FFD4', '#B8D4FF', '#FFB8D4', '#FFF5B8'];

export const useJournalStore = create<JournalStore>()(
  persist(
    (set, get) => ({
      activeSection: null,
      setActiveSection: (id) => set({ activeSection: id }),

      entries: [],
      setEntry: (sectionId, key, value, type = 'text') => {
        const id = `${sectionId}:${key}`;
        set((state) => {
          const existing = state.entries.findIndex((e) => e.id === id);
          const entry: JournalEntry = { id, sectionId, key, value, type, updatedAt: Date.now() };
          if (existing >= 0) {
            const updated = [...state.entries];
            updated[existing] = entry;
            return { entries: updated };
          }
          return { entries: [...state.entries, entry] };
        });
      },
      getEntry: (sectionId, key) => {
        const id = `${sectionId}:${key}`;
        return get().entries.find((e) => e.id === id)?.value ?? '';
      },

      habits: [],
      setHabit: (name) => {
        set((state) => {
          if (state.habits.find((h) => h.habitName === name)) return state;
          return { habits: [...state.habits, { habitName: name, checkIns: [], tokens: 0 }] };
        });
      },
      checkInHabit: (name) => {
        set((state) => {
          return {
            habits: state.habits.map((h) => {
              if (h.habitName !== name) return h;
              const today = new Date().toDateString();
              const alreadyToday = h.checkIns.some((t) => new Date(t).toDateString() === today);
              if (alreadyToday) return h;
              const newCheckIns = [...h.checkIns, Date.now()];
              const tokens = Math.floor(newCheckIns.length / 4);
              return { ...h, checkIns: newCheckIns, tokens };
            }),
          };
        });
      },

      gratitudeNotes: [],
      addGratitudeNote: (text) => {
        const note: GratitudeNote = {
          id: `note-${Date.now()}`,
          text,
          createdAt: Date.now(),
          color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
        };
        set((state) => ({ gratitudeNotes: [...state.gratitudeNotes, note] }));
      },
      removeGratitudeNote: (id) => {
        set((state) => ({ gratitudeNotes: state.gratitudeNotes.filter((n) => n.id !== id) }));
      },

      friends: [],
      addFriend: (friend) => {
        const f: FriendFlower = { ...friend, id: `friend-${Date.now()}` };
        set((state) => ({ friends: [...state.friends, f] }));
      },
      removeFriend: (id) => {
        set((state) => ({ friends: state.friends.filter((f) => f.id !== id) }));
      },

      user: null,
      setUser: (user) => set({ user }),

      visitedSections: [],
      markVisited: (id) => {
        set((state) => {
          if (state.visitedSections.includes(id)) return state;
          return { visitedSections: [...state.visitedSections, id] };
        });
      },
    }),
    {
      name: 'glitrd-journal',
      partialize: (state) => ({
        entries: state.entries,
        habits: state.habits,
        gratitudeNotes: state.gratitudeNotes,
        friends: state.friends,
        visitedSections: state.visitedSections,
      }),
    }
  )
);
