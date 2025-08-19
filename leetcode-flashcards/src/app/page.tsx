'use client';

import { useState, useEffect, useMemo } from 'react';
import { CalendarDaysIcon, PlusIcon, CodeBracketIcon, PlayIcon } from '@heroicons/react/24/outline';
import { isSameDay, format, addDays, startOfDay } from 'date-fns';

import { Flashcard, FilterOptions, DifficultyResponse } from '@/types/flashcard';
import { SpacedRepetition } from '@/lib/spacedRepetition';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { sampleCards } from '@/data/sampleCards';

import FlashcardGrid from '@/components/FlashcardGrid';
import StudyModal from '@/components/StudyModal';
import Calendar from '@/components/Calendar';
import FilterBar from '@/components/FilterBar';
import AddCardModal from '@/components/AddCardModal';
import ReviewStats from '@/components/ReviewStats';
import TodayReviewSession from '@/components/TodayReviewSession';
import CardSection from '@/components/CardSection';

export default function Home() {
  const [cards, setCards] = useLocalStorage<Flashcard[]>('leetcode-flashcards', []);
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isTodaySessionOpen, setIsTodaySessionOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    difficulty: 'all',
    status: 'all',
    dateFilter: ''
  });

  const spacedRepetition = new SpacedRepetition();

  useEffect(() => {
    if (cards.length === 0) {
      setCards(sampleCards);
    }
  }, [cards.length, setCards]);

  const { todayCards, thisWeekCards, futureCards, filteredCards } = useMemo(() => {
    const today = new Date();
    const sevenDaysFromNow = addDays(today, 7);
    
    const todayCards = cards.filter(card => 
      isSameDay(card.nextReview, today) || card.nextReview < startOfDay(today)
    );
    
    const thisWeekCards = cards.filter(card => {
      const isAfterToday = card.nextReview > today;
      const isWithinWeek = card.nextReview <= sevenDaysFromNow;
      return isAfterToday && isWithinWeek;
    });
    
    const futureCards = cards.filter(card => card.nextReview > sevenDaysFromNow);
    
    const filteredCards = cards.filter(card => {
      if (filters.difficulty !== 'all' && card.difficulty !== filters.difficulty) {
        return false;
      }
      if (filters.status !== 'all' && card.status !== filters.status) {
        return false;
      }
      if (filters.dateFilter) {
        const filterDate = new Date(filters.dateFilter);
        if (!isSameDay(card.nextReview, filterDate)) {
          return false;
        }
      }
      return true;
    });
    
    return { todayCards, thisWeekCards, futureCards, filteredCards };
  }, [cards, filters]);

  const handleCardClick = (card: Flashcard) => {
    setSelectedCard(card);
    setIsStudyModalOpen(true);
  };

  const handleDifficultyResponse = (difficulty: DifficultyResponse) => {
    if (!selectedCard) return;

    const result = spacedRepetition.calculateNextReview(
      difficulty,
      selectedCard.interval,
      selectedCard.easeFactor
    );

    const updatedCard: Flashcard = {
      ...selectedCard,
      interval: result.nextInterval,
      nextReview: result.nextReviewDate,
      easeFactor: result.easeFactor,
      reviewCount: selectedCard.reviewCount + 1,
      status: difficulty === 'easy' && selectedCard.reviewCount >= 2 
        ? 'mastered' 
        : difficulty === 'again' 
        ? 'learning' 
        : selectedCard.reviewCount >= 0 
        ? 'review' 
        : selectedCard.status
    };

    setCards(prevCards => 
      prevCards.map(card => 
        card.id === selectedCard.id ? updatedCard : card
      )
    );

    setIsStudyModalOpen(false);
    setSelectedCard(null);
  };

  const handleSessionDifficultyResponse = (cardId: string, difficulty: DifficultyResponse) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    const result = spacedRepetition.calculateNextReview(
      difficulty,
      card.interval,
      card.easeFactor
    );

    const updatedCard: Flashcard = {
      ...card,
      interval: result.nextInterval,
      nextReview: result.nextReviewDate,
      easeFactor: result.easeFactor,
      reviewCount: card.reviewCount + 1,
      status: difficulty === 'easy' && card.reviewCount >= 2 
        ? 'mastered' 
        : difficulty === 'again' 
        ? 'learning' 
        : card.reviewCount >= 0 
        ? 'review' 
        : card.status
    };

    setCards(prevCards => 
      prevCards.map(c => 
        c.id === cardId ? updatedCard : c
      )
    );
  };

  const handleAddCard = (newCardData: Omit<Flashcard, 'id' | 'createdAt' | 'nextReview' | 'interval' | 'easeFactor' | 'reviewCount' | 'status'>) => {
    const newCard: Flashcard = {
      ...newCardData,
      id: Date.now().toString(),
      status: 'new',
      createdAt: new Date(),
      nextReview: new Date(),
      interval: 1,
      easeFactor: 2.5,
      reviewCount: 0
    };

    setCards(prevCards => [...prevCards, newCard]);
  };

  const handleDateSelect = (date: Date) => {
    setFilters(prev => ({
      ...prev,
      dateFilter: format(date, 'yyyy-MM-dd')
    }));
  };

  const clearFilters = () => {
    setFilters({
      difficulty: 'all',
      status: 'all',
      dateFilter: ''
    });
  };

  const hasFiltersApplied = filters.difficulty !== 'all' || filters.status !== 'all' || filters.dateFilter !== '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl mb-8 border border-white/20">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <CodeBracketIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">LeetCode Flashcards</h1>
                <p className="text-gray-600 mt-1">Master algorithms with spaced repetition</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {todayCards.length > 0 && (
                <button
                  onClick={() => setIsTodaySessionOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg"
                >
                  <PlayIcon className="h-5 w-5" />
                  Start Today's Review ({todayCards.length})
                </button>
              )}
              
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="relative inline-flex items-center gap-2 px-3 py-2 bg-white/80 text-gray-700 rounded-lg hover:bg-white transition-all duration-200 font-medium shadow-md border border-gray-200"
              >
                <CalendarDaysIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Schedule</span>
              </button>
              
              <button
                onClick={() => setIsAddCardModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg"
              >
                <PlusIcon className="h-5 w-5" />
                Add Card
              </button>
            </div>
          </div>
        </header>

        {/* Review Stats */}
        <ReviewStats cards={cards} />

        {/* Calendar */}
        <Calendar
          cards={cards}
          onDateSelect={handleDateSelect}
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
        />

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
        />

        {/* Card Sections */}
        <div className="space-y-8">
          {hasFiltersApplied ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Filtered Results</h2>
                <span className="text-sm text-gray-600">{filteredCards.length} cards found</span>
              </div>
              {filteredCards.length > 0 ? (
                <FlashcardGrid
                  cards={filteredCards}
                  onCardClick={handleCardClick}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <CodeBracketIcon className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No cards found</h3>
                  <p className="text-gray-600">Try adjusting your filters or add some new cards</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Today's Cards */}
              {todayCards.length > 0 && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
                  <CardSection
                    title="Due Today"
                    subtitle={`${todayCards.length} cards need your attention`}
                    cards={todayCards.slice(0, 6)}
                    onCardClick={handleCardClick}
                    showViewAll={todayCards.length > 6}
                    onViewAll={() => setIsTodaySessionOpen(true)}
                  />
                </div>
              )}

              {/* This Week's Cards */}
              {thisWeekCards.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                  <CardSection
                    title="Due This Week"
                    subtitle={`${thisWeekCards.length} cards coming up`}
                    cards={thisWeekCards.slice(0, 6)}
                    onCardClick={handleCardClick}
                    showViewAll={thisWeekCards.length > 6}
                  />
                </div>
              )}

              {/* Future Cards */}
              {futureCards.length > 0 && (
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-8 border border-gray-100">
                  <CardSection
                    title="Upcoming Reviews"
                    subtitle={`${futureCards.length} cards scheduled for later`}
                    cards={futureCards.slice(0, 6)}
                    onCardClick={handleCardClick}
                    showViewAll={futureCards.length > 6}
                  />
                </div>
              )}

              {/* Empty State */}
              {cards.length === 0 && (
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-16 shadow-xl border border-white/20 text-center">
                  <div className="text-gray-400 mb-6">
                    <CodeBracketIcon className="h-24 w-24 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to LeetCode Flashcards!</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Start building your programming knowledge with spaced repetition. Add your first flashcard to get started.
                  </p>
                  <button
                    onClick={() => setIsAddCardModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Create Your First Card
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modals */}
        <StudyModal
          card={selectedCard}
          isOpen={isStudyModalOpen}
          onClose={() => {
            setIsStudyModalOpen(false);
            setSelectedCard(null);
          }}
          onDifficultyResponse={handleDifficultyResponse}
        />

        <TodayReviewSession
          cards={cards}
          isOpen={isTodaySessionOpen}
          onClose={() => setIsTodaySessionOpen(false)}
          onDifficultyResponse={handleSessionDifficultyResponse}
        />

        <AddCardModal
          isOpen={isAddCardModalOpen}
          onClose={() => setIsAddCardModalOpen(false)}
          onAddCard={handleAddCard}
        />
      </div>
    </div>
  );
}
