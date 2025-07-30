import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key'

// Log para debug
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key:', supabaseKey ? '***KEY_SET***' : '***KEY_MISSING***')

export const supabase = createClient(supabaseUrl, supabaseKey) 