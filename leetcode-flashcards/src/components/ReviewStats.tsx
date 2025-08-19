'use client';

import { Flashcard } from '@/types/flashcard';
import { ChartBarIcon, FireIcon, CalendarDaysIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { isSameDay, isWithinInterval, startOfDay, endOfDay, subDays } from 'date-fns';

interface ReviewStatsProps {
  cards: Flashcard[];
}

export default function ReviewStats({ cards }: ReviewStatsProps) {
  const today = new Date();
  const sevenDaysAgo = subDays(today, 7);

  const getTodayStats = () => {
    const todayCards = cards.filter(card => 
      isSameDay(card.nextReview, today) || card.nextReview < today
    );
    return {
      total: todayCards.length,
      overdue: cards.filter(card => card.nextReview < startOfDay(today)).length
    };
  };

  const getWeeklyStats = () => {
    const weekReviews = cards.filter(card => 
      isWithinInterval(card.nextReview, { start: sevenDaysAgo, end: today })
    );
    return weekReviews.length;
  };

  const getStreakStats = () => {
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
      const hasReviewToday = cards.some(card => 
        isSameDay(card.nextReview, currentDate) && card.reviewCount > 0
      );
      
      if (!hasReviewToday) break;
      streak++;
      currentDate = subDays(currentDate, 1);
    }
    
    return streak;
  };

  const getMasteryStats = () => {
    const masteredCount = cards.filter(card => card.status === 'mastered').length;
    const totalCards = cards.length;
    const percentage = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;
    
    return { masteredCount, totalCards, percentage };
  };

  const todayStats = getTodayStats();
  const weeklyStats = getWeeklyStats();
  const streak = getStreakStats();
  const masteryStats = getMasteryStats();

  const statCards = [
    {
      title: "Today's Reviews",
      value: todayStats.total,
      subtitle: todayStats.overdue > 0 ? `${todayStats.overdue} overdue` : 'All caught up!',
      icon: CalendarDaysIcon,
      color: todayStats.overdue > 0 ? 'text-red-600' : 'text-blue-600',
      bgColor: todayStats.overdue > 0 ? 'bg-red-50' : 'bg-blue-50'
    },
    {
      title: 'Study Streak',
      value: `${streak} days`,
      subtitle: 'Keep it going!',
      icon: FireIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Weekly Progress',
      value: weeklyStats,
      subtitle: 'Cards reviewed',
      icon: ChartBarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Mastery Rate',
      value: `${masteryStats.percentage}%`,
      subtitle: `${masteryStats.masteredCount}/${masteryStats.totalCards} mastered`,
      icon: TrophyIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}