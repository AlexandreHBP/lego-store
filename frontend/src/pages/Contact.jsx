import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aqui você implementaria a lógica para enviar o formulário
    console.log('Formulário enviado:', formData)
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Telefone',
      info: '(11) 99999-9999',
      description: 'Segunda a Sexta, 8h às 18h'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      info: 'contato@legostore.com',
      description: 'Resposta em até 24 horas'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Endereço',
      info: 'São Paulo, SP',
      description: 'Av. Paulista, 1000 - Bela Vista'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Horário de Funcionamento',
      info: 'Segunda a Sexta',
      description: '8h às 18h (exceto feriados)'
    }
  ]

  const faqs = [
    {
      question: 'Como faço para rastrear meu pedido?',
      answer: 'Você pode rastrear seu pedido através do código de rastreamento enviado por email ou acessando sua conta no nosso site.'
    },
    {
      question: 'Qual o prazo de entrega?',
      answer: 'O prazo de entrega varia de 2 a 5 dias úteis, dependendo da sua localização e do método de envio escolhido.'
    },
    {
      question: 'Posso cancelar meu pedido?',
      answer: 'Sim, você pode cancelar seu pedido até 24 horas após a confirmação. Entre em contato conosco para solicitar o cancelamento.'
    },
    {
      question: 'Vocês fazem trocas e devoluções?',
      answer: 'Sim, aceitamos trocas e devoluções em até 30 dias após a compra, desde que o produto esteja em perfeitas condições.'
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Entre em <span className="text-white">Contato</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Estamos aqui para ajudar! Entre em contato conosco e responderemos o mais rápido possível.
          </p>
        </div>
      </section>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Informações de Contato */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Informações de Contato
              </h2>
              
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 font-medium">
                        {item.info}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mapa */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Nossa Localização
                </h3>
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    Mapa da Localização
                  </span>
                </div>
              </div>
            </div>

            {/* Formulário de Contato */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Envie uma Mensagem
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assunto *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="Assunto da mensagem"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="input resize-none"
                    placeholder="Digite sua mensagem aqui..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Respostas para as dúvidas mais comuns dos nossos clientes.
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900 dark:bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Precisa de Ajuda Imediata?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Nossa equipe está disponível 24/7 para atender você.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+5511999999999"
              className="btn-primary inline-flex items-center justify-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              Ligar Agora
            </a>
            <a
              href="mailto:contato@legostore.com"
              className="btn-secondary inline-flex items-center justify-center"
            >
              <Mail className="w-5 h-5 mr-2" />
              Enviar Email
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact 