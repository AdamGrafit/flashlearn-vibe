import React from 'react';
import { Play, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useFlashcards } from '@/contexts/FlashcardContext';
import QuestionCard from './QuestionCard';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const QuestionDatabase: React.FC = () => {
  const { state, dispatch, isLoading, error } = useFlashcards();
  const { toast } = useToast();

  const handleStartQuiz = () => {
    if (state.selectedQuestionIds.length === 0) {
      toast({
        title: "No questions selected",
        description: "Using all questions instead.",
        variant: "default",
      });
    }
    dispatch({ type: 'START_QUIZ' });
  };

  const handleSelectUnknown = () => {
    dispatch({ type: 'SELECT_ALL_UNKNOWN' });
    toast({
      title: "Selected all unknown questions",
      description: `${state.questions.filter(q => !q.known).length} questions selected.`,
      variant: "default",
    });
  };

  const handleResetProgress = () => {
    dispatch({ type: 'RESET_PROGRESS' });
    toast({
      title: "Progress reset",
      description: "All questions marked as unknown.",
      variant: "default",
    });
  };

  const knownCount = state.questions.filter(q => q.known).length;
  const totalCount = state.questions.length;
  const progressPercentage = totalCount > 0 ? Math.round((knownCount / totalCount) * 100) : 0;

  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Error Loading Flashcards</h2>
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-flashcard-primary">Question Database</h1>
          <p className="text-muted-foreground mb-4">
            Select questions to practice or review all your flashcards.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleStartQuiz}
            className="bg-flashcard-primary hover:bg-flashcard-primary/90"
            disabled={isLoading}
          >
            <Play size={16} className="mr-2" />
            Play with selected questions
          </Button>
          <Button 
            onClick={handleSelectUnknown}
            variant="outline"
            className="border-flashcard-unknown text-flashcard-unknown hover:bg-flashcard-unknown/10"
            disabled={isLoading}
          >
            <BookOpen size={16} className="mr-2" />
            Play only with unknown questions
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
          <div>
            <h2 className="text-xl font-semibold">Your Progress</h2>
            {isLoading ? (
              <Skeleton className="h-4 w-48 mt-2" />
            ) : (
              <p className="text-muted-foreground">
                {knownCount} of {totalCount} questions mastered ({progressPercentage}%)
              </p>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleResetProgress}
            className="text-destructive hover:text-destructive/90 mt-2 sm:mt-0"
            disabled={isLoading}
          >
            Reset Progress
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader className="p-4">
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {state.questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              isSelected={state.selectedQuestionIds.includes(question.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionDatabase;
