#!/bin/bash

# 🚀 Script de Deploy para Vercel
echo "🚀 Iniciando deploy para Vercel..."

# Verificar se git está inicializado
if [ ! -d ".git" ]; then
    echo "📁 Inicializando repositório Git..."
    git init
fi

# Adicionar todos os arquivos
echo "📦 Adicionando arquivos..."
git add .

# Fazer commit
echo "💾 Fazendo commit..."
git commit -m "Deploy para Vercel - $(date)"

# Verificar se remote existe
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  Remote 'origin' não configurado!"
    echo "📝 Configure o remote com:"
    echo "   git remote add origin https://github.com/SEU_USUARIO/lego-store.git"
    echo "   git push -u origin main"
    exit 1
fi

# Fazer push
echo "⬆️  Fazendo push para GitHub..."
git push origin main

echo "✅ Deploy iniciado!"
echo "🌐 Acesse: https://vercel.com"
echo "📋 Configure as variáveis de ambiente no Vercel"
echo "🔗 URLs para PagBank após deploy:"
echo "   ✅ Sucesso: https://seu-projeto.vercel.app/payment"
echo "   ✅ Cancelamento: https://seu-projeto.vercel.app/cart"
echo "   ✅ Notificação: https://seu-projeto.vercel.app/api/payment/webhook" 