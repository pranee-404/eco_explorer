// FIX: Import ReactElement to resolve 'Cannot find namespace JSX' error.
import type { ReactElement } from 'react';

export enum QuestType {
  MATHS_SYLLABUS = "Maths Syllabus",
  ECO_MATHS = "Eco-Maths",
  ECO_ACTION = "Eco Action",
  CANVAS = "Expression Canvas",
  QUICK_DRILL = "Quick Drill"
}

export interface Quest {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  xp: number;
  promptForGemini?: string; // The full word problem text
  correctExpression?: string; // Example correct expression for display
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  // FIX: Use ReactElement for component types.
  icon: ReactElement;
  type: 'math' | 'eco';
}

export enum View {
  HOME = 'home',
  QUEST = 'quest',
  CANVAS = 'canvas',
  DRILL = 'drill',
  QUEST_LIST = 'quest_list'
}

export interface FillBlankQuestion {
    type: 'fill-blank';
    // FIX: The parts for a fill-blank question should be a two-element tuple, not three.
    parts: [string, string];
    answer: string;
}

export interface CompareQuestion {
    type: 'compare';
    left: string;
    right: string;
    answer: '>' | '<' | '=';
}

export type QuickDrillQuestion = FillBlankQuestion | CompareQuestion;