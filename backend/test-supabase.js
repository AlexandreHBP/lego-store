import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

console.log('Testando conexão com Supabase...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? '***KEY_SET***' : '***KEY_MISSING***')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Tentando conectar...')
    
    // Testar conexão básica
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Erro na conexão:', error)
      return
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso!')
    console.log('Dados recebidos:', data)
    
  } catch (error) {
    console.error('❌ Erro ao conectar com Supabase:', error)
  }
}

testConnection() 