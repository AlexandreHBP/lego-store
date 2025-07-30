# 🏦 Configuração Completa do PagBank

## 📋 **Passo a Passo para Configurar o PagBank**

### **1. Criar Conta no PagBank**

1. **Acesse:** [https://www.pagbank.com.br](https://www.pagbank.com.br)
2. **Clique em:** "Abrir Conta" ou "Cadastre-se"
3. **Preencha:** Seus dados pessoais e empresariais
4. **Verifique:** Seu e-mail e telefone
5. **Aguarde:** Aprovação da conta (pode levar alguns dias)

### **2. Acessar o Portal de Desenvolvedores**

1. **Faça login** na sua conta PagBank
2. **Vá para:** "Desenvolvedores" ou "API"
3. **Clique em:** "Minhas Aplicações" ou "Sandbox"

### **3. Criar Nova Aplicação**

1. **Clique em:** "Nova Aplicação" ou "Criar App"
2. **Preencha:**
   - **Nome:** "Lego Store" ou "Meu E-commerce"
   - **Descrição:** "E-commerce de produtos Lego"
   - **Tipo:** "E-commerce" ou "Loja Online"

### **4. Configurar URLs de Callback**

#### **Para Desenvolvimento:**
```
URL de Sucesso: http://localhost:3000/payment
URL de Cancelamento: http://localhost:3000/cart
URL de Notificação: http://localhost:5000/api/payment/webhook
```

#### **Para Produção (quando estiver online):**
```
URL de Sucesso: https://seudominio.com/payment
URL de Cancelamento: https://seudominio.com/cart
URL de Notificação: https://seudominio.com/api/payment/webhook
```

### **5. Obter Credenciais**

Após criar a aplicação, você receberá:

```env
PAGBANK_CLIENT_ID=seu_client_id_aqui
PAGBANK_CLIENT_SECRET=seu_client_secret_aqui
PAGBANK_ACCESS_TOKEN=seu_access_token_aqui
```

### **6. Configurar Ambiente**

#### **Sandbox (Teste):**
- Use as credenciais de **teste**
- Transações não são reais
- Ideal para desenvolvimento

#### **Produção:**
- Use as credenciais de **produção**
- Transações são reais
- Só use quando estiver pronto

### **7. Atualizar o arquivo .env**

Adicione estas linhas ao seu `backend/.env`:

```env
# Supabase (já deve existir)
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase

# PagBank (ADICIONAR ESTAS LINHAS)
PAGBANK_CLIENT_ID=seu_client_id_do_pagbank
PAGBANK_CLIENT_SECRET=seu_client_secret_do_pagbank
PAGBANK_ACCESS_TOKEN=seu_access_token_do_pagbank

# Server (já deve existir)
PORT=5000
NODE_ENV=development
```

### **8. Testar a Integração**

1. **Reinicie o servidor:**
   ```bash
   npm run dev
   ```

2. **Teste o pagamento:**
   - Adicione produtos ao carrinho
   - Vá para o checkout
   - Preencha os dados
   - Clique em "Finalizar Compra"

### **9. Verificar Logs**

Se houver erros, verifique:
- Credenciais corretas no `.env`
- URLs de callback configuradas
- Servidor rodando na porta 5000
- Frontend rodando na porta 3000

## 🔧 **Solução de Problemas**

### **Erro: "Credenciais inválidas"**
- Verifique se as credenciais estão corretas
- Certifique-se de que a aplicação está ativa no PagBank

### **Erro: "URL de callback inválida"**
- Use `http://localhost:3000` para desenvolvimento
- Use `https://seudominio.com` para produção

### **Erro: "Servidor não responde"**
- Verifique se o backend está rodando na porta 5000
- Confirme se as rotas de pagamento estão funcionando

## 📞 **Suporte PagBank**

- **Email:** suporte@pagbank.com.br
- **Telefone:** 0800 888 8888
- **Chat:** Disponível no site oficial

## 🎯 **Próximos Passos**

1. **Teste em ambiente sandbox**
2. **Configure para produção**
3. **Monitore as transações**
4. **Configure webhooks para notificações**

---

**💡 Dica:** Mantenha suas credenciais seguras e nunca as compartilhe publicamente! 