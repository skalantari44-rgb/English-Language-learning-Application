export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export enum GameStatus {
  LOBBY = 'LOBBY',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  MINDFULNESS_BREAK = 'MINDFULNESS_BREAK',
  VICTORY = 'VICTORY',
  ERROR = 'ERROR'
}

export interface Puzzle {
  id: number;
  question: string;
  type: 'vocabulary' | 'grammar' | 'comprehension' | 'riddle';
  options?: string[]; // For multiple choice if needed, though we might prioritize open text
  correctAnswer: string;
  hint: string;
  explanation: string;
  solved: boolean;
}

export interface RoomData {
  title: string;
  description: string;
  theme: string;
  puzzles: Puzzle[];
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GameState {
  status: GameStatus;
  difficulty: Difficulty;
  theme: string;
  currentRoom: RoomData | null;
  currentPuzzleIndex: number;
  keysCollected: number;
  messages: Message[];
  error?: string;
}