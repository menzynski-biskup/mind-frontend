// src/app/core/supabase.client.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environment';

// Read Vite-style env vars (exposed on the client).
// Netlify + Vite require client-visible vars to be prefixed with `VITE_`.
// We now rely only on `VITE_*` names.

const supabaseUrl = environment.VITE_SUPABASE_URL
const supabaseAnonKey = environment.VITE_SUPABASE_ANON_KEY 

// Avoid throwing during module import (which breaks the whole app at runtime
// if environment variables are missing, e.g. in Netlify Deploy Previews).
// Instead, export a working Supabase client when vars exist, otherwise export
// a Proxy that throws when used and logs a clear error message.
let _supabase: unknown;
if (supabaseUrl && supabaseAnonKey) {
	_supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
	console.error(
		'Supabase not configured. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your environment. Netlify deploy previews may omit env vars by default.'
	);

	const handler: ProxyHandler<Record<string, unknown>> = {
		get(_, prop) {
			throw new Error(
				`Supabase is not configured. Tried to access \`${String(prop)}\`. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.`
			);
		},
		apply() {
			throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
		},
	};

	_supabase = new Proxy({}, handler);
}
export const supabase: SupabaseClient = _supabase as unknown as SupabaseClient;

// Export a boolean so UI and services can detect missing configuration
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);