'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { Flashcard, DifficultyResponse } from '@/types/flashcard';

interface StudyModalProps {
  card: Flashcard | null;
  isOpen: boolean;
  onClose: () => void;
  onDifficultyResponse: (difficulty: DifficultyResponse) => void;
}

const difficultyButtons = [
  { key: 'again' as DifficultyResponse, label: 'Again', color: 'bg-red-500 hover:bg-red-600' },
  { key: 'hard' as DifficultyResponse, label: 'Hard', color: 'bg-orange-500 hover:bg-orange-600' },
  { key: 'good' as DifficultyResponse, label: 'Good', color: 'bg-green-500 hover:bg-green-600' },
  { key: 'easy' as DifficultyResponse, label: 'Easy', color: 'bg-blue-500 hover:bg-blue-600' }
];

export default function StudyModal({ card, isOpen, onClose, onDifficultyResponse }: StudyModalProps) {
  const [showSolution, setShowSolution] = useState(false);

  const handleClose = () => {
    setShowSolution(false);
    onClose();
  };

  const handleDifficultyResponse = (difficulty: DifficultyResponse) => {
    onDifficultyResponse(difficulty);
    setShowSolution(false);
  };

  if (!card) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900">
                    {card.title}
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Problem</h4>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                      <p className="text-gray-700 leading-relaxed">{card.problem}</p>
                    </div>
                  </div>

                  {showSolution && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Solution</h4>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{card.solution}</code>
                        </pre>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Explanation</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700 leading-relaxed">{card.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col items-center space-y-4">
                    {!showSolution ? (
                      <button
                        onClick={() => setShowSolution(true)}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Show Solution
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-center text-gray-600 font-medium">How difficult was this problem?</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                          {difficultyButtons.map((button) => (
                            <button
                              key={button.key}
                              onClick={() => handleDifficultyResponse(button.key)}
                              className={`${button.color} text-white px-6 py-2 rounded-lg font-semibold transition-colors`}
                            >
                              {button.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
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