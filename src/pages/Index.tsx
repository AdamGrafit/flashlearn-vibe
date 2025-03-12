
import React from 'react';
import { FlashcardProvider, useFlashcards } from '@/contexts/FlashcardContext';
import QuestionDatabase from '@/components/QuestionDatabase';
import Quiz from '@/components/Quiz';
import { Loader2 } from 'lucide-react';

const FlashcardApp: React.FC = () => {
  const { state, isLoading } = useFlashcards();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-flashcard-primary" />
          <p className="mt-4 text-lg text-muted-foreground">Loading flashcards...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      {state.currentMode === 'database' ? <QuestionDatabase /> : <Quiz />}
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <FlashcardProvider>
      <FlashcardApp />
    </FlashcardProvider>
  );
};

export default Index;
