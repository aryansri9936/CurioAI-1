
import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import type { StoredPdf, QuizAttempt, Question } from '../types';
import { QuestionType, MCQ, SAQ } from '../types';
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from './icons';

interface QuizViewProps {
  pdf: StoredPdf;
  addQuizAttempt: (attempt: QuizAttempt) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ pdf, addQuizAttempt }) => {
  const [quizType, setQuizType] = useState<QuestionType>(QuestionType.MCQ);
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | string[])[]>([]);
  const [quizState, setQuizState] = useState<'config' | 'loading' | 'active' | 'results'>('config');
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuiz = async () => {
    setQuizState('loading');
    setError(null);
    try {
      const generatedQuestions = await generateQuiz(pdf.textContent, quizType, numQuestions);
      setQuestions(generatedQuestions);
      setUserAnswers(new Array(generatedQuestions.length).fill(null));
      setCurrentQuestionIndex(0);
      setQuizState('active');
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
      setQuizState('config');
    }
  };

  const handleAnswer = (answer: string | string[]) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleSubmit = () => {
    setQuizState('results');
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, index) => {
        if (q.hasOwnProperty('options')) { // MCQ
            if(userAnswers[index] === (q as MCQ).correctAnswer) score++;
        } else { // SAQ/LAQ (simplified scoring)
            if(userAnswers[index] && (userAnswers[index] as string).length > 0) score++; // For now, just grade if answered
        }
    });
    return score;
  };

  const saveResults = () => {
    const score = calculateScore();
    const attempt: QuizAttempt = {
        id: `attempt-${Date.now()}`,
        pdfId: pdf.id,
        pdfName: pdf.name,
        date: Date.now(),
        score: score,
        totalQuestions: questions.length,
        results: questions.map((q, index) => ({
            question: q.question,
            isCorrect: q.hasOwnProperty('options') ? userAnswers[index] === (q as MCQ).correctAnswer : (userAnswers[index] as string)?.length > 0,
            topic: q.topic,
        }))
    };
    addQuizAttempt(attempt);
    alert('Results saved!');
  };

  const startNewQuiz = () => {
    setQuestions([]);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setQuizState('config');
  }

  const renderConfig = () => (
    <div className="max-w-md mx-auto p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner">
      <h3 className="text-xl font-bold mb-4 text-center">Generate Quiz</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="quizType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Question Type</label>
          <select id="quizType" value={quizType} onChange={e => setQuizType(e.target.value as QuestionType)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800">
            <option value={QuestionType.MCQ}>Multiple Choice</option>
            <option value={QuestionType.SAQ}>Short Answer</option>
            <option value={QuestionType.LAQ}>Long Answer</option>
          </select>
        </div>
        <div>
          <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Number of Questions</label>
          <input type="number" id="numQuestions" value={numQuestions} onChange={e => setNumQuestions(Math.max(1, Math.min(10, parseInt(e.target.value))))} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800" min="1" max="10" />
        </div>
        <button onClick={handleGenerateQuiz} className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
          Start Quiz
        </button>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <ArrowPathIcon className="h-12 w-12 animate-spin text-indigo-500" />
      <p className="mt-4 text-lg font-medium">Generating your quiz...</p>
      <p className="text-sm text-gray-500">This might take a moment.</p>
    </div>
  );
  
  const renderQuiz = () => {
    const q = questions[currentQuestionIndex];
    const questionNumber = currentQuestionIndex + 1;
    
    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow">
                <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Question {questionNumber} of {questions.length}</p>
                <h4 className="mt-1 text-lg font-bold">{q.question}</h4>
                <div className="mt-4 space-y-3">
                    {q.hasOwnProperty('options') && (q as MCQ).options.map((option, index) => (
                        <label key={index} className={`flex items-center p-3 rounded-md border-2 transition-all ${userAnswers[currentQuestionIndex] === option ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                            <input type="radio" name={`q-${currentQuestionIndex}`} value={option} checked={userAnswers[currentQuestionIndex] === option} onChange={(e) => handleAnswer(e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                            <span className="ml-3 text-sm">{option}</span>
                        </label>
                    ))}
                    {(q.hasOwnProperty('answer') || q.hasOwnProperty('answerKeywords')) && (
                        <textarea value={(userAnswers[currentQuestionIndex] as string) || ''} onChange={e => handleAnswer(e.target.value)} rows={5} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Type your answer here..."/>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <button onClick={handlePrev} disabled={currentQuestionIndex === 0} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">Previous</button>
                {currentQuestionIndex === questions.length - 1 ? (
                    <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700">Submit</button>
                ) : (
                    <button onClick={handleNext} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700">Next</button>
                )}
            </div>
        </div>
    );
  };

  const renderResults = () => {
    const score = calculateScore();
    return (
        <div className="space-y-6">
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="text-2xl font-bold">Quiz Complete!</h3>
                <p className="mt-2 text-lg">Your score: <span className="font-bold text-indigo-600 dark:text-indigo-400">{score} / {questions.length}</span></p>
            </div>
            <div className="space-y-4">
                {questions.map((q, index) => {
                    const isMCQ = q.hasOwnProperty('options');
                    const isCorrect = isMCQ ? userAnswers[index] === (q as MCQ).correctAnswer : (userAnswers[index] as string)?.length > 0;
                    return (
                    <div key={index} className="p-4 border rounded-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <div className="flex items-start gap-3">
                            {isCorrect ? <CheckCircleIcon className="h-5 w-5 text-green-500 mt-1" /> : <XCircleIcon className="h-5 w-5 text-red-500 mt-1" />}
                            <p className="flex-1 font-semibold">{q.question}</p>
                        </div>
                        {isMCQ && <p className="mt-2 ml-8 text-sm">Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{userAnswers[index] || "Not answered"}</span></p>}
                        {isMCQ && !isCorrect && <p className="mt-1 ml-8 text-sm">Correct answer: <span className="text-green-600">{(q as MCQ).correctAnswer}</span></p>}
                        <div className="mt-2 ml-8 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                            <p className="text-sm font-semibold">Explanation</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{q.explanation}</p>
                        </div>
                    </div>
                )})}
            </div>
             <div className="flex gap-4 mt-6">
                <button onClick={saveResults} className="flex-1 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">Save Results</button>
                <button onClick={startNewQuiz} className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors">New Quiz</button>
            </div>
        </div>
    )
  };

  return (
    <div>
      {quizState === 'config' && renderConfig()}
      {quizState === 'loading' && renderLoading()}
      {quizState === 'active' && renderQuiz()}
      {quizState === 'results' && renderResults()}
    </div>
  );
};
