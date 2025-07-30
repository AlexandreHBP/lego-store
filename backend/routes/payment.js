import express from 'express'
import { supabase } from '../config/supabase.js'

const router = express.Router()

// Configuração do PagBank
const PAGBANK_API_URL = 'https://api.pagbank.com.br'
const PAGBANK_ACCESS_TOKEN = process.env.PAGBANK_ACCESS_TOKEN

// Função para gerar token de acesso do PagBank
const getPagBankToken = async () => {
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