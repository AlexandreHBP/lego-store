# Guia de Debug - Problema de Pagamento

## Problema Reportado
O usuário está ficando preso na tela de "processando pagamento" e o pagamento não está sendo confirmado.

## Passos para Debug

### 1. Verificar se o Backend está Rodando

Primeiro, vamos verificar se o backend está funcionando:

```bash
# Na pasta raiz do projeto
cd backend
npm start
```

Você deve ver algo como:
```
Servidor rodando na porta 5000
```

### 2. Testar o Backend

Execute o teste simples:

```bash
# Na pasta raiz do projeto
node test-backend-simple.js
```

Se funcionar, você verá:
```
✅ Servidor está rodando!
Resposta: { success: true, message: "Checkout criado com sucesso", ... }
```

### 3. Testar o Frontend

Agora vamos testar o frontend:

```bash
# Em outro terminal, na pasta raiz
cd frontend
npm run dev
```

### 4. Debug no Navegador

1. Abra o navegador e vá para `http://localhost:5173`
2. Adicione produtos ao carrinho
3. Vá para a página de pagamento
4. **IMPORTANTE**: Abra o Console do navegador (F12)
5. Preencha todos os dados de entrega
6. Clique em "Pagar com PagBank"

### 5. Verificar os Logs

No console do navegador, você deve ver uma sequência de logs como:

```
=== INÍCIO DO CHECKOUT PAGBANK ===
=== PREPARANDO DADOS DO CHECKOUT ===
=== CHAMANDO HOOK CREATE CHECKOUT ===
=== INÍCIO DO CREATE CHECKOUT ===
=== FAZENDO REQUISIÇÃO PARA API ===
=== RESPOSTA DA API RECEBIDA ===
=== CHECKOUT CRIADO COM SUCESSO ===
=== EXECUTANDO CALLBACKS ===
=== TENTANDO REDIRECIONAMENTO ===
```

### 6. Possíveis Problemas e Soluções

#### Problema A: Backend não está rodando
**Sintomas**: Erro de conexão no console
**Solução**: 
```bash
cd backend
npm start
```

#### Problema B: CORS
**Sintomas**: Erro de CORS no console
**Solução**: Verificar se o backend tem CORS configurado corretamente

#### Problema C: Dados faltando
**Sintomas**: Mensagem "Campos faltando: ..."
**Solução**: Preencher todos os campos obrigatórios

#### Problema D: Erro na API
**Sintomas**: Erro 500 ou 400 no console
**Solução**: Verificar logs do backend

#### Problema E: Redirecionamento não funciona
**Sintomas**: Checkout criado mas não redireciona
**Solução**: Verificar se a URL de redirecionamento está correta

### 7. Logs Detalhados

Se você vir algum erro específico, por favor compartilhe:

1. **Logs do Console do Navegador** (F12 → Console)
2. **Logs do Backend** (terminal onde rodou `npm start`)
3. **Screenshot da tela** onde está travado

### 8. Teste Manual da API

Se quiser testar a API diretamente:

```bash
curl -X POST http://localhost:5000/api/payment/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "reference_id": "test_123",
    "items": [{"id": 1, "name": "LEGO", "quantity": 1, "unit_amount": 99.99}],
    "customer": {
      "name": "Teste Cliente",
      "email": "teste@exemplo.com",
      "tax_id": "12345678901",
      "phone": "11999999999",
      "address": {
        "street": "Rua Teste",
        "number": "123",
        "complement": "",
        "locality": "Bairro",
        "city": "São Paulo",
        "region_code": "SP",
        "postal_code": "01234-567"
      }
    },
    "redirect_url": "http://localhost:5173/payment/success"
  }'
```

### 9. Checklist de Verificação

- [ ] Backend está rodando na porta 5000
- [ ] Frontend está rodando na porta 5173
- [ ] Todos os campos de entrega estão preenchidos
- [ ] Console do navegador está aberto (F12)
- [ ] Não há erros de CORS
- [ ] A requisição para `/api/payment/checkout` está sendo feita
- [ ] A resposta da API está correta
- [ ] O redirecionamento está sendo executado

### 10. Próximos Passos

Se você seguir este guia e ainda tiver problemas, por favor:

1. Compartilhe os logs exatos do console do navegador
2. Compartilhe os logs do backend
3. Descreva exatamente onde o processo para
4. Tire um screenshot da tela onde está travado

Isso nos ajudará a identificar exatamente onde está o problema! 