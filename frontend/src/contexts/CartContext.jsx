import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)

  // Carregar carrinho do localStorage ao inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCartItems(parsedCart)
        updateCartCount(parsedCart)
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error)
        setCartItems([])
        setCartCount(0)
      }
    }
  }, [])

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
    updateCartCount(cartItems)
  }, [cartItems])

  const updateCartCount = (items) => {
    const count = items.reduce((total, item) => total + item.quantity, 0)
    setCartCount(count)
  }

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      
      if (existingItem) {
        // Se o item já existe, apenas aumenta a quantidade
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Se é um novo item, adiciona ao carrinho
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || 'https://via.placeholder.com/300x300',
          quantity: quantity
        }]
      }
    })
  }

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const value = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartSubtotal
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
} 