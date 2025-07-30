import { Users, Award, Target, Heart } from 'lucide-react'

const About = () => {
  const stats = [
    { number: '10K+', label: 'Clientes Satisfeitos' },
    { number: '500+', label: 'Produtos Disponíveis' },
    { number: '50+', label: 'Cidades Atendidas' },
    { number: '24/7', label: 'Suporte Disponível' }
  ]

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Qualidade',
      description: 'Comprometimento com a excelência em todos os nossos produtos e serviços.'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Inovação',
      description: 'Sempre buscando novas soluções e tecnologias para melhorar a experiência do cliente.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Confiança',
      description: 'Construindo relacionamentos duradouros baseados na transparência e honestidade.'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Excelência',
      description: 'Dedicação total para superar as expectativas dos nossos clientes.'
    }
  ]

  const team = [
    {
      name: 'João Silva',
      role: 'CEO & Fundador',
      image: 'https://via.placeholder.com/200x200/000000/FFFFFF?text=JS',
      bio: 'Mais de 15 anos de experiência no mercado de e-commerce.'
    },
    {
      name: 'Maria Santos',
      role: 'Diretora de Marketing',
      image: 'https://via.placeholder.com/200x200/000000/FFFFFF?text=MS',
      bio: 'Especialista em estratégias digitais e experiência do cliente.'
    },
    {
      name: 'Pedro Costa',
      role: 'Diretor de Tecnologia',
      image: 'https://via.placeholder.com/200x200/000000/FFFFFF?text=PC',
      bio: 'Desenvolvedor experiente com foco em soluções inovadoras.'
    },
    {
      name: 'Ana Oliveira',
      role: 'Diretora de Operações',
      image: 'https://via.placeholder.com/200x200/000000/FFFFFF?text=AO',
      bio: 'Especialista em logística e gestão de supply chain.'
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sobre a <span className="text-white">Lego Store</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Somos uma empresa comprometida em oferecer produtos de qualidade e uma experiência excepcional aos nossos clientes.
          </p>
        </div>
      </section>

      {/* História */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Nossa História
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Fundada em 2020, a Lego Store nasceu da paixão por oferecer produtos de qualidade e uma experiência de compra excepcional. Começamos como uma pequena loja local e hoje somos uma das principais referências em e-commerce no Brasil.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Nossa missão é conectar pessoas a produtos incríveis, oferecendo não apenas qualidade, mas também confiança e transparência em todas as nossas transações.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Ao longo dos anos, construímos uma base sólida de clientes fiéis, sempre mantendo nossos valores de qualidade, inovação e compromisso com a excelência.
              </p>
            </div>
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 text-lg">
                Imagem da História
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Números que Falam
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Nossos resultados mostram o compromisso com a excelência e a confiança dos nossos clientes.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Nossos Valores
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Princípios que guiam todas as nossas ações e decisões.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Nossa Equipe
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Conheça os profissionais dedicados que fazem a Lego Store acontecer.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Missão e Visão */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Nossa Missão
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Oferecer produtos de qualidade excepcional, proporcionando uma experiência de compra única e satisfatória, sempre priorizando a satisfação e confiança dos nossos clientes.
              </p>
            </div>
            
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Nossa Visão
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Ser a principal referência em e-commerce no Brasil, reconhecida pela excelência no atendimento, qualidade dos produtos e inovação constante em nossas soluções.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About 