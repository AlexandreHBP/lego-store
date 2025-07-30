# 🔗 URLs Alternativas para PagBank

## 📋 **Opções de URLs que o PagBank pode aceitar:**

### **Opção 1: URLs com IP Local**
```
✅ URL de Sucesso: http://127.0.0.1:3000/payment
✅ URL de Cancelamento: http://127.0.0.1:3000/cart
✅ URL de Notificação: http://127.0.0.1:5000/api/payment/webhook
```

### **Opção 2: URLs com Domínio Temporário**
```
✅ URL de Sucesso: https://webhook.site/payment
✅ URL de Cancelamento: https://webhook.site/cart
✅ URL de Notificação: https://webhook.site/api/payment/webhook
```

### **Opção 3: URLs com ngrok (se funcionar)**
```
✅ URL de Sucesso: https://[seu-tunnel].ngrok.io/payment
✅ URL de Cancelamento: https://[seu-tunnel].ngrok.io/cart
✅ URL de Notificação: https://[seu-tunnel].ngrok.io/api/payment/webhook
```

### **Opção 4: URLs de Teste do PagBank**
```
✅ URL de Sucesso: https://sandbox.pagbank.com.br/success
✅ URL de Cancelamento: https://sandbox.pagbank.com.br/cancel
✅ URL de Notificação: https://sandbox.pagbank.com.br/webhook
```

## 🎯 **Recomendação:**

**Tente primeiro a Opção 1** com `127.0.0.1` em vez de `localhost`. Muitas vezes o PagBank aceita isso.

## 📝 **Como testar:**

1. **Use as URLs da Opção 1**
2. **Se não aceitar, tente a Opção 2**
3. **Se ainda não aceitar, use a Opção 4**

## 🔧 **Para verificar se o servidor está rodando:**

- **Frontend:** http://127.0.0.1:3000
- **Backend:** http://127.0.0.1:5000/api

## 💡 **Dica:**

Se nenhuma dessas opções funcionar, você pode:
1. **Deixar as URLs em branco** temporariamente
2. **Configurar apenas as credenciais**
3. **Testar a integração básica primeiro** 