# Lego Store - E-commerce com React e Node.js

Uma loja online completa com tema claro/escuro, construída com React, Tailwind CSS e Node.js.

## 🚀 Características

- **Frontend Moderno**: React 18 com Vite
- **Design Responsivo**: Tailwind CSS com tema claro/escuro
- **Backend Robusto**: Node.js com Express
- **Interface Intuitiva**: Navegação fluida e UX otimizada
- **Tema Dinâmico**: Alternância entre modo claro e escuro
- **API RESTful**: Endpoints bem estruturados
- **Autenticação**: Sistema de login/registro com Supabase
- **Sistema de Conta**: Página de perfil com edição de dados

## 📁 Estrutura do Projeto

```
lego-store/
├── frontend/                 # Aplicação React
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── contexts/        # Contextos React
│   │   ├── pages/          # Páginas da aplicação
│   │   └── ...
│   ├── package.json
│   └── ...
├── backend/                  # API Node.js
│   ├── routes/             # Rotas da API
│   ├── server.js           # Servidor principal
│   └── package.json
├── package.json             # Scripts principais
└── README.md
```

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool rápida
- **Tailwind CSS** - Framework CSS utilitário
- **React Router** - Roteamento
- **Lucide React** - Ícones
- **Context API** - Gerenciamento de estado

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Supabase** - Autenticação e banco de dados
- **CORS** - Cross-origin resource sharing
- **Helmet** - Segurança

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd lego-store
```

### 2. Instale as dependências
```bash
# Instalar dependências principais
npm install

# Instalar dependências do frontend
cd frontend && npm install

# Instalar dependências do backend
cd ../backend && npm install

# Voltar para a raiz
cd ..
```

### 3. Configure as variáveis de ambiente

#### Backend
Crie um arquivo `.env` na pasta `backend/`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Frontend URL for password reset
FRONTEND_URL=http://localhost:3000
```

#### Frontend
Crie um arquivo `.env` na pasta `frontend/`:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Execute o projeto

#### Opção 1: Executar tudo junto
```bash
npm run dev
```

#### Opção 2: Executar separadamente

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Acesse a aplicação
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## 📋 Funcionalidades

### Frontend
- ✅ Página inicial com produtos em destaque
- ✅ Catálogo de produtos com filtros
- ✅ Detalhes do produto com galeria
- ✅ Carrinho de compras
- ✅ Tema claro/escuro
- ✅ Design responsivo
- ✅ Navegação intuitiva

### Backend
- ✅ API RESTful completa
- ✅ Autenticação JWT
- ✅ CRUD de produtos
- ✅ Sistema de pedidos
- ✅ Formulário de contato
- ✅ Validações de dados
- ✅ Tratamento de erros

## 🔧 Scripts Disponíveis

### Raiz do Projeto
```bash
npm run dev              # Executa frontend e backend
npm run dev:frontend     # Executa apenas o frontend
npm run dev:backend      # Executa apenas o backend
npm run build            # Build do frontend
npm run install:all      # Instala todas as dependências
```

### Frontend
```bash
npm run dev              # Servidor de desenvolvimento
npm run build            # Build para produção
npm run preview          # Preview do build
npm run lint             # Linting do código
```

### Backend
```bash
npm run dev              # Servidor de desenvolvimento
npm start                # Servidor de produção
```

## 🌐 Endpoints da API

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Buscar produto específico
- `GET /api/products/categories` - Listar categorias
- `GET /api/products/featured` - Produtos em destaque

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário logado
- `POST /api/auth/logout` - Logout
- `POST /api/auth/reset-password` - Redefinir senha
- `PUT /api/auth/profile` - Atualizar perfil

### Pedidos
- `GET /api/orders` - Listar pedidos
- `GET /api/orders/:id` - Buscar pedido específico
- `POST /api/orders` - Criar pedido
- `PUT /api/orders/:id/status` - Atualizar status

### Contato
- `POST /api/contact` - Enviar mensagem
- `GET /api/contact` - Listar mensagens (admin)
- `GET /api/contact/stats` - Estatísticas

## 🎨 Tema Claro/Escuro

O projeto inclui um sistema completo de tema com:
- Alternância automática baseada na preferência do sistema
- Persistência da escolha do usuário
- Transições suaves entre temas
- Cores otimizadas para ambos os modos

## 📱 Responsividade

O design é totalmente responsivo com breakpoints para:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)
- Large Desktop (1280px+)

## 🔒 Segurança

- **Helmet**: Headers de segurança
- **CORS**: Configuração adequada
- **Supabase**: Autenticação segura
- **Validação**: Dados validados no backend

## 🔧 Configuração do Supabase

### 1. Criar projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Aguarde a configuração inicial

### 2. Obter credenciais
1. No dashboard do projeto, vá em **Settings** > **API**
2. Copie a **URL** e **anon key**
3. Configure as variáveis de ambiente conforme seção anterior

### 3. Configurar autenticação
1. No dashboard, vá em **Authentication** > **Settings**
2. Configure as URLs de redirecionamento:
   - `http://localhost:3000/account`
   - `http://localhost:3000/reset-password`
3. Ative o email de confirmação se desejar

### 4. Testar a integração
1. Configure as variáveis de ambiente
2. Execute o projeto
3. Acesse `/account` para testar login/registro

## 🚀 Deploy

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Upload da pasta dist/
```

### Backend (Heroku/Railway)
```bash
cd backend
# Configurar variáveis de ambiente
# Deploy via Git
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Se você tiver alguma dúvida ou problema, abra uma issue no repositório.

---

**Desenvolvido com ❤️ usando React, Tailwind CSS e Node.js** 