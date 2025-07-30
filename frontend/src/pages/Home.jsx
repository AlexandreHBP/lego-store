import { Link } from 'react-router-dom'
import { ArrowRight, Star, Truck, Shield, Clock } from 'lucide-react'

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'Produto Premium 1',
      price: 299.99,
      image: 'https://via.placeholder.com/300x300/000000/FFFFFF?text=Produto+1',
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: 'Produto Premium 2',
      price: 199.99,
      image: 'https://via.placeholder.com/300x300/000000/FFFFFF?text=Produto+2',
      rating: 4.6,
      reviews: 89
    },
    {
      id: 3,
      name: 'Produto Premium 3',
      price: 399.99,
      image: 'https://via.placeholder.com/300x300/000000/FFFFFF?text=Produto+3',
      rating: 4.9,
      reviews: 156
    },
    {
      id: 4,
      name: 'Produto Premium 4',
      price: 159.99,
      image: 'https://via.placeholder.com/300x300/000000/FFFFFF?text=Produto+4',
      rating: 4.7,
      reviews: 203
    }
  ]

  const features = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'Entrega Rápida',
      description: 'Entrega em até 24h para todo o Brasil'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Compra Segura',
      description: 'Pagamento seguro e garantia de 30 dias'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Suporte 24/7',
      description: 'Atendimento disponível 24 horas por dia'
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bem-vindo à <span className="text-white">Lego Store</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Descubra produtos incríveis com qualidade premium e preços imbatíveis
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="btn-primary inline-flex items-center justify-center"
              >
                Ver Produtos
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="btn-secondary inline-flex items-center justify-center"
              >
                Sobre Nós
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Confira nossos produtos mais populares e bem avaliados pelos clientes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="card group">
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      ({product.reviews})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      R$ {product.price.toFixed(2)}
                    </span>
                    <button className="btn-primary text-sm px-4 py-2">
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="btn-primary inline-flex items-center"
            >
              Ver Todos os Produtos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 dark:bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar suas compras?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de clientes satisfeitos que já escolheram a Lego Store
          </p>
          <Link to="/products" className="btn-primary">
            Começar a Comprar
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home 