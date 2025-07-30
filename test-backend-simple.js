import fetch from 'node-fetch'

const API_BASE_URL = 'http://localhost:5000'

async function testBackend() {
  console.log('=== TESTE SIMPLES DO BACKEND ===')
  
  try {
    // Teste 1: Verificar se o servidor está rodando
    console.log('1. Testando se o servidor está rodando...')
    const healthResponse = await fetch(`${API_BASE_URL}/api/payment/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reference_id: 'test_123',
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
      })
    })

    if (healthResponse.ok) {
      const data = await healthResponse.json()
      console.log('✅ Servidor está rodando!')
      console.log('Resposta:', data)
    } else {
      console.log('❌ Servidor não está respondendo corretamente')
      console.log('Status:', healthResponse.status)
      const errorText = await healthResponse.text()
      console.log('Erro:', errorText)
    }

  } catch (error) {
    console.error('❌ Erro ao conectar com o backend:', error.message)
    console.log('\n💡 Dicas:')
    console.log('1. Certifique-se de que o backend está rodando (npm start na pasta backend)')
    console.log('2. Verifique se a porta 5000 está disponível')
    console.log('3. Verifique se não há firewall bloqueando a conexão')
  }
}

testBackend() 