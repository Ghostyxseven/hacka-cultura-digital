# Camada Presentation

Interface do usuário desenvolvida com Next.js 14 (App Router), React e Tailwind CSS.

## 🏗️ Estrutura

```
src/app/
├── layout.tsx              # Layout raiz
├── page.tsx                # Redireciona baseado no role
├── globals.css             # Estilos globais Tailwind
├── (dashboards)/
│   ├── professor/
│   │   ├── layout.tsx      # Layout com sidebar
│   │   ├── page.tsx        # Dashboard professor
│   │   ├── disciplinas/
│   │   │   ├── new/        # Nova Disciplina
│   │   │   └── [id]/       # Detalhes da Disciplina
│   │   ├── unidades/
│   │   │   ├── new/        # Nova Unidade
│   │   │   └── [unitId]/
│   │   │       └── plano/  # Visualização do Plano de Aula
│   │   └── planos/         # Meus Planos
│   └── aluno/
│       ├── layout.tsx      # Layout com header
│       ├── page.tsx        # Dashboard aluno
│       ├── disciplinas/
│       │   └── [id]/       # Detalhes da Disciplina (aluno)
│       └── unidades/
│           └── [unitId]/
│               └── plano/  # Visualização do Plano de Aula
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

- ✅ **Dashboard Professor** (`/professor`) - Dashboard do professor
- ✅ **Dashboard Aluno** (`/aluno`) - Dashboard do aluno
- ✅ **Nova Disciplina** (`/professor/disciplinas/new`) - Criar disciplina
- ✅ **Detalhes da Disciplina** (`/professor/disciplinas/[id]`) - Ver disciplina (professor)
- ✅ **Detalhes da Disciplina** (`/aluno/disciplinas/[id]`) - Ver disciplina (aluno)
- ✅ **Nova Unidade** (`/professor/unidades/new`) - Criar unidade
- ✅ **Plano de Aula** (`/professor/unidades/[unitId]/plano`) - Visualizar plano de aula (professor)
- ✅ **Plano de Aula** (`/aluno/unidades/[unitId]/plano`) - Visualizar plano de aula (aluno)

## 🎨 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **App Router** - Roteamento moderno do Next.js

## 🔗 Integração

A camada Presentation utiliza o `LessonPlanService` da camada Application através do factory em `src/lib/service.ts`.
