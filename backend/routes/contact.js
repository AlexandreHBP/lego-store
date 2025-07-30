import express from 'express'
const router = express.Router()

// Mock contact messages - em um projeto real, viria do banco de dados
const contactMessages = []

// POST /api/contact - Enviar mensagem de contato
router.post('/', (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    
    // Validações básicas
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Todos os campos são obrigatórios'
      })
    }
    
    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      })
    }
    
    // Criar nova mensagem
    const newMessage = {
      id: contactMessages.length + 1,
      name,
      email,
      subject,
      message,
      status: 'unread',
      createdAt: new Date().toISOString()
    }
    
    contactMessages.push(newMessage)
    
    // Em um projeto real, aqui você enviaria um email de notificação
    console.log('Nova mensagem de contato:', newMessage)
    
    res.status(201).json({
      success: true,
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      data: {
        id: newMessage.id,
        createdAt: newMessage.createdAt
      }
    })
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    })
  }
})

// GET /api/contact - Listar mensagens (apenas para admin)
router.get('/', (req, res) => {
  try {
    // Em um projeto real, você verificaria se o usuário é admin
    const { page = 1, limit = 10, status } = req.query
    
    let filteredMessages = [...contactMessages]
    
    // Filtrar por status
    if (status) {
      filteredMessages = filteredMessages.filter(msg => msg.status === status)
    }
    
    // Ordenar por data de criação (mais recentes primeiro)
    filteredMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    // Paginação
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + parseInt(limit)
    const paginatedMessages = filteredMessages.slice(startIndex, endIndex)
    
    res.json({
      success: true,
      data: paginatedMessages,
      pagination: {
        total: filteredMessages.length,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(filteredMessages.length / limit)
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar mensagens'
    })
  }
})

// GET /api/contact/:id - Buscar mensagem específica
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params
    const message = contactMessages.find(m => m.id === parseInt(id))
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Mensagem não encontrada'
      })
    }
    
    res.json({
      success: true,
      data: message
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar mensagem'
    })
  }
})

// PUT /api/contact/:id/status - Atualizar status da mensagem
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    
    const validStatuses = ['unread', 'read', 'replied', 'archived']
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status inválido'
      })
    }
    
    const message = contactMessages.find(m => m.id === parseInt(id))
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Mensagem não encontrada'
      })
    }
    
    message.status = status
    message.updatedAt = new Date().toISOString()
    
    res.json({
      success: true,
      message: 'Status da mensagem atualizado com sucesso',
      data: message
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar status da mensagem'
    })
  }
})

// DELETE /api/contact/:id - Deletar mensagem
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params
    const messageIndex = contactMessages.findIndex(m => m.id === parseInt(id))
    
    if (messageIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Mensagem não encontrada'
      })
    }
    
    contactMessages.splice(messageIndex, 1)
    
    res.json({
      success: true,
      message: 'Mensagem deletada com sucesso'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar mensagem'
    })
  }
})

// GET /api/contact/stats - Estatísticas das mensagens
router.get('/stats', (req, res) => {
  try {
    const total = contactMessages.length
    const unread = contactMessages.filter(m => m.status === 'unread').length
    const read = contactMessages.filter(m => m.status === 'read').length
    const replied = contactMessages.filter(m => m.status === 'replied').length
    const archived = contactMessages.filter(m => m.status === 'archived').length
    
    // Mensagens dos últimos 7 dias
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recent = contactMessages.filter(m => new Date(m.createdAt) >= sevenDaysAgo).length
    
    res.json({
      success: true,
      data: {
        total,
        unread,
        read,
        replied,
        archived,
        recent
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas'
    })
  }
})

export default router 