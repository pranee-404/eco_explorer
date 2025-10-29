import React, { useState, useEffect, useMemo } from 'react';
import type { QuickDrillQuestion } from '../types';
import { DRILL_QUESTIONS } from '../constants';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface QuickDrillProps {
  onComplete: (xp: number) => void;
  onBack: () => void;
}

const QuickDrill: React.FC<QuickDrillProps> = ({ onComplete, onBack }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);

  const currentQuestion = useMemo(() => DRILL_QUESTIONS[questionIndex], [questionIndex]);

  const handleNextQuestion = () => {
    setFeedback(null);
    setAnswer('');
    if (questionIndex + 1 < DRILL_QUESTIONS.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      // End of drill
      onComplete(score);
    }
  };
  
  const checkAnswer = () => {
    if (answer.trim() === String(currentQuestion.answer)) {
      setFeedback('correct');
      setScore(score + 10); // 10 XP per correct answer
      setTimeout(handleNextQuestion, 1000);
    } else {
      setFeedback('incorrect');
      setTimeout(handleNextQuestion, 1500);
    }
  };

  const renderQuestion = () => {
    if (currentQuestion.type === 'fill-blank') {
      return (
        <div className="flex items-center justify-center text-2xl md:text-3xl font-mono text-gray-700 dark:text-gray-200">
          <span>{currentQuestion.parts[0]}</span>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
            className="w-20 mx-2 text-center border-b-2 border-gray-400 focus:border-purple-500 dark:border-gray-500 dark:focus:border-purple-400 outline-none bg-transparent"
            autoFocus
          />
          <span>{currentQuestion.parts[1]}</span>
        </div>
      );
    }
    if (currentQuestion.type === 'compare') {
      return (
        <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center text-2xl md:text-3xl font-mono text-gray-700 dark:text-gray-200">
                <span>{currentQuestion.left}</span>
                <div className="w-20 h-12 mx-4 border-2 border-dashed border-gray-400 dark:border-gray-500 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-4xl">
                    {answer}
                </div>
                <span>{currentQuestion.right}</span>
            </div>
            <div className="flex space-x-4">
                {['<', '=', '>'].map(op => (
                    <button key={op} onClick={() => setAnswer(op)} className={`w-16 h-16 rounded-full text-3xl font-bold transition ${answer === op ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
                        {op}
                    </button>
                ))}
            </div>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    if (currentQuestion.type === 'compare' && answer) {
        checkAnswer();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer, currentQuestion]);

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <button onClick={() => onComplete(score)} className="mb-4 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition">&larr; Back to Activities</button>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Quick Drill</h1>
        <div className="text-lg font-semibold text-purple-700 dark:text-purple-400">Score: {score}</div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Answer as quickly as you can!</p>
      
      <div className="relative p-6 md:p-10 min-h-[250px] bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center">
        {!feedback && renderQuestion()}
        {feedback === 'correct' && <CheckCircleIcon className="h-24 w-24 text-green-500" />}
        {feedback === 'incorrect' && <XCircleIcon className="h-24 w-24 text-red-500" />}
      </div>

       {currentQuestion.type === 'fill-blank' && (
           <button 
                onClick={checkAnswer} 
                className="w-full mt-6 bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
            >
                Submit
            </button>
       )}
    </div>
  );
};

export default QuickDrill;