import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CreditCard, Truck, CheckCircle, Lock } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

const Payment = () => {
  const navigate = useNavigate()
  const { cartItems, getCartSubtotal, clearCart } = useCart()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.full_name?.split(' ')[0] || '',
    lastName: user?.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    cpf: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    paymentMethod: 'credit'
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [countdown, setCountdown] = useState(600) // 10 minutos em segundos
  const [orderNumber, setOrderNumber] = useState('')

  const shipping = 15.99
  const total = getCartSubtotal() + shipping

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Gerar número do pedido apenas uma vez
      const newOrderNumber = Math.random().toString(36).substr(2, 9).toUpperCase()
      setOrderNumber(newOrderNumber)

      // Preparar dados do pedido
      const orderData = {
        orderNumber: newOrderNumber,
        userId: user?.id,
        items: cartItems,
        total: total,
        shipping: shipping
      }

      // Preparar dados do pagamento
      const paymentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        cpf: formData.cpf,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        paymentMethod: formData.paymentMethod,
        cardNumber: formData.cardNumber,
        cardName: formData.cardName,
        cardExpiry: formData.cardExpiry,
        cardCvv: formData.cardCvv
      }

      // Processar pagamento via API
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderData,
          paymentData
        })
      })

      const result = await response.json()

      if (result.success) {
        // Pagamento aprovado
        setOrderComplete(true)
        clearCart()
      } else {
        // Pagamento rejeitado
        alert(`Erro no pagamento: ${result.message}`)
        setIsProcessing(false)
      }

    } catch (error) {
      console.error('Erro ao processar pagamento:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
      setIsProcessing(false)
    }
  }

  // Contador regressivo
  useEffect(() => {
    if (orderComplete && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (orderComplete && countdown === 0) {
      navigate('/')
    }
  }, [orderComplete, countdown, navigate])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleContinueShopping = () => {
    navigate('/')
  }

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Carrinho vazio
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Adicione produtos ao carrinho para continuar
            </p>
            <Link to="/products" className="btn-primary">
              Ver Produtos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-green-500 mb-4">
              <CheckCircle className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Pedido Confirmado!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Seu pedido foi processado com sucesso. Você receberá um email de confirmação em breve.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Número do Pedido
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                #{orderNumber}
              </p>
            </div>
            
            {/* Contador regressivo */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Redirecionamento Automático
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Você será redirecionado automaticamente em:
              </p>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                {formatTime(countdown)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ou clique no botão abaixo para sair agora
              </p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleContinueShopping}
                className="btn-primary w-full"
              >
                Continuar Comprando Agora
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                A página será fechada automaticamente em {formatTime(countdown)}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Carrinho
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Finalizar Compra
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de Pagamento */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informações de Entrega */}
              <div className="card">
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <Truck className="w-5 h-5 text-gray-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Informações de Entrega
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nome
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sobrenome
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input"
                        required
                      />
                    </div>
                                         <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                         Telefone
                       </label>
                       <input
                         type="tel"
                         name="phone"
                         value={formData.phone}
                         onChange={handleInputChange}
                         className="input"
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                         CPF
                       </label>
                       <input
                         type="text"
                         name="cpf"
                         value={formData.cpf}
                         onChange={handleInputChange}
                         className="input"
                         placeholder="000.000.000-00"
                         maxLength="14"
                         required
                       />
                     </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Endereço
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="Rua, número, complemento"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Estado
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CEP
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="input"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Método de Pagamento */}
              <div className="card">
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <CreditCard className="w-5 h-5 text-gray-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Método de Pagamento
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="credit"
                        name="paymentMethod"
                        value="credit"
                        checked={formData.paymentMethod === 'credit'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                      />
                      <label htmlFor="credit" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Cartão de Crédito
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="pix"
                        name="paymentMethod"
                        value="pix"
                        checked={formData.paymentMethod === 'pix'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                      />
                      <label htmlFor="pix" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        PIX
                      </label>
                    </div>
                  </div>

                  {formData.paymentMethod === 'credit' && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Número do Cartão
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nome no Cartão
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className="input"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Validade
                          </label>
                          <input
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            className="input"
                            placeholder="MM/AA"
                            maxLength="5"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cardCvv"
                            value={formData.cardCvv}
                            onChange={handleInputChange}
                            className="input"
                            placeholder="123"
                            maxLength="4"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'pix' && (
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        O código PIX será gerado após a confirmação do pedido.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Resumo do Pedido
                </h2>

                {/* Produtos */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Qtd: {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totais */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">R$ {getCartSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Frete</span>
                    <span className="text-gray-900 dark:text-white">R$ {shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        R$ {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botão de Finalizar */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="btn-primary w-full mb-4 flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Finalizar Compra
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Seus dados estão protegidos com criptografia SSL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment 