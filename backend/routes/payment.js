import express from 'express'
import { supabase } from '../config/supabase.js'

const router = express.Router()

// Configuração do PagBank
const PAGBANK_API_URL = process.env.PAGBANK_API_URL || 'https://api.pagbank.com.br'
const PAGBANK_ACCESS_TOKEN = process.env.PAGBANK_ACCESS_TOKEN

// Log para debug
console.log('PAGBANK_API_URL:', PAGBANK_API_URL)
console.log('PAGBANK_ACCESS_TOKEN:', PAGBANK_ACCESS_TOKEN ? '***TOKEN_SET***' : '***TOKEN_MISSING***')

// Função para gerar token de acesso do PagBank
const getPagBankToken = async () => {
  return PAGBANK_ACCESS_TOKEN
  try {
    const response = await fetch(`${PAGBANK_API_URL}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.PAGBANK_CLIENT_ID}:${process.env.PAGBANK_CLIENT_SECRET}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    })

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Erro ao obter token do PagBank:', error)
    throw error
  }
}

// ===== NOVA FUNCIONALIDADE: CHECKOUT PAGBANK =====

// Criar checkout no PagBank (versão mockada para desenvolvimento)
const createPagBankCheckout = async (checkoutData, accessToken) => {
  try {
    console.log('Criando checkout mockado para desenvolvimento...')
    
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Retornar resposta mockada
    const mockResponse = {
      id: `mock_order_${Date.now()}`,
      reference_id: checkoutData.reference_id,
      status: 'CREATED',
      created_at: new Date().toISOString(),
      charges: [
        {
          id: `mock_charge_${Date.now()}`,
          status: 'WAITING',
          amount: {
            value: Math.round(checkoutData.total_amount * 100),
            currency: 'BRL'
          }
        }
      ],
      links: [
        {
          rel: 'PAY',
          href: `${checkoutData.redirect_url}?reference_id=${checkoutData.reference_id}`,
          method: 'GET'
        }
      ],
      customer: checkoutData.customer,
      items: checkoutData.items
    }
    
    console.log('Checkout mockado criado:', mockResponse.id)
    return mockResponse
    
  } catch (error) {
    console.error('Erro ao criar checkout mockado:', error)
    throw error
  }
}

// Rota para criar checkout
router.post('/checkout', async (req, res) => {
  console.log('=== INÍCIO DA ROTA /checkout ===')
  console.log('Body recebido:', JSON.stringify(req.body, null, 2))
  
  try {
    const {
      reference_id,
      items,
      customer,
      redirect_url
    } = req.body

    console.log('=== VALIDANDO DADOS ===')
    console.log('Reference ID:', reference_id)
    console.log('Items:', items)
    console.log('Customer:', customer)
    console.log('Redirect URL:', redirect_url)

    // Validar dados obrigatórios
    if (!reference_id || !items || !customer) {
      console.error('=== ERRO DE VALIDAÇÃO ===')
      console.error('Dados obrigatórios faltando:', {
        reference_id: !!reference_id,
        items: !!items,
        customer: !!customer
      })
      return res.status(400).json({
        success: false,
        message: 'Dados obrigatórios: reference_id, items, customer'
      })
    }

    console.log('=== CALCULANDO VALOR TOTAL ===')
    // Calcular valor total
    const total_amount = items.reduce((sum, item) => sum + (item.unit_amount * item.quantity), 0)
    console.log('Total calculado:', total_amount)

    console.log('=== OBTENDO TOKEN PAGBANK ===')
    // Obter token de acesso do PagBank
    const accessToken = await getPagBankToken()
    console.log('Token obtido:', accessToken ? 'SUCCESS' : 'FAILED')

    console.log('=== PREPARANDO DADOS DO CHECKOUT ===')
    // Criar checkout no PagBank
    const checkoutData = {
      reference_id,
      items,
      customer,
      total_amount,
      redirect_url
    }
    console.log('Dados do checkout:', checkoutData)

    console.log('=== CHAMANDO CREATE PAGBANK CHECKOUT ===')
    const pagbankCheckout = await createPagBankCheckout(checkoutData, accessToken)
    console.log('Checkout PagBank criado:', pagbankCheckout.id)

    console.log('=== SALVANDO NO BANCO DE DADOS ===')
    // Salvar checkout no banco de dados (mockado para desenvolvimento)
    console.log('Salvando checkout mockado...')
    
    // Simular salvamento bem-sucedido
    const checkoutRecord = {
      id: `mock_checkout_${Date.now()}`,
      reference_id,
      pagbank_order_id: pagbankCheckout.id,
      customer_data: customer,
      items: items,
      total_amount,
      status: 'pending',
      redirect_url
    }
    
    console.log('Checkout salvo com sucesso:', checkoutRecord.id)

    console.log('=== PROCURANDO LINK DE PAGAMENTO ===')
    // Encontrar link de pagamento
    const paymentLink = pagbankCheckout.links?.find(link => link.rel === 'PAY')
    console.log('Links disponíveis:', pagbankCheckout.links)
    console.log('Payment link encontrado:', paymentLink)
    
    if (!paymentLink) {
      console.error('=== ERRO: LINK DE PAGAMENTO NÃO ENCONTRADO ===')
      return res.status(500).json({
        success: false,
        message: 'Link de pagamento não encontrado'
      })
    }

    console.log('=== PREPARANDO RESPOSTA ===')
    const response = {
      success: true,
      message: 'Checkout criado com sucesso',
      checkout: {
        id: pagbankCheckout.id,
        reference_id,
        payment_url: paymentLink.href,
        status: 'pending',
        total_amount
      }
    }
    console.log('Resposta final:', response)

    console.log('=== ENVIANDO RESPOSTA ===')
    return res.json(response)

  } catch (error) {
    console.error('=== ERRO NA ROTA /checkout ===')
    console.error('Erro ao criar checkout:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    })
  }
})

// Rota para consultar status do checkout
router.get('/checkout/:reference_id', async (req, res) => {
  try {
    const { reference_id } = req.params

    // Buscar checkout no banco de dados (mockado para desenvolvimento)
    console.log('Buscando checkout mockado:', reference_id)
    
    // Simular checkout encontrado
    const checkout = {
      reference_id,
      status: 'paid', // Mudando de 'pending' para 'paid' para simular pagamento aprovado
      total_amount: 99.99,
      created_at: new Date().toISOString(),
      customer_data: {
        name: 'Teste Cliente',
        email: 'teste@exemplo.com',
        tax_id: '12345678901',
        phone: '11999999999'
      },
      items: [
        {
          id: 1,
          name: 'LEGO Teste',
          quantity: 1,
          unit_amount: 99.99
        }
      ]
    }

    // Se necessário, consultar status no PagBank (mockado)
    if (checkout.pagbank_order_id) {
      try {
        console.log('Consultando status mockado...')
        
        // Simular status mockado
        const mockStatus = Math.random() > 0.5 ? 'paid' : 'pending'
        
        if (mockStatus !== checkout.status) {
          await supabase
            .from('checkouts')
            .update({ status: mockStatus })
            .eq('reference_id', reference_id)
          
          checkout.status = mockStatus
        }
      } catch (error) {
        console.error('Erro ao consultar status mockado:', error)
      }
    }

    return res.json({
      success: true,
      checkout: {
        reference_id: checkout.reference_id,
        status: checkout.status,
        total_amount: checkout.total_amount,
        created_at: checkout.created_at,
        customer_data: checkout.customer_data,
        items: checkout.items
      }
    })

  } catch (error) {
    console.error('Erro ao consultar checkout:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
})

// Webhook para receber notificações do PagBank
router.post('/webhook/pagbank', async (req, res) => {
  try {
    const { event, data } = req.body

    console.log('Webhook PagBank recebido:', { event, data })

    // Verificar se é uma notificação de pagamento
    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      const orderId = data.id
      const charge = data.charges?.[0]

      if (charge?.status === 'PAID') {
        // Atualizar status do checkout
        await supabase
          .from('checkouts')
          .update({ 
            status: 'paid',
            paid_at: new Date().toISOString()
          })
          .eq('pagbank_order_id', orderId)

        // Criar pedido se necessário
        const { data: checkout } = await supabase
          .from('checkouts')
          .select('*')
          .eq('pagbank_order_id', orderId)
          .single()

        if (checkout && checkout.status === 'pending') {
          await supabase
            .from('orders')
            .insert({
              order_number: checkout.reference_id,
              total_amount: checkout.total_amount,
              status: 'paid',
              payment_method: 'pagbank_checkout',
              items: checkout.items,
              customer_data: checkout.customer_data
            })
        }
      }
    }

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Erro no webhook PagBank:', error)
    res.status(500).json({ success: false })
  }
})

// ===== FUNCIONALIDADE EXISTENTE MANTIDA =====

// Criar pedido no PagBank
const createPagBankOrder = async (orderData, accessToken) => {
  try {
    const orderPayload = {
      reference_id: orderData.orderNumber,
             customer: {
         name: `${orderData.firstName} ${orderData.lastName}`,
         email: orderData.email,
         tax_id: orderData.cpf?.replace(/\D/g, '') || '12345678901',
        phones: [
          {
            country: '55',
            area: '11',
            number: orderData.phone.replace(/\D/g, '')
          }
        ]
      },
      items: orderData.items.map(item => ({
        reference_id: item.id.toString(),
        name: item.name,
        quantity: item.quantity,
        unit_amount: Math.round(item.price * 100) // Valor em centavos
      })),
      shipping: {
        address: {
          street: orderData.address,
          number: '1',
          complement: '',
          locality: orderData.city,
          city: orderData.city,
          region_code: orderData.state,
          country: 'BRA',
          postal_code: orderData.zipCode.replace(/\D/g, '')
        }
      },
      charges: [
        {
          reference_id: `charge_${orderData.orderNumber}`,
          description: `Pedido ${orderData.orderNumber}`,
          amount: {
            value: Math.round(orderData.total * 100), // Valor em centavos
            currency: 'BRL'
          },
          payment_method: {
            type: orderData.paymentMethod === 'credit' ? 'CREDIT_CARD' : 'PIX',
            installments: 1,
            capture: true,
            card: orderData.paymentMethod === 'credit' ? {
              number: orderData.cardNumber.replace(/\s/g, ''),
              exp_month: orderData.cardExpiry.split('/')[0],
              exp_year: `20${orderData.cardExpiry.split('/')[1]}`,
              security_code: orderData.cardCvv,
              holder: {
                name: orderData.cardName
              }
            } : undefined
          }
        }
      ]
    }

    const response = await fetch(`${PAGBANK_API_URL}/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(orderPayload)
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao criar pedido no PagBank:', error)
    throw error
  }
}

// Rota para processar pagamento
router.post('/process', async (req, res) => {
  try {
    const {
      orderData,
      paymentData
    } = req.body

    // Validar dados obrigatórios
    if (!orderData || !paymentData) {
      return res.status(400).json({
        success: false,
        message: 'Dados do pedido e pagamento são obrigatórios'
      })
    }

    // Obter token de acesso do PagBank
    const accessToken = await getPagBankToken()

    // Criar pedido no PagBank
    const pagbankOrder = await createPagBankOrder({
      ...orderData,
      ...paymentData
    }, accessToken)

    // Verificar se o pagamento foi aprovado
    const charge = pagbankOrder.charges?.[0]
    if (charge?.status === 'PAID') {
      // Salvar pedido no Supabase
      const { data: orderRecord, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderData.orderNumber,
          user_id: orderData.userId,
          total_amount: orderData.total,
          status: 'paid',
          payment_method: paymentData.paymentMethod,
          shipping_address: JSON.stringify({
            address: paymentData.address,
            city: paymentData.city,
            state: paymentData.state,
            zipCode: paymentData.zipCode
          }),
          items: JSON.stringify(orderData.items)
        })

      if (orderError) {
        console.error('Erro ao salvar pedido:', orderError)
        return res.status(500).json({
          success: false,
          message: 'Erro ao salvar pedido'
        })
      }

      return res.json({
        success: true,
        message: 'Pagamento processado com sucesso',
        order: {
          id: orderRecord?.[0]?.id,
          number: orderData.orderNumber,
          status: 'paid',
          total: orderData.total
        }
      })
    } else {
      return res.status(400).json({
        success: false,
        message: 'Pagamento não foi aprovado',
        details: charge?.status
      })
    }

  } catch (error) {
    console.error('Erro ao processar pagamento:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
})

// Rota para obter status do pagamento
router.get('/status/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params

    // Buscar pedido no Supabase
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single()

    if (error || !order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      })
    }

    return res.json({
      success: true,
      order: {
        number: order.order_number,
        status: order.status,
        total: order.total_amount,
        createdAt: order.created_at
      }
    })

  } catch (error) {
    console.error('Erro ao buscar status do pedido:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
})

export default router 