import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react'
import { API_ENDPOINTS, apiRequest } from '../config/api'

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [checkoutStatus, setCheckoutStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const reference_id = searchParams.get('reference_id')

  useEffect(() => {
    if (reference_id) {
      checkCheckoutStatus()
    } else {
      setIsLoading(false)
    }
  }, [reference_id])

  const checkCheckoutStatus = async () => {
    try {
      const result = await apiRequest(API_ENDPOINTS.PAYMENT_CHECKOUT_STATUS(reference_id))

      if (result.success) {
        setCheckoutStatus(result.checkout)
      } else {
        setError(result.message || 'Erro ao verificar status do pagamento')
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error)
      setError('Erro de conexão ao verificar status do pagamento')
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueShopping = () => {
    navigate('/products')
  }

  const handleViewOrder = () => {
    navigate('/account')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
            Verificando pagamento...
          </h2>
          <p className="text-gray-600 text-center">
            Aguarde enquanto verificamos o status do seu pagamento.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
            Erro na verificação
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => checkCheckoutStatus()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Tentar novamente
            </button>
            <button
              onClick={handleContinueShopping}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Continuar comprando
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isPaid = checkoutStatus?.status === 'paid'
  const isPending = checkoutStatus?.status === 'pending'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4">
        {isPaid ? (
          <>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-center text-gray-900 mb-2">
              Pagamento Aprovado!
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Seu pedido foi processado com sucesso. Você receberá uma confirmação por email.
            </p>
            
            {checkoutStatus && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Detalhes do Pedido</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Número do Pedido:</span>
                    <span className="font-medium">{checkoutStatus.reference_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-medium">R$ {checkoutStatus.total_amount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium text-green-600">Pago</span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : isPending ? (
          <>
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-12 h-12 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-semibold text-center text-gray-900 mb-2">
              Pagamento em Processamento
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Seu pagamento está sendo processado. Você receberá uma confirmação assim que for aprovado.
            </p>
            
            {checkoutStatus && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Detalhes do Pedido</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Número do Pedido:</span>
                    <span className="font-medium">{checkoutStatus.reference_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-medium">R$ {checkoutStatus.total_amount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium text-yellow-600">Processando</span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-semibold text-center text-gray-900 mb-2">
              Status Desconhecido
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Não foi possível determinar o status do seu pagamento. Entre em contato conosco.
            </p>
          </>
        )}

        <div className="space-y-3">
          {isPaid && (
            <button
              onClick={handleViewOrder}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Ver Meus Pedidos
            </button>
          )}
          <button
            onClick={handleContinueShopping}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Continuar Comprando
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Início</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess 