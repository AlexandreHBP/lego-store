# Integração PagBank - Checkout e Link de Pagamento

Este documento descreve a implementação completa da integração com a API de Checkout e Link de Pagamento do PagBank.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Configuração](#configuração)
3. [Estrutura do Código](#estrutura-do-código)
4. [API Endpoints](#api-endpoints)
5. [Componentes Frontend](#componentes-frontend)
6. [Exemplos de Uso](#exemplos-de-uso)
7. [Webhooks](#webhooks)
8. [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

A integração implementa:

- ✅ **Backend Node.js/Express** com rotas para checkout
- ✅ **Frontend React** com componente de checkout
- ✅ **Autenticação Bearer Token** do PagBank
- ✅ **Webhooks** para notificações de pagamento
- ✅ **Consulta de status** de checkouts
- ✅ **Redirecionamento** após pagamento
- ✅ **Banco de dados Supabase** para persistência

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` no backend com as seguintes variáveis:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# PagBank Configuration
PAGBANK_API_URL=https://api.pagbank.com.br
PAGBANK_CLIENT_ID=your_pagbank_client_id
PAGBANK_CLIENT_SECRET=your_pagbank_client_secret
PAGBANK_ACCESS_TOKEN=your_pagbank_access_token

# Application URLs
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

### 2. Configuração do PagBank

1. Acesse o [Portal do Desenvolvedor PagBank](https://developer.pagbank.com.br)
2. Crie uma aplicação e obtenha suas credenciais
3. Configure as URLs de redirecionamento e webhook
4. Obtenha o token de acesso

### 3. Banco de Dados

Execute o script SQL para criar a tabela de checkouts:

```sql
-- Execute o arquivo supabase_checkouts_table.sql no seu projeto Supabase
```

## 🏗️ Estrutura do Código

### Backend (`/backend`)

```
backend/
├── routes/
│   └── payment.js          # Rotas de pagamento e checkout
├── config/
│   └── supabase.js         # Configuração do Supabase
├── server.js               # Servidor Express
└── package.json
```

### Frontend (`/frontend`)

```
frontend/src/
├── components/
│   └── PagBankCheckout.jsx # Componente de checkout
├── pages/
│   ├── Payment.jsx         # Página de pagamento
│   └── PaymentSuccess.jsx  # Página de sucesso
└── App.jsx                 # Rotas da aplicação
```

## 🔌 API Endpoints

### 1. Criar Checkout

**POST** `/api/payment/checkout`

**Request Body:**
```json
{
  "reference_id": "order_123456789",
  "items": [
    {
      "id": "1",
      "name": "Produto Exemplo",
      "quantity": 2,
      "unit_amount": 29.99
    }
  ],
  "customer": {
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "tax_id": "12345678901",
    "phone": "11999999999",
    "address": {
      "street": "Rua das Flores",
      "number": "123",
      "complement": "Apto 45",
      "locality": "Centro",
      "city": "São Paulo",
      "region_code": "SP",
      "postal_code": "01234-567"
    }
  },
  "redirect_url": "https://seusite.com/payment/success"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Checkout criado com sucesso",
  "checkout": {
    "id": "pagbank_order_id",
    "reference_id": "order_123456789",
    "payment_url": "https://checkout.pagbank.com.br/pay/...",
    "status": "pending",
    "total_amount": 59.98
  }
}
```

### 2. Consultar Status

**GET** `/api/payment/checkout/:reference_id`

**Response:**
```json
{
  "success": true,
  "checkout": {
    "reference_id": "order_123456789",
    "status": "paid",
    "total_amount": 59.98,
    "created_at": "2024-01-15T10:30:00Z",
    "customer_data": {...},
    "items": [...]
  }
}
```

### 3. Webhook

**POST** `/api/payment/webhook/pagbank`

Recebe notificações do PagBank sobre mudanças de status de pagamento.

## 🎨 Componentes Frontend

### PagBankCheckout

Componente React para integração com checkout do PagBank:

```jsx
import PagBankCheckout from '../components/PagBankCheckout'

// Uso
<PagBankCheckout
  cartItems={cartItems}
  total={total}
  onSuccess={(checkout) => console.log('Checkout criado:', checkout)}
  onError={(error) => console.error('Erro:', error)}
/>
```

### PaymentSuccess

Página que exibe o status do pagamento após retorno do PagBank:

```jsx
// Acessível em /payment/success?reference_id=order_123
```

## 📝 Exemplos de Uso

### 1. Integração na Página de Pagamento

```jsx
import PagBankCheckout from '../components/PagBankCheckout'

const Payment = () => {
  const { cartItems, getCartSubtotal } = useCart()
  const total = getCartSubtotal()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Formulário de dados do cliente */}
      <div>
        {/* Seu formulário existente */}
      </div>
      
      {/* Checkout PagBank */}
      <PagBankCheckout
        cartItems={cartItems}
        total={total}
        onSuccess={(checkout) => {
          // Redirecionar para PagBank
          window.location.href = checkout.payment_url
        }}
        onError={(error) => {
          // Tratar erro
          console.error('Erro no checkout:', error)
        }}
      />
    </div>
  )
}
```

### 2. Chamada da API

```javascript
// Criar checkout
const createCheckout = async (orderData) => {
  const response = await fetch('/api/payment/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  })
  
  const result = await response.json()
  
  if (result.success) {
    // Redirecionar para PagBank
    window.location.href = result.checkout.payment_url
  }
}

// Verificar status
const checkStatus = async (referenceId) => {
  const response = await fetch(`/api/payment/checkout/${referenceId}`)
  const result = await response.json()
  
  if (result.success) {
    console.log('Status:', result.checkout.status)
  }
}
```

## 🔄 Webhooks

### Configuração

1. Configure a URL do webhook no portal do PagBank:
   ```
   https://seusite.com/api/payment/webhook/pagbank
   ```

2. O webhook recebe notificações sobre:
   - `PAYMENT_RECEIVED`: Pagamento recebido
   - `PAYMENT_CONFIRMED`: Pagamento confirmado

### Processamento

O webhook automaticamente:
- Atualiza o status do checkout no banco
- Cria pedido quando pagamento é confirmado
- Registra logs para auditoria

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de autenticação**
   - Verifique as credenciais do PagBank
   - Confirme se o token está válido

2. **Link de pagamento não encontrado**
   - Verifique se a resposta do PagBank contém `links[].rel = "PAY"`
   - Confirme se o payload está correto

3. **Webhook não recebido**
   - Verifique se a URL está configurada corretamente
   - Confirme se o endpoint está acessível publicamente

4. **Erro de CORS**
   - Configure o CORS no backend
   - Verifique as origens permitidas

### Logs Úteis

```javascript
// Backend
console.log('PagBank API Response:', data)
console.log('Webhook received:', req.body)

// Frontend
console.log('Checkout response:', result)
console.log('Payment URL:', result.checkout.payment_url)
```

## 📚 Recursos Adicionais

- [Documentação PagBank](https://developer.pagbank.com.br/docs/checkout)
- [API Reference](https://developer.pagbank.com.br/v1/reference)
- [Webhooks Guide](https://developer.pagbank.com.br/docs/webhooks)

## 🔒 Segurança

- ✅ Tokens armazenados em variáveis de ambiente
- ✅ Validação de dados de entrada
- ✅ HTTPS obrigatório em produção
- ✅ Sanitização de dados
- ✅ Logs de auditoria

## 🚀 Deploy

### Vercel (Frontend)

```bash
cd frontend
vercel --prod
```

### Railway/Heroku (Backend)

```bash
cd backend
# Configure as variáveis de ambiente
git push heroku main
```

### Variáveis de Produção

```env
PAGBANK_API_URL=https://api.pagbank.com.br
BASE_URL=https://seu-backend.herokuapp.com
FRONTEND_URL=https://seu-frontend.vercel.app
```

---

**Nota:** Esta integração segue as melhores práticas da API do PagBank e está pronta para uso em produção. 