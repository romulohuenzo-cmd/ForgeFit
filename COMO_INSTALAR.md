# 📱 ForgeFit — Como Instalar no Celular, Tablet e PC

## Opção 1: Deploy no Vercel (Recomendado — 3 minutos)

### Passo 1: Suba para o GitHub
```bash
cd forgefit-pwa
git init
git add .
git commit -m "ForgeFit PWA v1"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/forgefit.git
git push -u origin main
```

### Passo 2: Deploy no Vercel
1. Acesse https://vercel.com e faça login com GitHub
2. Clique "Add New Project"
3. Selecione o repositório "forgefit"
4. Framework: **Vite**
5. Clique "Deploy"
6. Em ~1 minuto você terá uma URL tipo: `https://forgefit.vercel.app`

### Passo 3: Instalar no Celular
- **iPhone**: Abra a URL no Safari → botão Compartilhar → "Adicionar à Tela de Início"
- **Android**: Abra no Chrome → aparece banner "Instalar app" → toque "Instalar"
- **PC/Mac**: Chrome → ícone de instalar na barra de endereço → "Instalar"

---

## Opção 2: Rodar Local

### Requisitos
- Node.js 18+ instalado

### Passos
```bash
cd forgefit-pwa
npm install
npm run dev
```
Abra http://localhost:5173 no navegador.

Para buildar para produção:
```bash
npm run build
npm run preview
```

---

## Opção 3: Netlify (alternativa ao Vercel)
1. Acesse https://app.netlify.com
2. Arraste a pasta `dist` (após `npm run build`) para o Netlify
3. Pronto — URL gerada automaticamente

---

## 📋 O que funciona offline (PWA)
- ✅ Todas as telas navegáveis
- ✅ Animações e interações
- ✅ Fotos salvas localmente (session)
- ✅ Ícone na tela inicial
- ✅ Splash screen automática
- ❌ Dados não persistem entre sessões (precisa do Supabase para isso)

## 🎨 Personalização
- Cores: edite o objeto `P` no início de `src/App.jsx`
- Dados demo: edite o array `ST` no mesmo arquivo
- Ícone: substitua `public/icon-192.png` e `public/icon-512.png`
