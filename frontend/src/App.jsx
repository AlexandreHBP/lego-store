import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { AdminProvider } from './contexts/AdminContext'
import { CartProvider } from './contexts/CartContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import About from './pages/About'
import Contact from './pages/Contact'
import Account from './pages/Account'
import AdminPanel from './pages/AdminPanel'
import Payment from './pages/Payment'

function App() {
  console.log('App component rendering...')
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/payment" element={<Payment />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App 