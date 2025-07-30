import express from 'express'
import { supabase } from '../config/supabase.js'

const router = express.Router()

// Mock user data (fallback)
const mockUsers = [
  {
    id: 1,
    email: 'admin@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  }
]

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Todos os campos são obrigatórios' 
      })
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'A senha deve ter pelo menos 6 caracteres' 
      })
    }

    // Try to register with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName
        }
      }
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(201).json({
      message: 'Usuário registrado com sucesso. Verifique seu email para confirmar.',
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.user_metadata?.firstName,
        lastName: data.user.user_metadata?.lastName
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email e senha são obrigatórios' 
      })
    }

    // Try to login with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return res.status(401).json({ error: error.message })
    }

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.user_metadata?.firstName,
        lastName: data.user.user_metadata?.lastName
      },
      session: data.session
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de acesso necessário' })
    }

    const token = authHeader.split(' ')[1]

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido' })
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.user_metadata?.firstName,
        lastName: user.user_metadata?.lastName
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Logout user
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de acesso necessário' })
    }

    const token = authHeader.split(' ')[1]

    // Logout with Supabase
    const { error } = await supabase.auth.admin.signOut(token)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ message: 'Logout realizado com sucesso' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' })
    }

    // Send reset password email with Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ message: 'Email de redefinição de senha enviado' })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de acesso necessário' })
    }

    const token = authHeader.split(' ')[1]
    const { firstName, lastName, phone } = req.body

    // Update user with Supabase
    const { data, error } = await supabase.auth.updateUser({
      data: {
        firstName,
        lastName,
        phone
      }
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.user_metadata?.firstName,
        lastName: data.user.user_metadata?.lastName,
        phone: data.user.user_metadata?.phone
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

export default router 