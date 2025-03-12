
import React from 'react';
import { FlashcardProvider, useFlashcards } from '@/contexts/FlashcardContext';
import QuestionDatabase from '@/components/QuestionDatabase';
import Quiz from '@/components/Quiz';

const FlashcardApp: React.FC = () => {
  const { state } = useFlashcards();
  
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
