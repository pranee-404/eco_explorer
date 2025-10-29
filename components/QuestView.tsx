import React, { useState, useCallback } from 'react';
import type { Quest } from '../types';
import { validateMathExpression } from '../services/geminiService';
import { CheckCircleIcon, LightbulbIcon, XCircleIcon } from './icons';

interface QuestViewProps {
  quest: Quest;
  onComplete: (xp: number) => void;
  onBack: () => void;
}

const QuestView: React.FC<QuestViewProps> = ({ quest, onComplete, onBack }) => {
  const [expression, setExpression] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expression.trim() || !quest.promptForGemini) return;

    setIsLoading(true);
    setFeedback('');
    setIsCorrect(null);

    const result = await validateMathExpression(quest.promptForGemini, expression);
    
    if (result.toLowerCase().includes('correct')) {
      setIsCorrect(true);
      setFeedback("That's correct! Well done. You've earned " + quest.xp + " XP.");
      setTimeout(() => {
        onComplete(quest.xp);
      }, 2000);
    } else {
      setIsCorrect(false);
      setFeedback(result);
    }
    
    setIsLoading(false);
  }, [expression, quest, onComplete]);

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <button onClick={onBack} className="mb-4 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition">&larr; Back to Story Challenges</button>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{quest.title}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{quest.description}</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="expression" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Expression:</label>
          <input
            type="text"
            id="expression"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            placeholder="e.g., 100 - (15 + 56)"
            disabled={isCorrect === true}
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading || isCorrect === true}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition flex items-center justify-center"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Check Answer'}
        </button>
      </form>
      
      {feedback && (
        <div className={`mt-6 p-4 rounded-lg flex items-start space-x-3 ${isCorrect ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-200' : 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-200'}`}>
          {isCorrect ? <CheckCircleIcon className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" /> : <LightbulbIcon />}
          <div className="flex-1">
            <h3 className="font-bold">{isCorrect ? 'Success!' : 'AI Feedback'}</h3>
            <p>{feedback}</p>
            {!isCorrect && quest.correctExpression && (
                <p className="mt-2 text-sm">Example of a correct expression: <code className="bg-yellow-200 dark:bg-yellow-400/30 p-1 rounded">{quest.correctExpression}</code></p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestView;