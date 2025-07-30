// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const API_ENDPOINTS = {
  // Pagamento
  PAYMENT_PROCESS: `${API_BASE_URL}/api/payment/process`,
  PAYMENT_CHECKOUT: `${API_BASE_URL}/api/payment/checkout`,
  PAYMENT_CHECKOUT_STATUS: (referenceId) => `${API_BASE_URL}/api/payment/checkout/${referenceId}`,
  
  // Produtos
  PRODUCTS: `${API_BASE_URL}/api/products`,
  PRODUCT_DETAIL: (id) => `${API_BASE_URL}/api/products/${id}`,
  
  // Autenticação
  AUTH_LOGIN: `${API_BASE_URL}/api/auth/login`,
  AUTH_REGISTER: `${API_BASE_URL}/api/auth/register`,
  AUTH_LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  
  // Pedidos
  ORDERS: `${API_BASE_URL}/api/orders`,
  ORDER_STATUS: (orderNumber) => `${API_BASE_URL}/api/payment/status/${orderNumber}`,
  
  // Contato
  CONTACT: `${API_BASE_URL}/api/contact`,
}

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}

// Função helper para fazer requisições
export const apiRequest = async (endpoint, options = {}) => {
  const config = {
    ...API_CONFIG,
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(endpoint, config)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Erro na requisição')
    }
    
    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
} 