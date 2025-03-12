
import React from 'react';
import { FlashcardProvider, useFlashcards } from '@/contexts/FlashcardContext';
import QuestionDatabase from '@/components/QuestionDatabase';
import Quiz from '@/components/Quiz';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isSupabaseConfigured } from '@/lib/supabase';

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
      {!isSupabaseConfigured && (
        <Alert variant="warning" className="m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Supabase Not Configured</AlertTitle>
          <AlertDescription>
            You are running in demo mode with mock data. To connect to your Supabase database, 
            please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.
          </AlertDescription>
        </Alert>
      )}
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
