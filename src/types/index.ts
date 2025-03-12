
export interface FlashcardQuestion {
  id: string;
  question: string;
  answer: string;
  known: boolean;
}

export type AnswerFormat = 'list' | 'paragraph' | 'mixed';

export interface FlashcardState {
  questions: FlashcardQuestion[];
  selectedQuestionIds: string[];
  currentMode: 'database' | 'quiz';
  currentQuestionIndex: number | null;
}
