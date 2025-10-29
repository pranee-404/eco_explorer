import React, { useState, useCallback, useEffect } from 'react';
import { ALL_QUESTS } from './constants';
import type { Quest } from './types';
import { QuestType, View } from './types';
import QuestView from './components/QuestView';
import EcoActionQuest from './components/EcoActionQuest';
import ExpressionCanvas from './components/ExpressionCanvas';
import QuickDrill from './components/QuickDrill';
import WordProblemsListView from './components/WordProblemsListView';
import Card from './components/Card';
import { MathIcon, EcoIcon, BrainIcon, BoltIcon } from './components/icons';
import { watchUser, addXp, watchTotalXp, type User } from './services/xpService';
import XpBar from './components/XpBar';

const App: React.FC = () => {
  const [xp, setXp] = useState(0);
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Effect to watch for authentication state and sign in user anonymously.
  useEffect(() => {
    const unsubscribe = watchUser(setUser);
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Effect to watch for real-time XP updates from Firestore for the current user.
  // This is the React equivalent of a StreamBuilder.
  useEffect(() => {
    if (user) {
      const unsubscribe = watchTotalXp(user.uid, setXp);
      return () => unsubscribe(); // Cleanup listener on unmount or user change
    }
  }, [user]);

  const handleQuestSelection = useCallback((quest: Quest) => {
    setActiveQuest(quest);
    setCurrentView(View.QUEST);
  }, []);

  const handleComplete = useCallback((earnedXp: number) => {
    // This is the write-through call to Firestore, equivalent to XpService.addXp().
    if (user) {
      addXp(user.uid, earnedXp);
    }
    // The onSnapshot listener will update the local 'xp' state automatically.
    setCurrentView(View.HOME);
    setActiveQuest(null);
  }, [user]);

  const handleBack = useCallback(() => {
    setCurrentView(View.HOME);
    setActiveQuest(null);
  }, []);

  const handleBackToQuestList = useCallback(() => {
    setCurrentView(View.QUEST_LIST);
    setActiveQuest(null);
  }, []);
  
  const renderHome = () => (
    <div className="p-4 md:p-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100">Eco-Maths Expression Explorer</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Learn maths, save the planet!</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* Expression Canvas */}
        <Card onClick={() => setCurrentView(View.CANVAS)}>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3 text-white">
                <BrainIcon />
              </div>
              <div className="ml-4">
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">Expression Canvas</p>
                <p className="text-gray-500 dark:text-gray-400">Interactive learning</p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Quick Drill */}
        <Card onClick={() => setCurrentView(View.DRILL)}>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3 text-white">
                <BoltIcon />
              </div>
              <div className="ml-4">
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">Quick Drills</p>
                <p className="text-gray-500 dark:text-gray-400">Fast-paced quizzes</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Story Challenges */}
        <Card onClick={() => setCurrentView(View.QUEST_LIST)}>
            <div className="p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3 text-white">
                        <MathIcon />
                    </div>
                    <div className="ml-4">
                        <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">Story Challenges</p>
                        <p className="text-gray-500 dark:text-gray-400">Word problems</p>
                    </div>
                </div>
            </div>
        </Card>

        {/* Eco Action Quests */}
        {ALL_QUESTS.filter(q => q.type === QuestType.ECO_ACTION).map(quest => (
          <Card key={quest.id} onClick={() => handleQuestSelection(quest)}>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-teal-500 rounded-md p-3 text-white"><EcoIcon /></div>
                <div className="ml-4">
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{quest.title}</p>
                   <p className="text-gray-500 dark:text-gray-400">{quest.type}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case View.QUEST_LIST: {
        const wordProblemQuests = ALL_QUESTS.filter(q => 
            q.type === QuestType.MATHS_SYLLABUS || q.type === QuestType.ECO_MATHS
        );
        return <WordProblemsListView 
            quests={wordProblemQuests}
            onQuestSelect={handleQuestSelection}
            onBack={handleBack}
        />;
      }
      case View.QUEST:
        if (activeQuest?.type === QuestType.ECO_ACTION) {
          return <EcoActionQuest quest={activeQuest} onComplete={handleComplete} onBack={handleBack} />;
        }
        return <QuestView quest={activeQuest!} onComplete={handleComplete} onBack={handleBackToQuestList} />;
      case View.CANVAS:
        return <ExpressionCanvas onBack={handleBack} />;
      case View.DRILL:
        return <QuickDrill onComplete={handleComplete} onBack={handleBack} />;
      case View.HOME:
      default:
        return renderHome();
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <header className="fixed top-0 left-0 right-0 z-10 py-4 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md">
        <XpBar currentXp={xp} />
      </header>
      <div className="pt-20">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;