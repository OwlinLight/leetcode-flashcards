'use client';

import { Flashcard } from '@/types/flashcard';
import FlashcardItem from './FlashcardItem';
import Masonry from 'react-masonry-css';

interface FlashcardGridProps {
  cards: Flashcard[];
  onCardClick: (card: Flashcard) => void;
}

const breakpointColumnsObj = {
  default: 3,
  1024: 2,
  768: 1
};

export default function FlashcardGrid({ cards, onCardClick }: FlashcardGridProps) {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto -ml-6"
      columnClassName="pl-6 bg-clip-padding"
    >
      {cards.map((card) => (
        <FlashcardItem
          key={card.id}
          card={card}
          onClick={() => onCardClick(card)}
        />
      ))}
    </Masonry>
  );
}