import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

const Cart = () => {
  const navigate = useNavigate()
  const { cartItems, updateQuantity, removeFromCart, getCartSubtotal } = useCart()

  const shipping = 15.99
  const total = getCartSubtotal() + shipping

  if (cartItems.length === 0) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ShoppingBag className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Adicione alguns produtos para começar suas compras
            </p>
            <Link to="/products" className="btn-primary">
              Ver Produtos
            </Link>
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
            to="/products"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continuar Comprando
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Carrinho de Compras
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Produtos */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Produtos ({cartItems.length})
                </h2>
                
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          R$ {item.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors duration-200 mt-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Resumo do Pedido
                </h2>

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

                <button 
                  onClick={() => navigate('/payment')}
                  className="btn-primary w-full mb-4"
                >
                  Finalizar Compra
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Entrega em 2-3 dias úteis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produtos Recomendados */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Produtos Recomendados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card group">
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={`https://via.placeholder.com/300x300/000000/FFFFFF?text=Recomendado+${i}`}
                    alt={`Produto Recomendado ${i}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Produto Recomendado {i}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      R$ {(Math.random() * 200 + 100).toFixed(2)}
                    </span>
                    <button className="btn-primary text-sm px-4 py-2">
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart 