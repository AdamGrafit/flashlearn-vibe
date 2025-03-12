
import { supabase, SupabaseFlashcard, convertToFlashcardQuestion } from '@/lib/supabase';
import { FlashcardQuestion } from '@/types';

const TABLE_NAME = 'NikolaMagisterTable';

export const fetchFlashcards = async (): Promise<FlashcardQuestion[]> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*');

  if (error) {
    console.error('Error fetching flashcards:', error);
    throw error;
  }

  return (data as SupabaseFlashcard[]).map(convertToFlashcardQuestion);
};

export const updateFlashcardKnownStatus = async (id: string, known: boolean): Promise<void> => {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ known })
    .eq('id', id);

  if (error) {
    console.error('Error updating flashcard:', error);
    throw error;
  }
};

export const resetAllFlashcardsKnownStatus = async (): Promise<void> => {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ known: false })
    .neq('id', ''); // Update all records

  if (error) {
    console.error('Error resetting flashcards:', error);
    throw error;
  }
};
