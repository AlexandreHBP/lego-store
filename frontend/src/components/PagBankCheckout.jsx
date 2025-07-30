import { useNavigate } from 'react-router-dom'
import { CreditCard, Lock, ExternalLink, Loader2 } from 'lucide-react'
import { usePagBankCheckout } from '../hooks/usePagBankCheckout'

const PagBankCheckout = ({ cartItems, total, customerData, onSuccess, onError }) => {
  const navigate = useNavigate()
  const { isLoading, error, createCheckout } = usePagBankCheckout()

  const handlePagBankCheckout = async () => {
    console.log('Iniciando checkout PagBank...')
    
    // Validar se os dados do cliente estão preenchidos
    if (customerData) {
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'cpf', 'address', 'city', 'state', 'zipCode']
      const missingFields = requiredFields.filter(field => !customerData[field])
      
      if (missingFields.length > 0) {
        onError?.('Por favor, preencha todos os dados de entrega antes de prosseguir.')
        return
      }
    }

    try {
      // Converter itens do carrinho para formato do PagBank
      const items = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit_amount: item.price
      }))

      // Dados do cliente do formulário
      const customer = customerData ? {
        name: `${customerData.firstName} ${customerData.lastName}`,
        email: customerData.email,
        tax_id: customerData.cpf?.replace(/\D/g, ''),
        phone: customerData.phone,
        address: {
          street: customerData.address,
          number: '1',
          complement: customerData.complement || '',
          locality: 'Bairro',
          city: customerData.city,
          region_code: customerData.state,
          postal_code: customerData.zipCode?.replace(/\D/g, '')
        }
      } : {
        name: 'Cliente Exemplo',
        email: 'cliente@exemplo.com',
        tax_id: '12345678901',
        phone: '11999999999',
        address: {
          street: 'Rua Exemplo',
          number: '123',
          complement: '',
          locality: 'Bairro',
          city: 'São Paulo',
          region_code: 'SP',
          postal_code: '01234-567'
        }
      }

      // URL de redirecionamento após pagamento
      const redirect_url = `${window.location.origin}/payment/success`

      // Criar checkout usando o hook
      const checkout = await createCheckout({
        items,
        customer,
        redirect_url
      })

      console.log('Checkout criado:', checkout)

      if (checkout) {
        onSuccess?.(checkout)
        console.log('Redirecionando para:', checkout.payment_url)
        // Redirecionar para o link de pagamento do PagBank
        try {
          window.location.href = checkout.payment_url
          console.log('Redirecionamento executado')
        } catch (error) {
          console.error('Erro no redirecionamento:', error)
          // Fallback: tentar abrir em nova aba
          window.open(checkout.payment_url, '_blank')
        }
      }
    } catch (error) {
      console.error('Erro no checkout PagBank:', error)
      onError?.(error.message || 'Erro de conexão')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Pagar com PagBank
        </h3>
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-green-600" />
          <span className="text-sm text-gray-600">Pagamento Seguro</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Resumo do pedido */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Resumo do Pedido</h4>
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botão de pagamento */}
        <button
          onClick={handlePagBankCheckout}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {console.log('Estado de loading:', isLoading)}
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processando...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Pagar com PagBank</span>
              <ExternalLink className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Informações de segurança */}
        <div className="text-xs text-gray-500 text-center">
          <p>Seus dados estão protegidos com criptografia SSL</p>
          <p>Pagamento processado pelo PagBank</p>
        </div>
      </div>
    </div>
  )
}

export default PagBankCheckout 