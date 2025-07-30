import { useState } from 'react'
import { API_ENDPOINTS, apiRequest } from '../config/api'

export const usePagBankCheckout = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkout, setCheckout] = useState(null)

  // Gerar ID único para o pedido
  const generateReferenceId = () => {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Criar checkout
  const createCheckout = async (orderData) => {
    setIsLoading(true)
    setError('')
    setCheckout(null)

    try {
      const {
        items,
        customer,
        redirect_url
      } = orderData

      const reference_id = generateReferenceId()

      console.log('Enviando dados para API:', {
        reference_id,
        items,
        customer,
        redirect_url
      })

      const result = await apiRequest(API_ENDPOINTS.PAYMENT_CHECKOUT, {
        method: 'POST',
        body: JSON.stringify({
          reference_id,
          items,
          customer,
          redirect_url
        })
      })

      console.log('Resposta da API:', result)

      if (result.success) {
        setCheckout(result.checkout)
        return result.checkout
      } else {
        throw new Error(result.message || 'Erro ao criar checkout')
      }
    } catch (error) {
      console.error('Erro no checkout PagBank:', error)
      setError(error.message || 'Erro ao criar checkout')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Verificar status do checkout
  const checkStatus = async (referenceId) => {
    try {
      const result = await apiRequest(API_ENDPOINTS.PAYMENT_CHECKOUT_STATUS(referenceId))
      
      if (result.success) {
        return result.checkout
      } else {
        throw new Error(result.message || 'Erro ao verificar status')
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error)
      throw error
    }
  }

  // Limpar estado
  const reset = () => {
    setError('')
    setCheckout(null)
    setIsLoading(false)
  }

  return {
    isLoading,
    error,
    checkout,
    createCheckout,
    checkStatus,
    reset
  }
} 