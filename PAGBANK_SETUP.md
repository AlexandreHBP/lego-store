# Configuração do PagBank para E-commerce

## 📋 Pré-requisitos

1. **Conta PagBank**: Crie uma conta no [PagBank](https://www.pagbank.com.br/)
2. **Acesso à API**: Solicite acesso à API do PagBank
3. **Credenciais**: Obtenha suas credenciais de desenvolvimento e produção

## 🔧 Configuração

### 1. Credenciais do PagBank

Você precisará das seguintes credenciais:

```env
PAGBANK_CLIENT_ID=seu_client_id_aqui
PAGBANK_CLIENT_SECRET=seu_client_secret_aqui
PAGBANK_ACCESS_TOKEN=seu_access_token_aqui
```

### 2. Como obter as credenciais

1. **Acesse o Portal do PagBank**
   - Vá para [https://portal.pagbank.com.br](https://portal.pagbank.com.br)
   - Faça login na sua conta

2. **Configure sua aplicação**
   - Vá para "Desenvolvedores" > "Minhas Aplicações"
   - Crie uma nova aplicação
   - Configure as URLs de callback

3. **Obtenha as credenciais**
   - Client ID: Disponível na página da aplicação
   - Client Secret: Gere um novo secret
   - Access Token: Use o endpoint de OAuth2

### 3. Configuração do Backend

1. **Atualize o arquivo `.env`**:
```env
# PagBank Configuration
PAGBANK_CLIENT_ID=seu_client_id
PAGBANK_CLIENT_SECRET=seu_client_secret
PAGBANK_ACCESS_TOKEN=seu_access_token
```

2. **Instale as dependências**:
```bash
cd backend
npm install
```

### 4. Configuração do Supabase

Execute o seguinte SQL no seu projeto Supabase:

```sql
-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
  payment_method VARCHAR(20) NOT NULL,
  shipping_address JSONB,
  items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de segurança
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

## 🚀 Testando a Integração

### 1. Cartões de Teste

Para testar pagamentos com cartão de crédito, use:

- **Número**: 4111111111111111
- **Validade**: 12/25
- **CVV**: 123
- **Nome**: Qualquer nome

### 2. PIX

Para testar pagamentos PIX:
- O sistema gerará automaticamente um QR Code
- Use o app do seu banco para escanear

## 📊 Endpoints da API

### Processar Pagamento
```
POST /api/payment/process
```

**Body:**
```json
{
  "orderData": {
    "orderNumber": "ABC123",
    "userId": "user-uuid",
    "items": [...],
    "total": 150.00,
    "shipping": 15.99
  },
  "paymentData": {
    "firstName": "João",
    "lastName": "Silva",
    "email": "joao@email.com",
    "phone": "(11) 99999-9999",
    "address": "Rua das Flores, 123",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567",
    "paymentMethod": "credit",
    "cardNumber": "4111111111111111",
    "cardName": "JOAO SILVA",
    "cardExpiry": "12/25",
    "cardCvv": "123"
  }
}
```

### Verificar Status do Pedido
```
GET /api/payment/status/:orderNumber
```

## 🔒 Segurança

1. **HTTPS**: Sempre use HTTPS em produção
2. **Validação**: Todos os dados são validados no backend
3. **Criptografia**: Dados sensíveis são criptografados
4. **RLS**: Row Level Security ativo no Supabase

## 🐛 Solução de Problemas

### Erro de Autenticação
- Verifique se as credenciais estão corretas
- Confirme se o Access Token não expirou

### Erro de Pagamento
- Verifique se os dados do cartão estão corretos
- Confirme se o valor está em centavos
- Verifique se o endereço está completo

### Erro de Conexão
- Verifique se a API do PagBank está acessível
- Confirme se as URLs estão corretas

## 📞 Suporte

- **PagBank**: [https://dev.pagbank.com.br](https://dev.pagbank.com.br)
- **Documentação**: [https://dev.pagbank.com.br/docs](https://dev.pagbank.com.br/docs)
- **Suporte**: [https://suporte.pagbank.com.br](https://suporte.pagbank.com.br) 