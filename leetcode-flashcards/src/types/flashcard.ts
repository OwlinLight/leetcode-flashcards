export type Difficulty = 'easy' | 'medium' | 'hard';
export type Status = 'new' | 'learning' | 'review' | 'mastered';
export type DifficultyResponse = 'again' | 'hard' | 'good' | 'easy';

export interface Flashcard {
  id: string;
  title: string;
  problem: string;
  solution: string;
  explanation: string;
  difficulty: Difficulty;
  tags: string[];
  status: Status;
  createdAt: Date;
  nextReview: Date;
  interval: number;
  easeFactor: number;
  reviewCount: number;
}

export interface SpacedRepetitionResult {
  nextInterval: number;
  nextReviewDate: Date;
  easeFactor: number;
}

export interface FilterOptions {
  difficulty: Difficulty | 'all';
  status: Status | 'all';
  dateFilter: string;
}