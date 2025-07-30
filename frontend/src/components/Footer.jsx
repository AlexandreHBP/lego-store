import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold">Lego Store</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Sua loja online de confiança para produtos de qualidade. Oferecemos uma ampla variedade de produtos com entrega rápida e seguro.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>contato@legostore.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Lego Store. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 