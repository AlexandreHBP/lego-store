import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

console.log('Criando tabela checkouts...')

const supabase = createClient(supabaseUrl, supabaseKey)

async function createCheckoutsTable() {
  try {
    // Testar se a tabela existe
    const { data, error } = await supabase
      .from('checkouts')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('Tabela checkouts não existe, criando...')
      
      // Criar tabela via SQL (se tivermos permissão)
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS checkouts (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            reference_id TEXT UNIQUE NOT NULL,
            pagbank_order_id TEXT,
            customer_data JSONB NOT NULL,
            items JSONB NOT NULL,
            total_amount DECIMAL(10,2) NOT NULL,
            status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'failed')),
            redirect_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            paid_at TIMESTAMP WITH TIME ZONE
          );
        `
      })
      
      if (createError) {
        console.error('Erro ao criar tabela:', createError)
        console.log('Você precisa criar a tabela manualmente no Supabase')
        return
      }
      
      console.log('✅ Tabela checkouts criada com sucesso!')
    } else {
      console.log('✅ Tabela checkouts já existe!')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
    console.log('Você precisa criar a tabela manualmente no Supabase')
  }
}

createCheckoutsTable() 