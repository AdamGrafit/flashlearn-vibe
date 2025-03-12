
import { supabase, SupabaseFlashcard, convertToFlashcardQuestion, isSupabaseConfigured, getMockFlashcards } from '@/lib/supabase';
import { FlashcardQuestion } from '@/types';

const TABLE_NAME = 'NikolaMagisterTable';

export const fetchFlashcards = async (): Promise<FlashcardQuestion[]> => {
  // If Supabase is not configured, return mock data
  if (!isSupabaseConfigured) {
    // Simulate network delay for consistency
    await new Promise(resolve => setTimeout(resolve, 500));
    return getMockFlashcards();
  }

  const { data, error } = await supabase!
    .from(TABLE_NAME)
    .select('*');

  if (error) {
    console.error('Error fetching flashcards:', error);
    throw error;
  }

  return (data as SupabaseFlashcard[]).map(convertToFlashcardQuestion);
};

export const updateFlashcardKnownStatus = async (id: string, known: boolean): Promise<void> => {
  // If Supabase is not configured, just log the action
  if (!isSupabaseConfigured) {
    console.log(`Mock update: Flashcard ${id} marked as ${known ? 'known' : 'unknown'}`);
    return;
  }

  const { error } = await supabase!
    .from(TABLE_NAME)
    .update({ known })
    .eq('id', id);

  if (error) {
    console.error('Error updating flashcard:', error);
    throw error;
  }
};

export const resetAllFlashcardsKnownStatus = async (): Promise<void> => {
  // If Supabase is not configured, just log the action
  if (!isSupabaseConfigured) {
    console.log('Mock reset: All flashcards reset to unknown');
    return;
  }

  const { error } = await supabase!
    .from(TABLE_NAME)
    .update({ known: false })
    .neq('id', ''); // Update all records

  if (error) {
    console.error('Error resetting flashcards:', error);
    throw error;
  }
};
