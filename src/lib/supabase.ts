
import { createClient } from '@supabase/supabase-js';
import { FlashcardQuestion } from '@/types';

// Use direct values instead of environment variables
const supabaseUrl = 'https://kggfvmnwaoxoxpomqzpi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZ2Z2bW53YW94b3hwb21xenBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MDU5NDgsImV4cCI6MjA1NzM4MTk0OH0.aleZLYnixctO1CXGrimvbSQ8M8YKqfQ7IDh9c01HjlU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseFlashcard {
  id: string;
  question: string;
  answer: string;
  known: boolean;
}

export const convertToFlashcardQuestion = (card: SupabaseFlashcard): FlashcardQuestion => {
  return {
    id: card.id,
    question: card.question,
    answer: card.answer,
    known: card.known
  };
};
