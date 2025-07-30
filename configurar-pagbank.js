#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('🏦 Configuração do PagBank')
console.log('========================\n')

const questions = [
  {
    name: 'PAGBANK_CLIENT_ID',
    message: 'Digite seu Client ID do PagBank: ',
    required: true
  },
  {
    name: 'PAGBANK_CLIENT_SECRET', 
    message: 'Digite seu Client Secret do PagBank: ',
    required: true
  },
  {
    name: 'PAGBANK_ACCESS_TOKEN',
    message: 'Digite seu Access Token do PagBank (opcional): ',
    required: false
  },
  {
    name: 'SUPABASE_URL',
    message: 'Digite sua URL do Supabase: ',
    required: true
  },
  {
    name: 'SUPABASE_ANON_KEY',
    message: 'Digite sua chave anônima do Supabase: ',
    required: true
  }
]

const answers = {}

function askQuestion(index) {
  if (index >= questions.length) {
    createEnvFile()
    return
  }

  const question = questions[index]
  
  rl.question(question.message, (answer) => {
    if (question.required && !answer.trim()) {
      console.log('❌ Este campo é obrigatório!')
      askQuestion(index)
      return
    }
    
    answers[question.name] = answer.trim()
    askQuestion(index + 1)
  })
}

function createEnvFile() {
  const envContent = `# Supabase Configuration
SUPABASE_URL=${answers.SUPABASE_URL}
SUPABASE_ANON_KEY=${answers.SUPABASE_ANON_KEY}

# PagBank Configuration
PAGBANK_API_URL=https://api.pagbank.com.br
PAGBANK_CLIENT_ID=${answers.PAGBANK_CLIENT_ID}
PAGBANK_CLIENT_SECRET=${answers.PAGBANK_CLIENT_SECRET}
${answers.PAGBANK_ACCESS_TOKEN ? `PAGBANK_ACCESS_TOKEN=${answers.PAGBANK_ACCESS_TOKEN}` : ''}

# Application URLs
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3001

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=${generateJWTSecret()}
`

  const envPath = path.join(__dirname, 'backend', '.env')
  
  try {
    fs.writeFileSync(envPath, envContent)
    console.log('\n✅ Arquivo .env criado com sucesso!')
    console.log(`📁 Localização: ${envPath}`)
    console.log('\n🔧 Próximos passos:')
    console.log('1. Reinicie o backend: node server.js')
    console.log('2. Teste o pagamento no frontend')
    console.log('3. Verifique os logs no terminal')
  } catch (error) {
    console.error('❌ Erro ao criar arquivo .env:', error.message)
  }
  
  rl.close()
}

function generateJWTSecret() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

// Iniciar o processo
askQuestion(0) 