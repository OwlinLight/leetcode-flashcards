'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Flashcard } from '@/types/flashcard';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';

interface CalendarProps {
  cards: Flashcard[];
  onDateSelect: (date: Date) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Calendar({ cards, onDateSelect, isOpen, onClose }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const getCardsForDate = (date: Date) => {
    return cards.filter(card => isSameDay(card.nextReview, date));
  };

  const getTodayCards = () => {
    const today = new Date();
    return cards.filter(card => 
      isSameDay(card.nextReview, today) || card.nextReview < today
    ).length;
  };

  const getWeekCards = () => {
    const today = new Date();
    const weekFromNow = addDays(today, 7);
    return cards.filter(card => 
      card.nextReview <= weekFromNow
    ).length;
  };

  const renderDays = () => {
    const dateFormat = 'd';
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      const formattedDate = format(day, dateFormat);
      const cloneDay = new Date(day);
      const cardsForDay = getCardsForDate(cloneDay);
      const isToday = isSameDay(day, new Date());
      const isCurrentMonth = isSameMonth(day, monthStart);

      days.push(
        <div
          key={day.toString()}
          className={`
            aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all relative
            ${isCurrentMonth ? 'text-gray-900' : 'text-gray-300'}
            ${isToday ? 'bg-blue-500 text-white font-bold' : 'hover:bg-gray-100'}
            ${cardsForDay.length > 0 ? 'font-semibold' : ''}
          `}
          onClick={() => {
            onDateSelect(cloneDay);
            onClose();
          }}
        >
          {formattedDate}
          {cardsForDay.length > 0 && (
            <div className="absolute bottom-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
          )}
        </div>
      );
      day = addDays(day, 1);
    }

    return days;
  };

  const renderHeader = () => {
    const dateFormat = 'MMMM yyyy';

    return (
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-gray-800">
          {format(currentDate, dateFormat)}
        </h2>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(day => (
      <div key={day} className="text-center font-semibold text-gray-600 py-2">
        {day}
      </div>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl mb-8 border border-white/20">
      {renderHeader()}
      
      <div className="grid grid-cols-7 gap-2 mb-6">
        {renderDaysOfWeek()}
        {renderDays()}
      </div>

      <div className="flex justify-center space-x-12 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {getTodayCards()}
          </div>
          <div className="text-sm font-medium text-gray-600">Today's Cards</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {getWeekCards()}
          </div>
          <div className="text-sm font-medium text-gray-600">Due This Week</div>
        </div>
      </div>
    </div>
  );
}