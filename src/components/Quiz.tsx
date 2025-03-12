
import React, { useState } from 'react';
import { ArrowLeft, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useFlashcards } from '@/contexts/FlashcardContext';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const Quiz: React.FC = () => {
  const { state, dispatch, getCurrentQuestion } = useFlashcards();
  const { toast } = useToast();
  const [showAnswer, setShowAnswer] = useState(false);
  
  const currentQuestion = getCurrentQuestion();
  
  const handleReturnToDatabase = () => {
    dispatch({ type: 'RETURN_TO_DATABASE' });
  };
  
  const handleShowAnswer = () => {
    setShowAnswer(true);
  };
  
  const handleMarkKnown = () => {
    if (!currentQuestion) return;
    
    dispatch({ type: 'MARK_KNOWN', id: currentQuestion.id });
    toast({
      title: "Marked as known",
      description: "Great job! You've mastered this flashcard.",
      variant: "default",
    });
    handleNextQuestion();
  };
  
  const handleMarkUnknown = () => {
    if (!currentQuestion) return;
    
    dispatch({ type: 'MARK_UNKNOWN', id: currentQuestion.id });
    toast({
      title: "Marked as unknown",
      description: "Don't worry, you'll get it next time!",
      variant: "default",
    });
    handleNextQuestion();
  };
  
  const handleNextQuestion = () => {
    setShowAnswer(false);
    dispatch({ type: 'NEXT_QUESTION' });
  };
  
  if (!currentQuestion) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="text-center p-12">
          <h2 className="text-2xl font-bold mb-4">No questions available</h2>
          <p className="text-muted-foreground mb-6">
            Please return to the database and select some questions to practice.
          </p>
          <Button onClick={handleReturnToDatabase}>
            <ArrowLeft size={16} className="mr-2" />
            Return to Question Database
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={handleReturnToDatabase}
          className="mr-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Database
        </Button>
        <h1 className="text-3xl font-bold text-flashcard-primary">Quiz Mode</h1>
      </div>
      
      <Card className="w-full mb-6 shadow-md">
        <CardHeader className="p-6 pb-0">
          <h2 className="text-2xl font-semibold">{currentQuestion.question}</h2>
        </CardHeader>
        
        <CardContent className="p-6">
          {showAnswer ? (
            <div 
              className="bg-muted p-4 rounded-md mt-4"
              dangerouslySetInnerHTML={{ __html: currentQuestion.answer }}
            />
          ) : (
            <div className="flex justify-center p-10">
              <Button 
                className="bg-flashcard-primary hover:bg-flashcard-primary/90 text-white"
                onClick={handleShowAnswer}
              >
                <Eye size={16} className="mr-2" />
                Show Answer
              </Button>
            </div>
          )}
        </CardContent>
        
        {showAnswer && (
          <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 p-6 pt-0">
            <Button 
              className="w-full sm:w-auto bg-flashcard-known hover:bg-flashcard-known/90 text-white"
              onClick={handleMarkKnown}
            >
              <ThumbsUp size={16} className="mr-2" />
              I Know This Question
            </Button>
            <Button 
              variant="outline"
              className="w-full sm:w-auto border-flashcard-unknown text-flashcard-unknown hover:bg-flashcard-unknown/10"
              onClick={handleMarkUnknown}
            >
              <ThumbsDown size={16} className="mr-2" />
              I Don't Know This Question
            </Button>
          </CardFooter>
        )}
      </Card>
      
      <div className="bg-card rounded-lg p-4 mb-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">Status:</span>{' '}
          {currentQuestion.known ? (
            <span className="text-flashcard-known">Known</span>
          ) : (
            <span className="text-flashcard-unknown">Unknown</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default Quiz;
