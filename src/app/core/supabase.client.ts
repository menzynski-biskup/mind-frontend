// src/app/core/supabase.client.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env['NG_APP_SUPABASE_URL'] as string;
const supabaseAnonKey = import.meta.env['NG_APP_SUPABASE_ANON_KEY'] as string;

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);