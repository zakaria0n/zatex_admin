import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// Pour l'admin, on devrait idéalement utiliser la service key pour être sûr de passer certaines RLS,
// mais comme l'auth est basée sur le token JWT, on peut utiliser l'anon key si "admin" est dans le JWT
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;



export const supabase = createClient(supabaseUrl, supabaseAnonKey);
