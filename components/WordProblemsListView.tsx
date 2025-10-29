import React from 'react';
import type { Quest } from '../types';
import { QuestType } from '../types';
import Card from './Card';
import { MathIcon, EcoIcon } from './icons';

interface WordProblemsListViewProps {
  quests: Quest[];
  onQuestSelect: (quest: Quest) => void;
  onBack: () => void;
}

const getIconForQuest = (quest: Quest) => {
    switch(quest.type) {
        case QuestType.MATHS_SYLLABUS:
            return <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3 text-white"><MathIcon /></div>;
        case QuestType.ECO_MATHS:
            return <div className="flex-shrink-0 bg-teal-500 rounded-md p-3 text-white"><EcoIcon /></div>;
        default:
            return null;
    }
}

const WordProblemsListView: React.FC<WordProblemsListViewProps> = ({ quests, onQuestSelect, onBack }) => {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-4 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition">&larr; Back to Activities</button>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Story Challenges</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Select a word problem to solve and earn XP!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quests.map(quest => (
          <Card key={quest.id} onClick={() => onQuestSelect(quest)}>
            <div className="p-6">
              <div className="flex items-center">
                {getIconForQuest(quest)}
                <div className="ml-4">
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{quest.title}</p>
                   <p className="text-sm text-gray-500 dark:text-gray-400">{quest.type}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WordProblemsListView;