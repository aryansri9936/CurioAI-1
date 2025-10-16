
import React, { useMemo } from 'react';
import type { QuizAttempt, StoredPdf } from '../types';
import { ChartBarIcon, AcademicCapIcon, StarIcon, ExclamationTriangleIcon } from './icons';

interface DashboardProps {
  quizAttempts: QuizAttempt[];
  pdfs: StoredPdf[];
}

export const Dashboard: React.FC<DashboardProps> = ({ quizAttempts, pdfs }) => {
  const stats = useMemo(() => {
    if (quizAttempts.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        strengths: [],
        weaknesses: [],
      };
    }

    const totalQuizzes = quizAttempts.length;
    const totalScore = quizAttempts.reduce((sum, attempt) => sum + (attempt.score / attempt.totalQuestions), 0);
    const averageScore = (totalScore / totalQuizzes) * 100;

    const topicStats: { [key: string]: { correct: number; total: number } } = {};
    quizAttempts.forEach(attempt => {
      attempt.results.forEach(result => {
        if (!topicStats[result.topic]) {
          topicStats[result.topic] = { correct: 0, total: 0 };
        }
        if (result.isCorrect) {
          topicStats[result.topic].correct++;
        }
        topicStats[result.topic].total++;
      });
    });

    const topicPerformances = Object.entries(topicStats).map(([topic, data]) => ({
      topic,
      performance: data.total > 0 ? (data.correct / data.total) * 100 : 0,
    })).sort((a,b) => b.performance - a.performance);

    const strengths = topicPerformances.filter(t => t.performance >= 80).slice(0, 3);
    const weaknesses = topicPerformances.filter(t => t.performance <= 60).sort((a,b) => a.performance - b.performance).slice(0, 3);

    return {
      totalQuizzes,
      averageScore,
      strengths,
      weaknesses,
    };
  }, [quizAttempts]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex-grow">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200"><ChartBarIcon /> My Progress</h3>
      
      {quizAttempts.length > 0 ? (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Quizzes</p>
                    <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Average Score</p>
                    <p className="text-2xl font-bold">{stats.averageScore.toFixed(0)}%</p>
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-md flex items-center gap-2 text-green-600 dark:text-green-400"><StarIcon /> Strengths</h4>
                <ul className="mt-2 space-y-1 text-sm list-inside">
                    {stats.strengths.length > 0 ? stats.strengths.map(s => (
                        <li key={s.topic} className="p-2 bg-green-50 dark:bg-green-900/30 rounded-md">{s.topic}</li>
                    )) : <p className="text-xs text-gray-500 dark:text-gray-400">Complete more quizzes to identify strengths.</p>}
                </ul>
            </div>

            <div>
                <h4 className="font-semibold text-md flex items-center gap-2 text-red-600 dark:text-red-400"><ExclamationTriangleIcon /> Weaknesses</h4>
                <ul className="mt-2 space-y-1 text-sm list-inside">
                    {stats.weaknesses.length > 0 ? stats.weaknesses.map(w => (
                        <li key={w.topic} className="p-2 bg-red-50 dark:bg-red-900/30 rounded-md">{w.topic}</li>
                    )) : <p className="text-xs text-gray-500 dark:text-gray-400">No weaknesses found yet. Keep it up!</p>}
                </ul>
            </div>
        </div>
      ) : (
        <div className="text-center py-8">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Take a quiz to start tracking your progress and uncover your learning patterns.</p>
        </div>
      )}
    </div>
  );
};
