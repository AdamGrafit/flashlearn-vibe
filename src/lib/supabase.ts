
import { createClient } from '@supabase/supabase-js';
import { FlashcardQuestion } from '@/types';
import React from 'react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Flag to track if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn('Supabase URL and Anon Key not set. Using mock data mode.');
}

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl || '', supabaseAnonKey || '')
  : null;

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
    // We'll create the React element in a proper TSX file instead
    answer: card.answer,
    known: card.known
  };
};

// Sample data for when Supabase is not configured
export const getMockFlashcards = (): FlashcardQuestion[] => [
  {
    id: '1',
    question: 'What is React?',
    answer: 'React is a JavaScript library for building user interfaces.',
    known: false
  },
  {
    id: '2',
    question: 'What is JSX?',
    answer: 'JSX is a syntax extension for JavaScript that looks similar to HTML and allows us to write HTML in React.',
    known: false
  },
  {
    id: '3',
    question: 'What is a component in React?',
    answer: 'A component is a reusable piece of code that returns a React element to be rendered to the page.',
    known: true
  }
];
