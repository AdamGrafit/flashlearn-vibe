import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { FlashcardQuestion, FlashcardState } from '@/types';
import { fetchFlashcards, updateFlashcardKnownStatus, resetAllFlashcardsKnownStatus } from '@/services/flashcardService';
import { useToast } from '@/hooks/use-toast';

// Initial empty state
const initialState: FlashcardState = {
  questions: [],
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
  | { type: 'RESET_PROGRESS' }
  | { type: 'SET_QUESTIONS'; questions: FlashcardQuestion[] }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_ERROR'; error: string | null };

// Reducer function
const flashcardReducer = (state: FlashcardState, action: FlashcardAction): FlashcardState => {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return {
        ...state,
        questions: action.questions,
      };
      
    case 'SET_LOADING':
    case 'SET_ERROR':
      return state; // These actions will be handled by the FlashcardProvider
      
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
  isLoading: boolean;
  error: string | null;
}

const FlashcardContext = createContext<FlashcardContextProps | undefined>(undefined);

// Provider component
export const FlashcardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(flashcardReducer, initialState);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  // Fetch questions from Supabase when the component mounts
  useEffect(() => {
    const loadFlashcards = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const questions = await fetchFlashcards();
        dispatch({ type: 'SET_QUESTIONS', questions });
      } catch (err) {
        console.error('Failed to fetch flashcards:', err);
        setError('Failed to load flashcards. Please try again later.');
        toast({
          title: "Error loading flashcards",
          description: "Could not connect to the database. Please check your connection.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFlashcards();
  }, [toast]);

  // Handle marking questions as known/unknown with Supabase
  const originalDispatch = dispatch;
  const wrappedDispatch: React.Dispatch<FlashcardAction> = async (action) => {
    originalDispatch(action);

    if (action.type === 'MARK_KNOWN' || action.type === 'MARK_UNKNOWN') {
      try {
        await updateFlashcardKnownStatus(
          action.id,
          action.type === 'MARK_KNOWN'
        );
      } catch (err) {
        console.error('Failed to update flashcard status:', err);
        toast({
          title: "Error saving progress",
          description: "Could not update the flashcard status. Please try again.",
          variant: "destructive",
        });
      }
    }

    if (action.type === 'RESET_PROGRESS') {
      try {
        await resetAllFlashcardsKnownStatus();
      } catch (err) {
        console.error('Failed to reset flashcard progress:', err);
        toast({
          title: "Error resetting progress",
          description: "Could not reset the flashcards. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const getCurrentQuestion = (): FlashcardQuestion | null => {
    if (state.currentQuestionIndex === null) return null;
    
    const availableQuestions = state.questions.filter(q => 
      state.selectedQuestionIds.includes(q.id)
    );
    
    if (availableQuestions.length === 0) return null;
    
    return availableQuestions[state.currentQuestionIndex];
  };

  return (
    <FlashcardContext.Provider value={{ 
      state, 
      dispatch: wrappedDispatch, 
      getCurrentQuestion,
      isLoading,
      error
    }}>
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
