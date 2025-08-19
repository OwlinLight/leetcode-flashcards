'use client';

import { Flashcard } from '@/types/flashcard';
import FlashcardItem from './FlashcardItem';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface CardSectionProps {
  title: string;
  subtitle?: string;
  cards: Flashcard[];
  onCardClick: (card: Flashcard) => void;
  className?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export default function CardSection({ 
  title, 
  subtitle, 
  cards, 
  onCardClick, 
  className = '',
  showViewAll = false,
  onViewAll
}: CardSectionProps) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        {showViewAll && onViewAll && (
          <button
            onClick={onViewAll}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all
            <ChevronRightIcon className="ml-1 h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <FlashcardItem
            key={card.id}
            card={card}
            onClick={() => onCardClick(card)}
          />
        ))}
      </div>
    </div>
  );
}