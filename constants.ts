

import type { Quest, QuickDrillQuestion } from './types';
import { QuestType } from './types';

export const ALL_QUESTS: Quest[] = [
  {
    id: 'math-1',
    type: QuestType.MATHS_SYLLABUS,
    title: "Irfan's Change",
    description: "Irfan bought biscuits for ₹15 and toor dal for ₹56. He gave the shopkeeper ₹100. Write an expression for the change he gets back.",
    xp: 50,
    promptForGemini: "A student needs to write a mathematical expression for this problem: 'Irfan bought a pack of biscuits for ₹15 and a packet of toor dal for ₹56. He gave the shopkeeper ₹100. Calculate the change Irfan will get back.' The student wrote: {STUDENT_EXPRESSION}. Is this expression mathematically correct to solve the problem? Explain the error in one simple sentence based on order of operations if it's wrong.",
    correctExpression: "100 - (15 + 56)"
  },
  {
    id: 'math-2',
    type: QuestType.MATHS_SYLLABUS,
    title: "Royal Coins",
    description: "Queen Alia gave 100 gold coins each to Princess Elsa and Princess Anna. Elsa doubled her coins through business. Anna has only half of her coins left after buying jewellery. Write an expression for how many coins they have together.",
    xp: 75,
    promptForGemini: "A student needs to write an expression for this problem: 'Princess Elsa started with 100 coins and doubled them. Princess Anna started with 100 coins and has half left. How many do they have in total?' The student wrote: {STUDENT_EXPRESSION}. Is this expression correct? If not, explain the error in one simple sentence.",
    correctExpression: "(100 * 2) + (100 / 2)"
  },
  {
    id: 'eco-1',
    type: QuestType.ECO_MATHS,
    title: "Bottle Savers",
    description: "A school of 45 students decides to stop using plastic bottles. Each student used 2 bottles a day. The school runs 5 days a week. Write an expression using brackets for the total bottles saved by the whole school in one week.",
    xp: 75,
    promptForGemini: "A student needs to write an expression for this problem: '45 students each used 2 plastic bottles a day for 5 days. Calculate the total bottles used.' The student wrote: {STUDENT_EXPRESSION}. Is this expression correct for the problem? If not, explain the error in one simple sentence.",
    correctExpression: "(45 * 2) * 5"
  },
  {
    id: 'eco-3',
    type: QuestType.ECO_MATHS,
    title: "Reforestation Drive",
    description: "An environmental club has 5 volunteers. Each volunteer plants 12 trees in the morning and 8 trees in the afternoon. Write a single expression to find the total number of trees planted by the club in one day.",
    xp: 80,
    promptForGemini: "A student needs to solve: '5 volunteers each plant 12 trees in the morning and 8 in the afternoon. What's the total number of trees planted?' The student wrote: {STUDENT_EXPRESSION}. Is this expression correct? Explain any error in one simple sentence.",
    correctExpression: "5 * (12 + 8)"
  },
  {
    id: 'eco-4',
    type: QuestType.ECO_MATHS,
    title: "Power Savers",
    description: "A household replaces 4 old bulbs, each consuming 60 watts, with LED bulbs that use only 10 watts each. Write an expression to calculate the total watts saved per hour.",
    xp: 85,
    promptForGemini: "A student needs to solve: 'Calculate the total power saved when four 60-watt bulbs are replaced by four 10-watt bulbs.' The student wrote: {STUDENT_EXPRESSION}. Is this expression correct? Explain any error in one simple sentence.",
    correctExpression: "4 * (60 - 10)"
  },
  {
    id: 'math-3',
    type: QuestType.MATHS_SYLLABUS,
    title: "Community Cleanup",
    description: "During a cleanup drive, Team A collected 150 kg of waste. Team B collected 25 kg more than Team A. Team C collected half the amount of Team B. Write an expression for the total waste collected by all three teams.",
    xp: 100,
    promptForGemini: "A student needs to solve: 'Team A collected 150 kg. Team B collected 150 + 25 kg. Team C collected half of Team B's amount. What's the total?' The student wrote: {STUDENT_EXPRESSION}. Is this expression correct? Explain any error in one simple sentence.",
    correctExpression: "150 + (150 + 25) + ((150 + 25) / 2)"
  },
  {
    id: 'eco-2',
    type: QuestType.ECO_ACTION,
    title: "Waste Segregation Audit",
    description: "For one day, separate your household waste into 'wet' (food scraps, etc.) and 'dry' (plastic, paper, etc.) bins. Take a photo of your two segregated bins and upload it for validation.",
    xp: 100,
    promptForGemini: "Does this image show two separate containers or distinct piles, one clearly for wet waste (like food scraps) and one for dry waste (like plastic, paper, or metal)? Answer with only 'yes' or 'no'.",
  },
];


export const DRILL_QUESTIONS: QuickDrillQuestion[] = [
    { type: 'fill-blank', parts: ['13 + 4 = ', ' + 6'], answer: '11' },
    { type: 'compare', left: '245 + 289', right: '246 + 285', answer: '<' },
    { type: 'fill-blank', parts: ['34 - ', ' = 25'], answer: '9' },
    { type: 'compare', left: '273 - 145', right: '272 - 144', answer: '=' },
    { type: 'compare', left: '364 + 587', right: '363 + 589', answer: '>' },
    { type: 'fill-blank', parts: ['8 * ', ' = 64 / 2'], answer: '4' },
];