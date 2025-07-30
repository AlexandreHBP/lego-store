import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import productsRoutes from './routes/products.js'
import authRoutes from './routes/auth.js'
import ordersRoutes from './routes/orders.js'
import contactRoutes from './routes/contact.js'
import paymentRoutes from './routes/payment.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/products', productsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/payment', paymentRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Lego Store API is running',
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: 'The requested route does not exist'
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: 'Internal server error',
    message: 'Something went wrong on the server'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 API available at http://localhost:${PORT}/api`)
}) 