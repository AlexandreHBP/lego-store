import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Star, ShoppingCart } from 'lucide-react'
import { supabase } from '../config/supabase'
import { useCart } from '../contexts/CartContext'

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart } = useCart()

  // Buscar produtos do Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        setProducts(data || [])
      } catch (err) {
        console.error('Erro ao buscar produtos:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'eletronicos', name: 'Eletrônicos' },
    { id: 'casa', name: 'Casa' },
    { id: 'esporte', name: 'Esporte' }
  ]

  const sortOptions = [
    { value: 'name', label: 'Nome' },
    { value: 'price-low', label: 'Preço: Menor' },
    { value: 'price-high', label: 'Preço: Maior' },
    { value: 'rating', label: 'Avaliação' }
  ]

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Ordenar produtos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '')
      case 'price-low':
        return (a.price || 0) - (b.price || 0)
      case 'price-high':
        return (b.price || 0) - (a.price || 0)
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      default:
        return 0
    }
  })

  const handleAddToCart = (product) => {
    addToCart(product, 1)
  }

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando produtos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Erro ao carregar produtos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Nossos Produtos
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Descubra nossa coleção completa de produtos de qualidade
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="mb-8 space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Ordenação */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input text-sm max-w-xs"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-300">
            {sortedProducts.length} produto{sortedProducts.length !== 1 ? 's' : ''} encontrado{sortedProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid de Produtos */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div key={product.id} className="card group">
                <Link to={`/products/${product.id}`}>
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/300x300'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      ({product.reviews || 0})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      R$ {product.price?.toFixed(2)}
                    </span>
                    <button 
                      className="btn-primary text-sm px-4 py-2 flex items-center"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Tente ajustar seus filtros ou termos de busca
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products 