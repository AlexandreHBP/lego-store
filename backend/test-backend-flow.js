import './test-config.js'
import fetch from 'node-fetch'

// Teste do fluxo do backend
const testBackendFlow = async () => {
  console.log('🧪 Testando fluxo do backend...')
  
  const baseUrl = 'http://localhost:5000'
  
  try {
    // 1. Testar se o servidor está rodando
    console.log('1. Testando se o servidor está rodando...')
    
    const healthResponse = await fetch(`${baseUrl}/api/health`)
    if (!healthResponse.ok) {
      throw new Error('Servidor não está respondendo')
    }
    
    const healthData = await healthResponse.json()
    console.log('✅ Servidor está rodando:', healthData.message)
    
    // 2. Testar criação de checkout
    console.log('2. Testando criação de checkout...')
    
    const checkoutData = {
      reference_id: `test_${Date.now()}`,
      items: [
        {
          id: 1,
          name: 'LEGO Teste',
          quantity: 1,
          unit_amount: 99.99
        }
      ],
      customer: {
        name: 'Teste Cliente',
        email: 'teste@exemplo.com',
        tax_id: '12345678901',
        phone: '11999999999',
        address: {
          street: 'Rua Teste',
          number: '123',
          complement: '',
          locality: 'Bairro',
          city: 'São Paulo',
          region_code: 'SP',
          postal_code: '01234-567'
        }
      },
      redirect_url: 'http://localhost:5173/payment/success'
    }
    
    const checkoutResponse = await fetch(`${baseUrl}/api/payment/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkoutData)
    })
    
    if (!checkoutResponse.ok) {
      const errorData = await checkoutResponse.json()
      throw new Error(`Erro ao criar checkout: ${errorData.message}`)
    }
    
    const checkoutResult = await checkoutResponse.json()
    console.log('✅ Checkout criado com sucesso:', checkoutResult.checkout.id)
    console.log('URL de pagamento:', checkoutResult.checkout.payment_url)
    
    // 3. Testar consulta de status
    console.log('3. Testando consulta de status...')
    
    const statusResponse = await fetch(`${baseUrl}/api/payment/checkout/${checkoutData.reference_id}`)
    
    if (!statusResponse.ok) {
      const errorData = await statusResponse.json()
      throw new Error(`Erro ao consultar status: ${errorData.message}`)
    }
    
    const statusResult = await statusResponse.json()
    console.log('✅ Status consultado com sucesso:', statusResult.checkout.status)
    
    console.log('🎉 Todos os testes do backend passaram!')
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Dica: Certifique-se de que o servidor backend está rodando na porta 5000')
      console.log('   Execute: npm start no diretório backend')
    }
  }
}

// Executar teste
testBackendFlow() 