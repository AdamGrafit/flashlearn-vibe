// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kggfvmnwaoxoxpomqzpi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZ2Z2bW53YW94b3hwb21xenBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MDU5NDgsImV4cCI6MjA1NzM4MTk0OH0.aleZLYnixctO1CXGrimvbSQ8M8YKqfQ7IDh9c01HjlU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);