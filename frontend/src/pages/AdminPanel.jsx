import { useState, useEffect } from 'react'
import { useAdmin } from '../contexts/AdminContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  Package,
  DollarSign,
  Star,
  Tag
} from 'lucide-react'

const AdminPanel = () => {
  const { user } = useAuth()
  const { 
    isAdmin, 
    loading, 
    products, 
    editingProduct, 
    setEditingProduct,
    loadProducts, 
    addProduct, 
    updateProduct, 
    deleteProduct 
  } = useAdmin()
  const navigate = useNavigate()

  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    original_price: '',
    category: '',
    description: '',
    features: '',
    specifications: '',
    stock_quantity: '',
    in_stock: true,
    images: ''
  })

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/account')
    }
  }, [isAdmin, loading, navigate])

  useEffect(() => {
    if (isAdmin) {
      loadProducts()
    }
  }, [isAdmin])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      original_price: parseFloat(formData.original_price),
      stock_quantity: parseInt(formData.stock_quantity),
      in_stock: formData.in_stock,
      features: formData.features.split('\n').filter(f => f.trim()),
      specifications: JSON.parse(formData.specifications || '{}'),
      images: formData.images.split('\n').filter(img => img.trim()),
      rating: 0,
      reviews: 0
    }

    console.log('Submitting product data:', productData)

    if (editingProduct) {
      console.log('Updating product with ID:', editingProduct.id)
      const result = await updateProduct(editingProduct.id, productData)
      console.log('Update result:', result)
      if (result.success) {
        setEditingProduct(null)
        setShowAddForm(false)
        resetForm()
        alert('Produto atualizado com sucesso!')
      } else {
        alert(`Erro ao atualizar produto: ${result.error}`)
      }
    } else {
      console.log('Adding new product')
      const result = await addProduct(productData)
      console.log('Add result:', result)
      if (result.success) {
        setShowAddForm(false)
        resetForm()
        alert('Produto adicionado com sucesso!')
      } else {
        alert(`Erro ao adicionar produto: ${result.error}`)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      original_price: '',
      category: '',
      description: '',
      features: '',
      specifications: '',
      stock_quantity: '',
      in_stock: true,
      images: ''
    })
    setEditingProduct(null)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      category: product.category,
      description: product.description,
      features: Array.isArray(product.features) ? product.features.join('\n') : '',
      specifications: typeof product.specifications === 'object' ? JSON.stringify(product.specifications, null, 2) : '',
      stock_quantity: product.stock_quantity?.toString() || '0',
      in_stock: product.in_stock,
      images: Array.isArray(product.images) ? product.images.join('\n') : ''
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      await deleteProduct(id)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Painel de Administração
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gerencie os produtos da sua loja
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Produtos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Em Estoque</p>
                                 <p className="text-2xl font-bold text-gray-900 dark:text-white">
                   {products.filter(p => p.stock_quantity > 0).length}
                 </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <div className="flex items-center">
              <Tag className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categorias</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(products.map(p => p.category)).size}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avaliação Média</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {products.length > 0 
                    ? (products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setShowAddForm(true)
              setEditingProduct(null)
              resetForm()
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Produto
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingProduct(null)
                  resetForm()
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome do Produto
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoria
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="eletronicos">Eletrônicos</option>
                    <option value="casa">Casa</option>
                    <option value="esporte">Esporte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preço
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preço Original
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="original_price"
                    value={formData.original_price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Preço original (opcional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantidade em Estoque
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="in_stock"
                      checked={formData.in_stock}
                      onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Em Estoque
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Características (uma por linha)
                  </label>
                  <textarea
                    name="features"
                    value={formData.features}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Design moderno e elegante&#10;Material de alta qualidade&#10;Funcionalidades avançadas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Especificações (JSON)
                  </label>
                  <textarea
                    name="specifications"
                    value={formData.specifications}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                    placeholder='{&#10;  "Dimensões": "15 x 10 x 5 cm",&#10;  "Peso": "500g",&#10;  "Material": "Alumínio premium"&#10;}'
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    URLs das Imagens (uma por linha)
                  </label>
                  <textarea
                    name="images"
                    value={formData.images}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="https://via.placeholder.com/600x600/000000/FFFFFF?text=Produto+1&#10;https://via.placeholder.com/600x600/000000/FFFFFF?text=Imagem+2"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingProduct(null)
                      resetForm()
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingProduct ? 'Atualizar' : 'Adicionar'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Produtos ({products.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estoque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={product.images?.[0] || 'https://via.placeholder.com/40x40'}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {product.description?.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      R$ {product.price?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {product.stock_quantity || 0}
                    </td>
                                         <td className="px-6 py-4 whitespace-nowrap">
                       {product.in_stock ? (
                         <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                           <Eye className="h-3 w-3 mr-1" />
                           Em Estoque
                         </span>
                       ) : (
                         <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                           <EyeOff className="h-3 w-3 mr-1" />
                           Sem Estoque
                         </span>
                       )}
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel 