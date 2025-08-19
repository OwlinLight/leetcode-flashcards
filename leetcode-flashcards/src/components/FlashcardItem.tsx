'use client';

import { Flashcard } from '@/types/flashcard';
import { formatDistanceToNow, isBefore } from 'date-fns';

interface FlashcardItemProps {
  card: Flashcard;
  onClick: () => void;
}

const difficultyColors = {
  easy: 'border-l-green-500 bg-green-50',
  medium: 'border-l-orange-500 bg-orange-50',
  hard: 'border-l-red-500 bg-red-50'
};

const difficultyBadgeColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-orange-100 text-orange-800',
  hard: 'bg-red-100 text-red-800'
};

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  learning: 'bg-orange-100 text-orange-800',
  review: 'bg-green-100 text-green-800',
  mastered: 'bg-purple-100 text-purple-800'
};

export default function FlashcardItem({ card, onClick }: FlashcardItemProps) {
  const isOverdue = isBefore(card.nextReview, new Date());
  const dueDateText = isOverdue ? 'Overdue' : formatDistanceToNow(card.nextReview, { addSuffix: true });

  return (
    <div
      className={`group relative rounded-xl bg-white p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-100 ${difficultyColors[card.difficulty]} shadow-lg overflow-hidden`}
      onClick={onClick}
    >
      {/* Gradient overlay for hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
            {card.title}
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyBadgeColors[card.difficulty]}`}>
            {card.difficulty}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {card.problem}
        </p>
        
        <div className="flex justify-between items-center text-sm mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[card.status]}`}>
            {card.status}
          </span>
          <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
            {dueDateText}
          </span>
        </div>
        
        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {card.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 group-hover:bg-blue-100 group-hover:text-blue-800 transition-colors"
              >
                {tag}
              </span>
            ))}
            {card.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                +{card.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}