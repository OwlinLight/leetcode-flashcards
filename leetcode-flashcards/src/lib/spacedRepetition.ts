import { DifficultyResponse, SpacedRepetitionResult } from '@/types/flashcard';

export class SpacedRepetition {
  private intervals = {
    again: 1,
    hard: 2,
    good: 4,
    easy: 7
  };

  calculateNextReview(
    difficulty: DifficultyResponse,
    currentInterval = 1,
    easeFactor = 2.5
  ): SpacedRepetitionResult {
    let nextInterval: number;
    let newEaseFactor = easeFactor;

    switch (difficulty) {
      case 'again':
        nextInterval = this.intervals.again;
        newEaseFactor = Math.max(1.3, easeFactor - 0.2);
        break;
      case 'hard':
        nextInterval = Math.max(1, Math.round(currentInterval * this.intervals.hard * (newEaseFactor - 0.15)));
        newEaseFactor = Math.max(1.3, easeFactor - 0.15);
        break;
      case 'good':
        nextInterval = Math.round(currentInterval * newEaseFactor);
        break;
      case 'easy':
        nextInterval = Math.round(currentInterval * newEaseFactor * this.intervals.easy);
        newEaseFactor = easeFactor + 0.15;
        break;
      default:
        nextInterval = this.intervals.good;
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

    return {
      nextInterval,
      nextReviewDate,
      easeFactor: newEaseFactor
    };
  }
}