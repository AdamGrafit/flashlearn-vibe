
import { createClient } from '@supabase/supabase-js';
import { FlashcardQuestion } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key must be set in environment variables');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

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
