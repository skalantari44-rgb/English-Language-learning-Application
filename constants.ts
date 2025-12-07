import { Difficulty } from './types';

export const THEMES = [
  { id: 'library', name: 'The Silent Library', icon: '📚', description: 'A place of ancient wisdom and hushed whispers.' },
  { id: 'garden', name: 'The Zen Garden', icon: '🎋', description: 'Nature weaves puzzles into the leaves and stones.' },
  { id: 'observatory', name: 'The Celestial Observatory', icon: '🔭', description: 'Look to the stars to find the right words.' },
  { id: 'teahouse', name: 'The Floating Tea House', icon: '🍵', description: 'Sip tea and reflect on the fluidity of language.' },
];

export const DIFFICULTIES: { id: Difficulty; label: string; desc: string }[] = [
  { id: 'Beginner', label: 'Seeker', desc: 'Basic vocabulary and simple sentence structures.' },
  { id: 'Intermediate', label: 'Wanderer', desc: 'Complex grammar and idiomatic expressions.' },
  { id: 'Advanced', label: 'Sage', desc: 'Nuanced comprehension, obscure vocabulary, and poetic riddles.' },
];

export const SYSTEM_INSTRUCTION = `
You are the "Guardian of Words," a wise, calm, and encouraging guide in a mindfulness-based English learning escape room game.
Your goal is to help users learn English through puzzles while maintaining a serene atmosphere.
Do not be overly punitive. If a user is wrong, gently guide them.
Adopt a tone that is soothing, using metaphors of nature, light, and clarity.
`;
