import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useAdmin } from '../contexts/AdminContext'
import { Link } from 'react-router-dom'
import { User, LogIn, UserPlus, Settings, LogOut, Mail, Lock, User as UserIcon, Shield } from 'lucide-react'

const Account = () => {
  const { user, signIn, signUp, signOut, updateProfile } = useAuth()
  const { isAdmin } = useAdmin()
  const [isLogin, setIsLogin] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })
  const [profileForm, setProfileForm] = useState({
    firstName: user?.user_metadata?.firstName || '',
    lastName: user?.user_metadata?.lastName || '',
    phone: user?.user_metadata?.phone || ''
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const { error } = await signIn(loginForm.email, loginForm.password)
    
    if (error) {
      setError(error.message)
    } else {
      setMessage('Login realizado com sucesso!')
    }
    
    setLoading(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    const { error } = await signUp(registerForm.email, registerForm.password, {
      firstName: registerForm.firstName,
      lastName: registerForm.lastName
    })
    
    if (error) {
      setError(error.message)
    } else {
      setMessage('Conta criada com sucesso! Verifique seu email para confirmar.')
    }
    
    setLoading(false)
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const { error } = await updateProfile({
      data: profileForm
    })
    
    if (error) {
      setError(error.message)
    } else {
      setMessage('Perfil atualizado com sucesso!')
      setIsEditing(false)
    }
    
    setLoading(false)
  }

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      setError(error.message)
    } else {
      setMessage('Logout realizado com sucesso!')
    }
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-black dark:bg-white text-white dark:text-black px-6 py-4">
              <div className="flex items-center space-x-3">
                <User className="w-6 h-6" />
                <h1 className="text-2xl font-bold">Minha Conta</h1>
              </div>
            </div>

            <div className="p-6">
              {/* User Info */}
              <div className="mb-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {user.user_metadata?.firstName} {user.user_metadata?.lastName}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Informações do Perfil
                    </h3>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="btn-secondary text-sm"
                    >
                      {isEditing ? 'Cancelar' : 'Editar'}
                    </button>
                  </div>

                  <form onSubmit={handleUpdateProfile}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nome
                        </label>
                        <input
                          type="text"
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                          disabled={!isEditing}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Sobrenome
                        </label>
                        <input
                          type="text"
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                          disabled={!isEditing}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="input bg-gray-100 dark:bg-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                          disabled={!isEditing}
                          className="input"
                        />
                      </div>
                    </div>
                    
                    {isEditing && (
                      <div className="mt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn-primary"
                        >
                          {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="btn-primary flex items-center justify-center"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Painel de Administração
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="btn-secondary flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair da Conta
                </button>
              </div>

              {/* Messages */}
              {message && (
                <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg">
                  {message}
                </div>
              )}
              {error && (
                <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-black dark:bg-white text-white dark:text-black px-6 py-4">
            <div className="flex items-center justify-center space-x-3">
              {isLogin ? (
                <>
                  <LogIn className="w-6 h-6" />
                  <h1 className="text-2xl font-bold">Entrar</h1>
                </>
              ) : (
                <>
                  <UserPlus className="w-6 h-6" />
                  <h1 className="text-2xl font-bold">Criar Conta</h1>
                </>
              )}
            </div>
          </div>

          <div className="p-6">
            {/* Toggle */}
            <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  isLogin
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  !isLogin
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Criar Conta
              </button>
            </div>

            {/* Login Form */}
            {isLogin && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      required
                      className="input pl-10"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      required
                      className="input pl-10"
                      placeholder="Sua senha"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </form>
            )}

            {/* Register Form */}
            {!isLogin && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={registerForm.firstName}
                      onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
                      required
                      className="input"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sobrenome
                    </label>
                    <input
                      type="text"
                      value={registerForm.lastName}
                      onChange={(e) => setRegisterForm({...registerForm, lastName: e.target.value})}
                      required
                      className="input"
                      placeholder="Seu sobrenome"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                      required
                      className="input pl-10"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                      required
                      className="input pl-10"
                      placeholder="Sua senha"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                      required
                      className="input pl-10"
                      placeholder="Confirme sua senha"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary"
                >
                  {loading ? 'Criando conta...' : 'Criar Conta'}
                </button>
              </form>
            )}

            {/* Messages */}
            {message && (
              <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg">
                {message}
              </div>
            )}
            {error && (
              <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account 