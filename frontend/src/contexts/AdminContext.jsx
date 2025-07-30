import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../config/supabase'

const AdminContext = createContext()

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

export const AdminProvider = ({ children }) => {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)

  // Verificar se o usuário é admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        // Verificar se o usuário tem role de admin
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking admin status:', error)
        }

        setIsAdmin(profile?.role === 'admin')
      } catch (error) {
        console.warn('Supabase not configured, admin check failed:', error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [user])

  // Carregar produtos
  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.warn('Error loading products:', error)
      setProducts([])
    }
  }

  // Adicionar produto
  const addProduct = async (productData) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()

      if (error) throw error

      setProducts(prev => [data[0], ...prev])
      return { success: true, data: data[0] }
    } catch (error) {
      console.warn('Error adding product:', error)
      return { success: false, error: error.message }
    }
  }

  // Atualizar produto
  const updateProduct = async (id, productData) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()

      if (error) throw error

      setProducts(prev => 
        prev.map(product => 
          product.id === id ? data[0] : product
        )
      )
      return { success: true, data: data[0] }
    } catch (error) {
      console.warn('Error updating product:', error)
      return { success: false, error: error.message }
    }
  }

  // Deletar produto
  const deleteProduct = async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      setProducts(prev => prev.filter(product => product.id !== id))
      return { success: true }
    } catch (error) {
      console.warn('Error deleting product:', error)
      return { success: false, error: error.message }
    }
  }

  const value = {
    isAdmin,
    loading,
    products,
    editingProduct,
    setEditingProduct,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
} 