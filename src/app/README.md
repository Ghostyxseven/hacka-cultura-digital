# Camada Presentation

Interface do usuário desenvolvida com Next.js 14 (App Router), React e Tailwind CSS.

## 🏗️ Estrutura

```
src/app/
├── layout.tsx              # Layout raiz
├── page.tsx                # Dashboard (Wireframe 1)
├── globals.css             # Estilos globais Tailwind
└── subjects/
    ├── new/                # Nova Disciplina (Wireframe 3)
    └── [id]/               # Detalhes da Disciplina (Wireframe 2)
        ├── page.tsx
        └── units/
            └── new/        # Nova Unidade (Wireframe 4)
└── units/
    └── [id]/
        └── lesson-plan/    # Visualização do Plano de Aula
```

## 🚀 Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Configure a variável de ambiente:
```bash
cp .env.example .env.local
# Edite .env.local e adicione sua chave da API Gemini
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse: http://localhost:3000

## 📄 Páginas Implementadas

- ✅ **Dashboard** (`/`) - Wireframe 1
- ✅ **Nova Disciplina** (`/subjects/new`) - Wireframe 3
- ✅ **Detalhes da Disciplina** (`/subjects/[id]`) - Wireframe 2
- ✅ **Nova Unidade** (`/subjects/[id]/units/new`) - Wireframe 4
- ✅ **Plano de Aula** (`/units/[id]/lesson-plan`)

## 🎨 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **App Router** - Roteamento moderno do Next.js

## 🔗 Integração

A camada Presentation utiliza o `LessonPlanService` da camada Application através do factory em `src/lib/service.ts`.
