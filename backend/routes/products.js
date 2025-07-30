import express from 'express'
import { supabase } from '../config/supabase.js'

const router = express.Router()

// GET /api/products - Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    })
  }
})

// GET /api/products/:id - Obter produto específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado'
        })
      }
      throw error
    }

    res.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    })
  }
})

// POST /api/products - Criar novo produto (apenas admin)
router.post('/', async (req, res) => {
  try {
    const productData = req.body

    // Validar dados obrigatórios
    if (!productData.name || !productData.price || !productData.category) {
      return res.status(400).json({
        success: false,
        error: 'Nome, preço e categoria são obrigatórios'
      })
    }

    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()

    if (error) throw error

    res.status(201).json({
      success: true,
      data: data[0]
    })
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    })
  }
})

// PUT /api/products/:id - Atualizar produto (apenas admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const productData = req.body

    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado'
        })
      }
      throw error
    }

    res.json({
      success: true,
      data: data[0]
    })
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    })
  }
})

// DELETE /api/products/:id - Deletar produto (apenas admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado'
        })
      }
      throw error
    }

    res.json({
      success: true,
      message: 'Produto deletado com sucesso'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    })
  }
})

// GET /api/products/category/:category - Filtrar por categoria
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('Error fetching products by category:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    })
  }
})

// GET /api/products/search/:query - Buscar produtos
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('Error searching products:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    })
  }
})

export default router 