'use client';

import { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/24/outline';
import { Flashcard, DifficultyResponse } from '@/types/flashcard';
import { isSameDay } from 'date-fns';

interface TodayReviewSessionProps {
  cards: Flashcard[];
  isOpen: boolean;
  onClose: () => void;
  onDifficultyResponse: (cardId: string, difficulty: DifficultyResponse) => void;
}

export default function TodayReviewSession({ cards, isOpen, onClose, onDifficultyResponse }: TodayReviewSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [sessionCards, setSessionCards] = useState<Flashcard[]>([]);

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const todaysCards = cards.filter(card => 
        isSameDay(card.nextReview, today) || card.nextReview < today
      );
      setSessionCards(todaysCards);
      setCurrentIndex(0);
      setShowSolution(false);
    }
  }, [isOpen, cards]);

  const currentCard = sessionCards[currentIndex];
  const hasNext = currentIndex < sessionCards.length - 1;
  const hasPrevious = currentIndex > 0;
  const progress = sessionCards.length > 0 ? ((currentIndex + 1) / sessionCards.length) * 100 : 0;

  const handleNext = () => {
    if (hasNext) {
      setCurrentIndex(currentIndex + 1);
      setShowSolution(false);
    }
  };

  const handlePrevious = () => {
    if (hasPrevious) {
      setCurrentIndex(currentIndex - 1);
      setShowSolution(false);
    }
  };

  const handleDifficultyResponse = (difficulty: DifficultyResponse) => {
    if (currentCard) {
      onDifficultyResponse(currentCard.id, difficulty);
      
      // Auto-advance to next card
      if (hasNext) {
        setTimeout(() => {
          handleNext();
        }, 300);
      } else {
        // Session complete
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    }
  };

  const difficultyButtons = [
    { key: 'again' as DifficultyResponse, label: 'Again', color: 'bg-red-500 hover:bg-red-600 focus:ring-red-500' },
    { key: 'hard' as DifficultyResponse, label: 'Hard', color: 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500' },
    { key: 'good' as DifficultyResponse, label: 'Good', color: 'bg-green-500 hover:bg-green-600 focus:ring-green-500' },
    { key: 'easy' as DifficultyResponse, label: 'Easy', color: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500' }
  ];

  if (sessionCards.length === 0) {
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-center shadow-xl transition-all">
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-green-100 p-3">
                      <PlayIcon className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 mb-2">
                    All caught up!
                  </Dialog.Title>
                  <p className="text-sm text-gray-500 mb-6">
                    You have no cards due for review today. Great job staying on top of your studies!
                  </p>
                  <button
                    onClick={onClose}
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Close
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                      Today's Review Session
                    </Dialog.Title>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {currentIndex + 1} of {sessionCards.length}
                    </span>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Card Content */}
                {currentCard && (
                  <div className="px-6 py-6">
                    <div className="space-y-6">
                      {/* Problem */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xl font-semibold text-gray-900">{currentCard.title}</h4>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            currentCard.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            currentCard.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {currentCard.difficulty}
                          </span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                          <p className="text-gray-700 leading-relaxed">{currentCard.problem}</p>
                        </div>
                      </div>

                      {/* Solution */}
                      {showSolution && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Solution</h4>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                              <code>{currentCard.solution}</code>
                            </pre>
                          </div>
                          
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Explanation</h4>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-gray-700 leading-relaxed">{currentCard.explanation}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="border-t border-gray-200 px-6 py-4">
                  {!showSolution ? (
                    <div className="flex justify-center">
                      <button
                        onClick={() => setShowSolution(true)}
                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Show Solution
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-center text-gray-600 font-medium">How difficult was this problem?</p>
                      <div className="flex flex-wrap justify-center gap-3">
                        {difficultyButtons.map((button) => (
                          <button
                            key={button.key}
                            onClick={() => handleDifficultyResponse(button.key)}
                            className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${button.color}`}
                          >
                            {button.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between items-center mt-6">
                    <button
                      onClick={handlePrevious}
                      disabled={!hasPrevious}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeftIcon className="h-4 w-4 mr-1" />
                      Previous
                    </button>
                    
                    <span className="text-sm text-gray-500">
                      {sessionCards.length - currentIndex - 1} cards remaining
                    </span>
                    
                    <button
                      onClick={handleNext}
                      disabled={!hasNext}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}