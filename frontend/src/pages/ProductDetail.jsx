import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, ShoppingCart, Heart, Share2, ArrowLeft } from 'lucide-react'
import { supabase } from '../config/supabase'
import { useCart } from '../contexts/CartContext'

const ProductDetail = () => {
  const { id } = useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart } = useCart()

  // Buscar dados do produto do Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          throw error
        }

        setProduct(data)
      } catch (err) {
        console.error('Erro ao buscar produto:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  // Recarregar dados quando a página ganha foco (para atualizações)
  useEffect(() => {
    const handleFocus = () => {
      if (id && product) {
        const fetchProduct = async () => {
          try {
            const { data, error } = await supabase
              .from('products')
              .select('*')
              .eq('id', id)
              .single()

            if (error) {
              throw error
            }

            setProduct(data)
          } catch (err) {
            console.error('Erro ao atualizar produto:', err)
          }
        }

        fetchProduct()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [id, product])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
    }
  }

  const reviews = [
    {
      id: 1,
      user: 'João Silva',
      rating: 5,
      date: '2024-01-15',
      comment: 'Produto excelente! Superou minhas expectativas. Recomendo fortemente.'
    },
    {
      id: 2,
      user: 'Maria Santos',
      rating: 4,
      date: '2024-01-10',
      comment: 'Muito bom produto, qualidade superior. Entrega foi rápida.'
    },
    {
      id: 3,
      user: 'Pedro Costa',
      rating: 5,
      date: '2024-01-08',
      comment: 'Perfeito! Exatamente como descrito. Valeu cada centavo.'
    }
  ]

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando produto...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Produto não encontrado
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || 'O produto que você está procurando não existe.'}
            </p>
            <Link
              to="/products"
              className="btn-primary"
            >
              Voltar aos produtos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const discount = product.original_price && product.original_price > product.price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos produtos
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galeria de Imagens */}
          <div>
            <div className="aspect-square overflow-hidden rounded-lg mb-4">
              <img
                src={product.images?.[selectedImage] || 'https://via.placeholder.com/600x600'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors duration-200 ${
                      selectedImage === index
                        ? 'border-black dark:border-white'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-300 ml-2">
                  {product.rating || 0} ({product.reviews || 0} avaliações)
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  R$ {product.price?.toFixed(2)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      R$ {product.original_price.toFixed(2)}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {product.description}
              </p>

              {/* Status do Estoque */}
              <div className="mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  product.in_stock
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {product.in_stock ? `Em estoque (${product.stock_quantity || 0} unidades)` : 'Fora de estoque'}
                </span>
              </div>
            </div>

            {/* Ações */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  className="btn-primary flex-1 flex items-center justify-center"
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Adicionar ao Carrinho
                </button>
                <button className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Características */}
            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Características
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                      <div className="w-2 h-2 bg-black dark:bg-white rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Especificações */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Especificações
                </h3>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-300">{key}</span>
                      <span className="text-gray-900 dark:text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Avaliações */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Avaliações dos Clientes
          </h3>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 font-medium">
                        {review.user.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {review.user}
                      </h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail 