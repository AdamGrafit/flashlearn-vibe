
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FlashcardQuestion } from '@/types';
import { useFlashcards } from '@/contexts/FlashcardContext';

interface QuestionCardProps {
  question: FlashcardQuestion;
  isSelected: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, isSelected }) => {
  const { dispatch } = useFlashcards();
  const [showAnswer, setShowAnswer] = useState(false);

  const toggleSelected = () => {
    dispatch({ type: 'TOGGLE_SELECTED_QUESTION', id: question.id });
  };

  return (
    <Card className={`w-full transition-all duration-300 ${
      question.known ? 'border-l-4 border-l-flashcard-known' : 'border-l-4 border-l-flashcard-unknown'
    }`}>
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id={`select-${question.id}`} 
            checked={isSelected}
            onCheckedChange={toggleSelected}
          />
          <div className="flex items-center space-x-2">
            {question.known ? (
              <Check size={16} className="text-flashcard-known" />
            ) : (
              <X size={16} className="text-flashcard-unknown" />
            )}
            <span className={question.known ? 'text-flashcard-known' : 'text-flashcard-unknown'}>
              {question.known ? 'Known' : 'Unknown'}
            </span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowAnswer(!showAnswer)}
        >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <h3 className="text-lg font-semibold mb-2">{question.question}</h3>
        {showAnswer && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            {question.answer}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
