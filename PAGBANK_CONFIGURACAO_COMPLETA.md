# 🏦 Configuração Completa do PagBank

## 📋 Pré-requisitos

1. **Conta PagBank Business** - Você precisa ter uma conta empresarial no PagBank
2. **Acesso ao Portal do PagBank** - Para obter as credenciais da API
3. **Domínio configurado** - Para webhooks (pode usar ngrok para desenvolvimento)

## 🔧 Passo a Passo da Configuração

### 1. Obter Credenciais do PagBank

**Acesse:** https://portal.pagbank.com.br

1. **Faça login** na sua conta PagBank Business
2. **Vá para:** Configurações > API
3. **Crie uma nova aplicação** ou use uma existente
4. **Anote as credenciais:**
   - `Client ID`
   - `Client Secret`
   - `Access Token`

### 2. Configurar Variáveis de Ambiente

**Crie um arquivo `.env` na pasta `backend/`:**

```env
# Supabase Configuration
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_do_supabase

# PagBank Configuration
PAGBANK_API_URL=https://api.pagbank.com.br
PAGBANK_CLIENT_ID=seu_client_id_do_pagbank
PAGBANK_CLIENT_SECRET=seu_client_secret_do_pagbank
PAGBANK_ACCESS_TOKEN=seu_access_token_do_pagbank

# Application URLs
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3001

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=sua_chave_jwt_secreta
```

### 3. Configurar Webhooks (Opcional para Produção)

**Para receber notificações de pagamento:**

1. **No Portal PagBank:** Configurações > Webhooks
2. **Adicione URL:** `https://seu-dominio.com/api/payment/webhook/pagbank`
3. **Eventos:** `PAYMENT_RECEIVED`, `PAYMENT_CONFIRMED`

### 4. Ativar API Real do PagBank

**Modifique o arquivo `backend/routes/payment.js`:**

```javascript
// Descomente esta função para usar API real
const getPagBankToken = async () => {
  try {
    const response = await fetch(`${PAGBANK_API_URL}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.PAGBANK_CLIENT_ID}:${process.env.PAGBANK_CLIENT_SECRET}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    })

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Erro ao obter token do PagBank:', error)
    throw error
  }
}

// Substitua a função mockada pela real
const createPagBankCheckout = async (checkoutData, accessToken) => {
  try {
    const response = await fetch(`${PAGBANK_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        reference_id: checkoutData.reference_id,
        customer: checkoutData.customer,
        items: checkoutData.items,
        charges: [{
          amount: {
            value: Math.round(checkoutData.total_amount * 100),
            currency: 'BRL'
          },
          payment_method: {
            type: 'CREDIT_CARD'
          }
        }],
        notification_urls: [checkoutData.redirect_url]
      })
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao criar checkout PagBank:', error)
    throw error
  }
}
```

## 🧪 Testando a Configuração

### 1. Teste de Conexão

```bash
# No terminal, na pasta backend
node -e "
const fetch = require('node-fetch');
fetch('https://api.pagbank.com.br/oauth2/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + Buffer.from('SEU_CLIENT_ID:SEU_CLIENT_SECRET').toString('base64')
  },
  body: 'grant_type=client_credentials'
})
.then(res => res.json())
.then(data => console.log('Token:', data))
.catch(err => console.error('Erro:', err))
"
```

### 2. Teste do Checkout

1. **Inicie o backend:** `node server.js`
2. **Inicie o frontend:** `npm run dev`
3. **Teste um pagamento** no navegador
4. **Verifique os logs** no terminal do backend

## 🔍 Troubleshooting

### Erro: "Invalid credentials"
- Verifique se `PAGBANK_CLIENT_ID` e `PAGBANK_CLIENT_SECRET` estão corretos
- Confirme se a conta PagBank está ativa

### Erro: "API endpoint not found"
- Verifique se `PAGBANK_API_URL` está correto
- Confirme se você tem permissão para usar a API

### Erro: "Webhook failed"
- Verifique se a URL do webhook está acessível
- Use ngrok para desenvolvimento: `ngrok http 5000`

## 📞 Suporte

- **PagBank API Docs:** https://docs.pagbank.com.br
- **Portal PagBank:** https://portal.pagbank.com.br
- **Suporte PagBank:** 0800 777 0000

## 🚀 Próximos Passos

1. **Configure as credenciais reais**
2. **Teste com valores pequenos**
3. **Configure webhooks para produção**
4. **Implemente logs detalhados**
5. **Configure monitoramento**

---

**⚠️ IMPORTANTE:** Nunca compartilhe suas credenciais do PagBank. Mantenha o arquivo `.env` seguro e nunca o commite no Git. 