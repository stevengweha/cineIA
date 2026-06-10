import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// On utilise le nom exact qui est dans ton .env
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Clés Supabase manquantes dans le fichier .env")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)