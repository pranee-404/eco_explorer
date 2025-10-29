import React, { useState, useMemo, useEffect } from 'react';
import Card from './Card';

interface ExpressionCanvasProps {
  onBack: () => void;
}

// A simple, safe evaluator for arithmetic expressions.
const safeEvaluate = (expr: string): number | string => {
  try {
    // Basic validation to prevent unsafe evaluation
    if (/[^0-9+\-*/().\s]/.test(expr)) {
      return "Invalid characters";
    }
    
    // For safety, replace direct eval with a Function constructor,
    // which doesn't have access to the outer scope.
    return new Function(`return ${expr}`)();
  } catch (error) {
    return "Error";
  }
};

const EXPRESSION_EXAMPLES = [
  {
    expression: '30 + 5 * 4',
    description: "Rule: Multiplication is done before addition.",
    mistake: "Common Mistake: (30 + 5) * 4 = 140. (Adding before multiplying)"
  },
  {
    expression: '(30 + 5) * 4',
    description: "Rule: Operations inside brackets are performed first.",
    mistake: "Common Mistake: 30 + 5 * 4 = 50. (Ignoring the brackets)"
  },
  {
    expression: '100 - 50 / 5',
    description: "Rule: Division is performed before subtraction.",
    mistake: "Common Mistake: (100 - 50) / 5 = 10. (Subtracting before dividing)"
  },
  {
    expression: '100 / 10 * 2',
    description: "Rule: For operators with the same priority (like / and *), work from left to right.",
    mistake: "Common Mistake: 100 / (10 * 2) = 5. (Working from right to left)"
  },
  {
    expression: '7 * (8 - 3)',
    description: "Rule: The calculation inside the brackets is completed before multiplication.",
    mistake: "Common Mistake: 7 * 8 - 3 = 53. (Ignoring the brackets)"
  }
];


const ExpressionCanvas: React.FC<ExpressionCanvasProps> = ({ onBack }) => {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [expression, setExpression] = useState(EXPRESSION_EXAMPLES[0].expression);

  // Update expression when the exampleIndex changes via buttons
  useEffect(() => {
    setExpression(EXPRESSION_EXAMPLES[exampleIndex].expression);
  }, [exampleIndex]);

  const { result, terms, mistakeResult, description } = useMemo(() => {
    const calculatedResult = safeEvaluate(expression);
    
    // Simplified term identification: split by + or - not inside parentheses.
    const identifiedTerms = expression.split(/(\s*[+-]\s*)/).filter(Boolean);

    // Find if the current expression is one of the examples to show its metadata
    const currentExample = EXPRESSION_EXAMPLES.find(ex => ex.expression.replace(/\s/g, '') === expression.replace(/\s/g, ''));
    
    return { 
      result: calculatedResult, 
      terms: identifiedTerms, 
      mistakeResult: currentExample ? currentExample.mistake : '', 
      description: currentExample ? currentExample.description : "You can also type your own custom expression!"
    };
  }, [expression]);

  const handlePrev = () => {
    setExampleIndex((prev) => (prev - 1 + EXPRESSION_EXAMPLES.length) % EXPRESSION_EXAMPLES.length);
  };
  
  const handleNext = () => {
    setExampleIndex((prev) => (prev + 1) % EXPRESSION_EXAMPLES.length);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition">&larr; Back to Activities</button>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Expression Canvas</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Explore different expressions to understand the order of operations (BODMAS/PEMDAS).</p>
      
      <Card className="p-6">
        <div className="space-y-4">
            <div className="flex justify-between items-center pb-2">
                <button 
                    onClick={handlePrev}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    aria-label="Previous expression"
                >
                    &larr; Previous
                </button>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center" aria-live="polite">
                    Example {exampleIndex + 1} / {EXPRESSION_EXAMPLES.length}
                </span>
                <button 
                    onClick={handleNext}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    aria-label="Next expression"
                >
                    Next &rarr;
                </button>
            </div>
            
          <label htmlFor="expression-input" className="sr-only">Enter your expression:</label>
          <input
            id="expression-input"
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            className="w-full px-4 py-3 text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-center"
          />
          
          <div className="text-center text-gray-600 dark:text-gray-400 italic min-h-[2rem] flex items-center justify-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded-md">
            <p>{description}</p>
          </div>

          <div className="pt-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Terms Identified:</h3>
            <div className="flex flex-wrap gap-2 mt-2 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
              {terms.map((term, index) => (
                <span 
                  key={index} 
                  className={`px-3 py-1 rounded-md text-lg font-mono transition-colors duration-300 ${/^[+-]$/.test(term.trim()) ? 'text-gray-500 dark:text-gray-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200 border border-blue-200 dark:border-blue-500/30'}`}
                >
                  {term.trim()}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Terms are parts of an expression separated by '+' or '-' signs. Multiplications and divisions are evaluated within their terms first.</p>
          </div>

          <div className="pt-4 space-y-3">
             <div className="p-4 bg-green-100 dark:bg-green-500/20 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-200">Correct Evaluation:</h3>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100 font-mono mt-1">{expression} = {result}</p>
             </div>
             {mistakeResult && (
                <div className="p-4 bg-red-100 dark:bg-red-500/20 rounded-lg">
                    <h3 className="font-semibold text-red-800 dark:text-red-200">Watch Out!</h3>
                    <p className="text-lg text-red-900 dark:text-red-100 font-mono mt-1">{mistakeResult}</p>
                </div>
             )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExpressionCanvas;