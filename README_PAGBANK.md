# 🚀 Integração PagBank - Setup Rápido

Implementação completa da API de Checkout e Link de Pagamento do PagBank para sua aplicação React + Node.js.

## ⚡ Setup em 5 Minutos

### 1. Configurar Variáveis de Ambiente

```bash
# Backend (.env)
PAGBANK_API_URL=https://api.pagbank.com.br
PAGBANK_CLIENT_ID=seu_client_id
PAGBANK_CLIENT_SECRET=seu_client_secret
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

### 2. Criar Tabela no Supabase

Execute o arquivo `supabase_checkouts_table.sql` no seu projeto Supabase.

### 3. Instalar Dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 4. Iniciar Servidores

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

## 🎯 Funcionalidades Implementadas

- ✅ **Checkout PagBank** - Criação de links de pagamento
- ✅ **Webhooks** - Notificações automáticas de pagamento
- ✅ **Consulta de Status** - Verificação de status de pagamento
- ✅ **Redirecionamento** - Retorno automático após pagamento
- ✅ **Interface React** - Componente de checkout integrado
- ✅ **Banco de Dados** - Persistência no Supabase

## 📁 Arquivos Principais

```
├── backend/
│   ├── routes/payment.js          # API de checkout
│   └── config.env.example         # Variáveis de ambiente
├── frontend/src/
│   ├── components/PagBankCheckout.jsx    # Componente React
│   ├── pages/PaymentSuccess.jsx          # Página de sucesso
│   └── pages/PaymentWithPagBank.jsx      # Exemplo de integração
├── supabase_checkouts_table.sql   # Schema do banco
├── PAGBANK_INTEGRATION.md         # Documentação completa
└── README_PAGBANK.md              # Este arquivo
```

## 🔌 Uso Rápido

### Backend API

```javascript
// Criar checkout
POST /api/payment/checkout
{
  "reference_id": "order_123",
  "items": [...],
  "customer": {...},
  "redirect_url": "https://seusite.com/success"
}

// Consultar status
GET /api/payment/checkout/order_123
```

### Frontend React

```jsx
import PagBankCheckout from './components/PagBankCheckout'

<PagBankCheckout
  cartItems={cartItems}
  total={total}
  onSuccess={(checkout) => {
    window.location.href = checkout.payment_url
  }}
  onError={(error) => console.error(error)}
/>
```

## 🔧 Configuração do PagBank

1. Acesse [developer.pagbank.com.br](https://developer.pagbank.com.br)
2. Crie uma aplicação
3. Configure webhook: `https://seusite.com/api/payment/webhook/pagbank`
4. Obtenha suas credenciais

## 🚀 Deploy

### Vercel (Frontend)
```bash
cd frontend
vercel --prod
```

### Railway/Heroku (Backend)
```bash
cd backend
# Configure variáveis de ambiente
git push heroku main
```

## 📞 Suporte

- 📚 [Documentação Completa](PAGBANK_INTEGRATION.md)
- 🔗 [API PagBank](https://developer.pagbank.com.br/docs/checkout)
- 🐛 [Issues](https://github.com/seu-repo/issues)

---

**✨ Pronto para produção!** A integração segue as melhores práticas da API do PagBank. 