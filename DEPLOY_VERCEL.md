# 🚀 Deploy no Vercel - Guia Completo

## 📋 **Pré-requisitos**

1. **Conta no GitHub** (gratuita)
2. **Conta no Vercel** (gratuita)
3. **Projeto configurado** (já está pronto)

## 🔧 **Passo a Passo**

### **1. Criar Repositório no GitHub**

1. **Acesse:** [github.com](https://github.com)
2. **Faça login** na sua conta
3. **Clique em:** "New repository"
4. **Configure:**
   - **Nome:** `lego-store`
   - **Descrição:** `E-commerce de produtos Lego`
   - **Público** (gratuito)
   - **NÃO** inicialize com README

### **2. Subir Código para GitHub**

```bash
# No terminal, na pasta do projeto
git init
git add .
git commit -m "Primeiro commit - E-commerce Lego"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/lego-store.git
git push -u origin main
```

### **3. Conectar ao Vercel**

1. **Acesse:** [vercel.com](https://vercel.com)
2. **Faça login** com sua conta GitHub
3. **Clique em:** "New Project"
4. **Selecione** o repositório `lego-store`
5. **Configure:**
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### **4. Configurar Variáveis de Ambiente**

No Vercel, vá em **Settings > Environment Variables** e adicione:

```env
# Supabase
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase

# PagBank
PAGBANK_CLIENT_ID=seu_client_id_do_pagbank
PAGBANK_CLIENT_SECRET=seu_client_secret_do_pagbank
PAGBANK_ACCESS_TOKEN=seu_access_token_do_pagbank
```

### **5. Configurar Funções do Backend**

1. **Vá em:** Settings > Functions
2. **Configure:**
   - **Runtime:** Node.js 18
   - **Memory:** 1024 MB
   - **Max Duration:** 10s

### **6. Deploy**

1. **Clique em:** "Deploy"
2. **Aguarde** o build (2-3 minutos)
3. **Copie** a URL gerada

## 🌐 **URLs para PagBank**

Após o deploy, use estas URLs:

```
✅ URL de Sucesso: https://seu-projeto.vercel.app/payment
✅ URL de Cancelamento: https://seu-projeto.vercel.app/cart
✅ URL de Notificação: https://seu-projeto.vercel.app/api/payment/webhook
```

## 🔧 **Configurações Importantes**

### **Domínio Personalizado (Opcional):**
1. **Vá em:** Settings > Domains
2. **Adicione** seu domínio
3. **Configure** DNS conforme instruções

### **SSL Automático:**
- **Vercel** fornece SSL gratuito
- **HTTPS** funciona automaticamente

## 📊 **Monitoramento**

### **Analytics:**
- **Vercel Analytics** (gratuito)
- **Performance** em tempo real
- **Erros** e logs

### **Logs:**
- **Function Logs** para backend
- **Build Logs** para frontend

## 🎯 **Próximos Passos**

1. **Teste** o site online
2. **Configure** PagBank com as URLs
3. **Teste** pagamentos reais
4. **Monitore** performance

## 💡 **Dicas**

- **Deploy automático** a cada push no GitHub
- **Preview deployments** para testes
- **Rollback** fácil se algo der errado
- **CDN global** para velocidade

---

**🎉 Seu e-commerce estará online em minutos!** 