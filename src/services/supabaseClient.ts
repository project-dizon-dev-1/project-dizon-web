import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';


const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase URL or anon key is missing!');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
