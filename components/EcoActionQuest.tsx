import React, { useState, useCallback, useRef } from 'react';
import type { Quest } from '../types';
import { validateEcoImage } from '../services/geminiService';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface EcoActionQuestProps {
  quest: Quest;
  onComplete: (xp: number) => void;
  onBack: () => void;
}

const fileToBas64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

const EcoActionQuest: React.FC<EcoActionQuestProps> = ({ quest, onComplete, onBack }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            setIsCorrect(null);
            setFeedback('');
        }
    };

    const handleSubmit = useCallback(async () => {
        if (!selectedFile || !quest.promptForGemini) return;

        setIsLoading(true);
        setFeedback('');
        setIsCorrect(null);

        const imageBase64 = await fileToBas64(selectedFile);
        const result = await validateEcoImage(quest.promptForGemini, imageBase64, selectedFile.type);

        if (result.toLowerCase().includes('yes')) {
            setIsCorrect(true);
            setFeedback("Great job! Segregation confirmed. You've earned " + quest.xp + " XP.");
            setTimeout(() => {
                onComplete(quest.xp);
            }, 2000);
        } else {
            setIsCorrect(false);
            setFeedback("The AI couldn't confirm waste segregation. Make sure you have two distinct bins/piles for wet and dry waste and try again!");
        }

        setIsLoading(false);
    }, [selectedFile, quest, onComplete]);

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto">
            <button onClick={onBack} className="mb-4 text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 transition">&larr; Back to Activities</button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{quest.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{quest.description}</p>
            
            <div className="space-y-4">
                <div 
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-teal-500 dark:hover:border-teal-400 transition"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    {preview ? (
                        <img src={preview} alt="Preview" className="max-h-60 mx-auto rounded-lg" />
                    ) : (
                        <div>
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Click to upload an image</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    )}
                </div>
                
                <button 
                  onClick={handleSubmit} 
                  disabled={isLoading || !selectedFile || isCorrect === true}
                  className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition flex items-center justify-center"
                >
                  {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : 'Validate Image'}
                </button>
            </div>

            {feedback && (
              <div className={`mt-6 p-4 rounded-lg flex items-center space-x-3 ${isCorrect ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-200'}`}>
                {isCorrect ? <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0" /> : <XCircleIcon className="h-6 w-6 text-red-500 flex-shrink-0" />}
                <p>{feedback}</p>
              </div>
            )}
        </div>
    );
};

export default EcoActionQuest;
