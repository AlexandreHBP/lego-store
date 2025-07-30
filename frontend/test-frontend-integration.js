// Teste da integração do frontend
const testFrontendIntegration = async () => {
  console.log('🧪 Testando integração do frontend...')
  
  const baseUrl = 'http://localhost:5000'
  
  try {
    // 1. Testar se o backend está acessível
    console.log('1. Testando conexão com o backend...')
    
    const healthResponse = await fetch(`${baseUrl}/api/health`)
    if (!healthResponse.ok) {
      throw new Error('Backend não está respondendo')
    }
    
    const healthData = await healthResponse.json()
    console.log('✅ Backend está acessível:', healthData.message)
    
    // 2. Testar criação de checkout via API
    console.log('2. Testando criação de checkout...')
    
    const checkoutData = {
      reference_id: `frontend_test_${Date.now()}`,
      items: [
        {
          id: 1,
          name: 'LEGO Star Wars Millennium Falcon',
          quantity: 1,
          unit_amount: 799.99
        }
      ],
      customer: {
        name: 'João Silva',
        email: 'joao@exemplo.com',
        tax_id: '12345678901',
        phone: '11999999999',
        address: {
          street: 'Rua das Flores',
          number: '123',
          complement: 'Apto 45',
          locality: 'Centro',
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
    
    // 3. Testar redirecionamento
    console.log('3. Testando redirecionamento...')
    
    const paymentUrl = new URL(checkoutResult.checkout.payment_url)
    const referenceId = paymentUrl.searchParams.get('reference_id')
    
    if (referenceId) {
      console.log('✅ Reference ID encontrado na URL:', referenceId)
    } else {
      console.log('⚠️ Reference ID não encontrado na URL')
    }
    
    // 4. Testar consulta de status
    console.log('4. Testando consulta de status...')
    
    const statusResponse = await fetch(`${baseUrl}/api/payment/checkout/${checkoutData.reference_id}`)
    
    if (!statusResponse.ok) {
      const errorData = await statusResponse.json()
      throw new Error(`Erro ao consultar status: ${errorData.message}`)
    }
    
    const statusResult = await statusResponse.json()
    console.log('✅ Status consultado com sucesso:', statusResult.checkout.status)
    
    console.log('🎉 Todos os testes do frontend passaram!')
    console.log('💡 O fluxo de pagamento está funcionando corretamente.')
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Dica: Certifique-se de que o servidor backend está rodando na porta 5000')
      console.log('   Execute: npm start no diretório backend')
    }
  }
}

// Executar teste
testFrontendIntegration() 