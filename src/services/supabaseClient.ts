import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  throw new Error("Supabase URL is missing!");
}
if (!SUPABASE_ANON_KEY) {
  throw new Error("Supabase Anon is missing!");
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
