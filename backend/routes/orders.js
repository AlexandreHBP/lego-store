import express from 'express'
const router = express.Router()

// Mock orders - em um projeto real, viria do banco de dados
const orders = [
  {
    id: 1,
    userId: 1,
    items: [
      {
        productId: 1,
        name: 'Produto Premium 1',
        price: 299.99,
        quantity: 2,
        image: 'https://via.placeholder.com/150x150/000000/FFFFFF?text=Produto+1'
      },
      {
        productId: 2,
        name: 'Produto Premium 2',
        price: 199.99,
        quantity: 1,
        image: 'https://via.placeholder.com/150x150/000000/FFFFFF?text=Produto+2'
      }
    ],
    status: 'pending',
    total: 799.97,
    shipping: 15.99,
    subtotal: 783.98,
    shippingAddress: {
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      country: 'Brasil'
    },
    paymentMethod: 'credit_card',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  }
]

// GET /api/orders - Listar pedidos do usuário
router.get('/', (req, res) => {
  try {
    // Em um projeto real, você verificaria o token JWT para obter o userId
    const userId = req.query.userId || 1 // Mock para demonstração
    
    const userOrders = orders.filter(order => order.userId === parseInt(userId))
    
    res.json({
      success: true,
      data: userOrders
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar pedidos'
    })
  }
})

// GET /api/orders/:id - Buscar pedido específico
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params
    const order = orders.find(o => o.id === parseInt(id))
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido não encontrado'
      })
    }
    
    res.json({
      success: true,
      data: order
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar pedido'
    })
  }
})

// POST /api/orders - Criar novo pedido
router.post('/', (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body
    
    // Validações básicas
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Itens do pedido são obrigatórios'
      })
    }
    
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        error: 'Endereço de entrega é obrigatório'
      })
    }
    
    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Método de pagamento é obrigatório'
      })
    }
    
    // Calcular totais
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = 15.99 // Mock shipping cost
    const total = subtotal + shipping
    
    // Criar novo pedido
    const newOrder = {
      id: orders.length + 1,
      userId: 1, // Mock userId - em um projeto real viria do token JWT
      items,
      status: 'pending',
      total,
      shipping,
      subtotal,
      shippingAddress,
      paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    orders.push(newOrder)
    
    res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: newOrder
    })
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    })
  }
})

// PUT /api/orders/:id/status - Atualizar status do pedido
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status inválido'
      })
    }
    
    const order = orders.find(o => o.id === parseInt(id))
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido não encontrado'
      })
    }
    
    order.status = status
    order.updatedAt = new Date().toISOString()
    
    res.json({
      success: true,
      message: 'Status do pedido atualizado com sucesso',
      data: order
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar status do pedido'
    })
  }
})

// DELETE /api/orders/:id - Cancelar pedido
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params
    const orderIndex = orders.findIndex(o => o.id === parseInt(id))
    
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Pedido não encontrado'
      })
    }
    
    const order = orders[orderIndex]
    
    // Verificar se o pedido pode ser cancelado
    if (order.status === 'shipped' || order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        error: 'Não é possível cancelar um pedido já enviado ou entregue'
      })
    }
    
    // Atualizar status para cancelado
    order.status = 'cancelled'
    order.updatedAt = new Date().toISOString()
    
    res.json({
      success: true,
      message: 'Pedido cancelado com sucesso',
      data: order
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao cancelar pedido'
    })
  }
})

// GET /api/orders/status/options - Obter opções de status
router.get('/status/options', (req, res) => {
  try {
    const statusOptions = [
      { value: 'pending', label: 'Pendente' },
      { value: 'processing', label: 'Processando' },
      { value: 'shipped', label: 'Enviado' },
      { value: 'delivered', label: 'Entregue' },
      { value: 'cancelled', label: 'Cancelado' }
    ]
    
    res.json({
      success: true,
      data: statusOptions
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar opções de status'
    })
  }
})

export default router 