
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { FlashcardQuestion, FlashcardState } from '@/types';

// Sample initial data with different answer formats
const initialQuestions: FlashcardQuestion[] = [
  {
    id: '1',
    question: 'What are the main components of React?',
    answer: (
      <>
        <ul className="list-disc pl-5 mb-3">
          <li>Components</li>
          <li>Props</li>
          <li>State</li>
          <li>Lifecycle methods</li>
        </ul>
      </>
    ),
    known: false
  },
  {
    id: '2',
    question: 'Explain the concept of closures in JavaScript.',
    answer: (
      <>
        <p className="mb-3">
          A closure is the combination of a function bundled together with references to its surrounding state.
        </p>
        <p>
          In JavaScript, closures are created every time a function is created, at function creation time.
        </p>
      </>
    ),
    known: false
  },
  {
    id: '3',
    question: 'What is the difference between let, const, and var in JavaScript?',
    answer: (
      <>
        <p className="mb-3">
          In JavaScript, there are three ways to declare variables:
        </p>
        <ul className="list-disc pl-5 mb-3">
          <li><strong>var</strong>: Function-scoped, can be redeclared, and hoisted</li>
          <li><strong>let</strong>: Block-scoped, cannot be redeclared, but can be reassigned</li>
          <li><strong>const</strong>: Block-scoped, cannot be redeclared or reassigned</li>
        </ul>
        <p>
          Modern JavaScript typically uses let and const instead of var for better scoping and fewer bugs.
        </p>
      </>
    ),
    known: false
  },
  {
    id: '4',
    question: 'Describe the box model in CSS.',
    answer: (
      <>
        <p className="mb-3">
          The CSS box model describes the rectangular boxes that are generated for elements in the document tree and laid out according to the visual formatting model.
        </p>
        <ul className="list-disc pl-5">
          <li><strong>Content</strong>: The inner content of the box</li>
          <li><strong>Padding</strong>: Space between the content and the border</li>
          <li><strong>Border</strong>: A border that goes around the padding</li>
          <li><strong>Margin</strong>: Space outside the border</li>
        </ul>
      </>
    ),
    known: false
  },
  {
    id: '5',
    question: 'What are the advantages of TypeScript over JavaScript?',
    answer: (
      <>
        <ul className="list-disc pl-5">
          <li>Static type-checking</li>
          <li>Better IDE support with autocompletion</li>
          <li>Easier refactoring</li>
          <li>More robust code with fewer runtime errors</li>
          <li>Better documentation through type annotations</li>
        </ul>
      </>
    ),
    known: false
  }
];

// Initial state
const initialState: FlashcardState = {
  questions: initialQuestions,
  selectedQuestionIds: [],
  currentMode: 'database',
  currentQuestionIndex: null
};

// Action types
type FlashcardAction =
  | { type: 'TOGGLE_SELECTED_QUESTION'; id: string }
  | { type: 'SELECT_ALL_UNKNOWN' }
  | { type: 'START_QUIZ' }
  | { type: 'RETURN_TO_DATABASE' }
  | { type: 'MARK_KNOWN'; id: string }
  | { type: 'MARK_UNKNOWN'; id: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'RESET_PROGRESS' };

// Reducer function
const flashcardReducer = (state: FlashcardState, action: FlashcardAction): FlashcardState => {
  switch (action.type) {
    case 'TOGGLE_SELECTED_QUESTION':
      return {
        ...state,
        selectedQuestionIds: state.selectedQuestionIds.includes(action.id)
          ? state.selectedQuestionIds.filter(id => id !== action.id)
          : [...state.selectedQuestionIds, action.id]
      };

    case 'SELECT_ALL_UNKNOWN':
      return {
        ...state,
        selectedQuestionIds: state.questions
          .filter(question => !question.known)
          .map(question => question.id)
      };

    case 'START_QUIZ':
      if (state.selectedQuestionIds.length === 0) {
        // If no questions selected, use all questions
        return {
          ...state,
          currentMode: 'quiz',
          selectedQuestionIds: state.questions.map(q => q.id),
          currentQuestionIndex: 0
        };
      }
      return {
        ...state,
        currentMode: 'quiz',
        currentQuestionIndex: 0
      };

    case 'RETURN_TO_DATABASE':
      return {
        ...state,
        currentMode: 'database',
        currentQuestionIndex: null
      };

    case 'MARK_KNOWN':
      return {
        ...state,
        questions: state.questions.map(question =>
          question.id === action.id
            ? { ...question, known: true }
            : question
        )
      };

    case 'MARK_UNKNOWN':
      return {
        ...state,
        questions: state.questions.map(question =>
          question.id === action.id
            ? { ...question, known: false }
            : question
        )
      };

    case 'NEXT_QUESTION':
      if (state.currentQuestionIndex === null) {
        return state;
      }
      
      const availableQuestions = state.questions.filter(q => 
        state.selectedQuestionIds.includes(q.id)
      );
      
      if (availableQuestions.length === 0) {
        return {
          ...state,
          currentMode: 'database',
          currentQuestionIndex: null
        };
      }
      
      // Get a random question from the selected questions
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      return {
        ...state,
        currentQuestionIndex: randomIndex
      };

    case 'RESET_PROGRESS':
      return {
        ...state,
        questions: state.questions.map(question => ({
          ...question,
          known: false
        }))
      };

    default:
      return state;
  }
};

// Create context
interface FlashcardContextProps {
  state: FlashcardState;
  dispatch: React.Dispatch<FlashcardAction>;
  getCurrentQuestion: () => FlashcardQuestion | null;
}

const FlashcardContext = createContext<FlashcardContextProps | undefined>(undefined);

// Provider component
export const FlashcardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(flashcardReducer, initialState);

  const getCurrentQuestion = (): FlashcardQuestion | null => {
    if (state.currentQuestionIndex === null) return null;
    
    const availableQuestions = state.questions.filter(q => 
      state.selectedQuestionIds.includes(q.id)
    );
    
    if (availableQuestions.length === 0) return null;
    
    return availableQuestions[state.currentQuestionIndex];
  };

  return (
    <FlashcardContext.Provider value={{ state, dispatch, getCurrentQuestion }}>
      {children}
    </FlashcardContext.Provider>
  );
};

// Custom hook
export const useFlashcards = () => {
  const context = useContext(FlashcardContext);
  if (context === undefined) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
};
