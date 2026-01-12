# 🎓 Sistema Inteligente de Cultura Digital

> **Sistema web para geração automática de materiais didáticos alinhados à BNCC usando Inteligência Artificial Generativa**

**Desenvolvedor:** Micael Cardoso Reis  
**Projeto:** Hackathon de Desenvolvimento de Sistema Inteligente para Geração de Materiais Didáticos  
**Instituição:** IFPI Campus Piripiri - TADS

---

## 📋 Sobre o Projeto

Este projeto consiste em uma aplicação web desenvolvida para o **Hackathon de Desenvolvimento de Sistema Inteligente para Geração de Materiais Didáticos** do IFPI Campus Piripiri. O objetivo é fornecer aos professores do Ensino Fundamental e Médio uma ferramenta capaz de gerar materiais didáticos (planos de aula e atividades) automaticamente, utilizando Inteligência Artificial Generativa alinhada à **Base Nacional Comum Curricular (BNCC)**.

### 🎯 Objetivos

- ✅ Facilitar o planejamento pedagógico dos professores
- ✅ Gerar materiais didáticos alinhados à BNCC
- ✅ Utilizar IA de forma ética e responsável como ferramenta de apoio
- ✅ Demonstrar domínio técnico através de arquitetura limpa e organizada

---

## 🏗️ Arquitetura do Projeto

Para garantir organização, escalabilidade e cumprir os critérios de avaliação de **Organização do Código e Arquitetura**, o sistema foi estruturado em **5 camadas independentes** seguindo os princípios da **Clean Architecture**:

### 📐 Camadas da Arquitetura

```
┌─────────────────────────────────────────┐
│   Presentation (UI/UX)                  │
│   Next.js + Tailwind CSS + React        │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│   Application (Serviços)                │
│   Casos de Uso + Orquestração           │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│   Core (Domain)                          │
│   Entidades + Regras de Negócio          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│   Repository (Persistência)             │
│   LocalStorage (Singleton)               │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│   Infrastructure (IA & RAG)              │
│   Google Gemini API + Validação BNCC    │
└─────────────────────────────────────────┘
```

#### 1. **Presentation (UI/UX)**
- Interface desenvolvida em **Next.js 14** (App Router)
- Estilização com **Tailwind CSS**
- Componentes reutilizáveis e responsivos
- Segue os wireframes sugeridos no edital

#### 2. **Application (Serviços)**
- Orquestra os fluxos de dados e casos de uso
- Implementa todos os requisitos funcionais (RF01-RF05)
- Serviço principal: `LessonPlanService`

#### 3. **Core (Domain)**
- Contém as regras pedagógicas e modelos de dados
- Entidades: `Subject`, `Unit`, `LessonPlan`
- Rigorosamente alinhado à BNCC

#### 4. **Repository (Persistência)**
- Gerencia o armazenamento local via **LocalStorage**
- Implementa padrão **Singleton**
- Atende ao requisito de sistema de usuário único sem autenticação

#### 5. **Infrastructure (IA & RAG)**
- Camada de integração com a API de IA
- Utiliza **Google Gemini API**
- Validação e estruturação de respostas alinhadas à BNCC
- Interface `IAIService` para inversão de dependência

---

## 🚀 Funcionalidades Principais

Conforme os requisitos funcionais (RF) estabelecidos no edital:

### ✅ RF01 - Gestão de Disciplinas
- Cadastro de disciplinas com nome, descrição, cor e ícone
- Associação de disciplinas a séries/anos específicos
- Listagem e exclusão de disciplinas

### ✅ RF02 - Criação Manual de Unidades
- Criação manual de unidades de ensino
- Vinculação de unidades a disciplinas e séries/anos
- Descrição e tópicos personalizados

### ✅ RF03 - Sugestão Automática de Unidades via IA
- Sugestão automática de unidades de ensino usando IA
- Baseada na disciplina e série/ano selecionados
- Quantidade configurável de sugestões

### ✅ RF04/05 - Geração Automática de Materiais
- **Planos de Aula** completos com:
  - Objetivos de aprendizagem
  - Metodologia de ensino
  - Conteúdo programático
  - Recursos didáticos
  - Avaliação formativa
- **Atividades Avaliativas** com:
  - Questões objetivas
  - Gabarito automático
  - Níveis de dificuldade

### 🎓 Diferencial Pedagógico
- Uso ético e responsável da IA como ferramenta de apoio
- Alinhamento automático com a BNCC
- Materiais prontos para uso em sala de aula

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca de interface
- **TypeScript 5.2** - Tipagem estática
- **Tailwind CSS 3.3** - Framework de estilização
- **PostCSS** - Processamento de CSS
- **Autoprefixer** - Prefixos CSS automáticos

### Backend & IA
- **Google Gemini API** (`@google/generative-ai 0.24`) - IA Generativa
- **TypeScript** - Linguagem principal
- **LocalStorage API** - Persistência local (Singleton)

### Notificações
- **react-hot-toast 2.6** - Sistema de notificações toast

### Arquitetura & Padrões
- **Clean Architecture** - Separação de responsabilidades em 5 camadas
- **Singleton Pattern** - Repositório único
- **Dependency Inversion** - Interfaces e abstrações
- **Use Cases** - Casos de uso isolados
- **Factory Pattern** - Criação de serviços
- **Repository Pattern** - Abstração de persistência

### Desenvolvimento
- **Node.js 18+** - Runtime JavaScript
- **npm** - Gerenciador de pacotes

---

## 📦 Instalação e Configuração

### Pré-requisitos

- **Node.js** 18+ e **npm** (ou **yarn**)
- Chave de API do **Google Gemini**

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone https://github.com/Ghostyxseven/hacka-cultura-digital.git
cd hacka-cultura-digital
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure a variável de ambiente:**
```bash
# Crie o arquivo .env.local na raiz do projeto
echo "NEXT_PUBLIC_GEMINI_API_KEY=sua_chave_aqui" > .env.local
```

> **Nota:** Obtenha sua chave de API em: https://makersuite.google.com/app/apikey

4. **Execute o servidor de desenvolvimento:**
```bash
npm run dev
```

5. **Acesse a aplicação:**
```
http://localhost:3000
```

### Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Verificação de código
```

---

## 📁 Estrutura Completa do Projeto

```
hacka-cultura-digital/
├── src/
│   ├── app/                              # Presentation Layer (Next.js App Router)
│   │   ├── (dashboards)/                 # Rotas protegidas por autenticação
│   │   │   ├── admin/                    # Dashboard do administrador
│   │   │   │   └── page.tsx              # Página de administração
│   │   │   ├── aluno/                    # Dashboard do aluno
│   │   │   │   ├── layout.tsx            # Layout com header
│   │   │   │   ├── page.tsx              # Dashboard principal do aluno
│   │   │   │   ├── disciplinas/          # Gestão de disciplinas (visualização)
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx      # Detalhes da disciplina
│   │   │   │   └── unidades/              # Visualização de unidades
│   │   │   │       └── [unitId]/
│   │   │   │           └── plano/
│   │   │   │               └── page.tsx  # Visualização do plano de aula
│   │   │   └── professor/                # Dashboard do professor
│   │   │       ├── layout.tsx            # Layout com sidebar
│   │   │       ├── page.tsx              # Dashboard principal do professor
│   │   │       ├── disciplinas/          # Gestão de disciplinas
│   │   │       │   ├── new/
│   │   │       │   │   └── page.tsx      # Criar nova disciplina
│   │   │       │   └── [id]/
│   │   │       │       └── page.tsx      # Detalhes da disciplina
│   │   │       ├── unidades/              # Gestão de unidades e planos
│   │   │       │   ├── new/
│   │   │       │   │   └── page.tsx      # Criar nova unidade (manual ou IA)
│   │   │       │   └── [unitId]/
│   │   │       │       └── plano/
│   │   │       │           └── page.tsx  # Visualização/geração do plano
│   │   │       └── planos/               # Listagem de planos
│   │   │           └── page.tsx          # Meus planos de aula
│   │   ├── components/                    # Componentes locais da camada app
│   │   │   ├── StatsSection.tsx          # Seção de estatísticas
│   │   │   ├── SubjectCard.tsx           # Card de disciplina
│   │   │   ├── SubjectsList.tsx          # Lista de disciplinas
│   │   │   ├── UnitCard.tsx              # Card de unidade
│   │   │   ├── UnitsList.tsx             # Lista de unidades
│   │   │   └── index.ts                  # Exportações centralizadas
│   │   ├── init-admin/                   # Inicialização do admin
│   │   │   └── page.tsx                  # Página de criação do primeiro admin
│   │   ├── login/                        # Autenticação
│   │   │   └── page.tsx                  # Página de login
│   │   ├── register/                     # Registro
│   │   │   └── page.tsx                  # Página de registro
│   │   ├── layout.tsx                    # Layout raiz da aplicação
│   │   ├── page.tsx                      # Página inicial (redireciona por role)
│   │   ├── globals.css                   # Estilos globais Tailwind
│   │   ├── README.md                     # Documentação da camada Presentation
│   │   └── REFACTORING.md                # Guia de refatoração
│   │
│   ├── application/                      # Application Layer (Regras de Aplicação)
│   │   ├── services/                     # Serviços de orquestração
│   │   │   ├── LessonPlanService.ts      # Serviço principal de planos de aula
│   │   │   └── AuthService.ts             # Serviço de autenticação e usuários
│   │   ├── usecases/                     # Casos de uso (Regras de Negócio - RFs)
│   │   │   ├── CreateSubjectUseCase.ts   # RF01: Criar disciplina
│   │   │   ├── GetSubjectsUseCase.ts     # RF01: Listar disciplinas
│   │   │   ├── GetSubjectByIdUseCase.ts  # RF01: Buscar disciplina por ID
│   │   │   ├── DeleteSubjectUseCase.ts   # RF01: Excluir disciplina
│   │   │   ├── CreateUnitUseCase.ts       # RF02: Criar unidade manualmente
│   │   │   ├── SuggestUnitsUseCase.ts    # RF03: Sugerir unidades via IA
│   │   │   ├── GetUnitsUseCase.ts        # Listar unidades
│   │   │   ├── GetUnitByIdUseCase.ts     # Buscar unidade por ID
│   │   │   ├── DeleteUnitUseCase.ts      # Excluir unidade
│   │   │   ├── GenerateLessonPlanUseCase.ts        # RF04/05: Gerar plano de aula
│   │   │   ├── GenerateLessonPlanForUnitUseCase.ts # RF04/05: Gerar plano para unidade
│   │   │   ├── SaveLessonPlanUseCase.ts  # RF04/05: Salvar plano de aula
│   │   │   ├── GetLessonPlansUseCase.ts  # RF04/05: Listar planos
│   │   │   ├── GetLessonPlanByIdUseCase.ts # RF04/05: Buscar plano por ID
│   │   │   ├── CreateUserUseCase.ts      # Criar usuário
│   │   │   ├── LoginUseCase.ts           # Autenticar usuário
│   │   │   └── UpdateUserUseCase.ts      # Atualizar usuário
│   │   ├── viewmodels/                   # ViewModels (DTOs de Saída)
│   │   │   └── index.ts                  # Exportações de ViewModels
│   │   ├── mappers/                      # Mappers (Entidade -> ViewModel)
│   │   │   └── PresentationMapper.ts     # Mapeamento de entidades para apresentação
│   │   ├── index.ts                      # Exportações públicas da camada
│   │   └── README.md                     # Documentação da camada Application
│   │
│   ├── core/                             # Core Layer (Domínio Puro)
│   │   ├── constants/                    # Constantes do domínio
│   │   │   ├── SchoolYears.ts            # Constantes de anos escolares
│   │   │   └── StorageKeys.ts            # Chaves do LocalStorage
│   │   ├── entities/                     # Entidades de domínio
│   │   │   ├── LessonPlan.ts             # Entidade Plano de Aula
│   │   │   ├── Subject.ts                # Entidade Disciplina
│   │   │   ├── Unit.ts                   # Entidade Unidade de Ensino
│   │   │   └── User.ts                   # Entidade Usuário
│   │   └── repositories/                 # Interfaces de repositório (Portas)
│   │       ├── ILessonRepository.ts      # Interface do repositório de planos
│   │       └── IUserRepository.ts        # Interface do repositório de usuários
│   │
│   ├── repository/                       # Repository Layer (Infrastructure)
│   │   └── implementations/              # Implementações concretas
│   │       ├── LocalStorageRepository.ts # Repositório LocalStorage (Singleton)
│   │       └── LocalStorageUserRepository.ts # Repositório de usuários
│   │
│   ├── infrastructure/                   # Infrastructure Layer (Serviços Externos)
│   │   ├── ai/                           # Serviços de IA
│   │   │   ├── IAIService.ts             # Interface do serviço de IA
│   │   │   ├── GeminiService.ts          # Implementação Google Gemini
│   │   │   └── GeminiServiceWithRAG.ts   # Implementação com RAG
│   │   └── rag/                          # Sistema RAG (Retrieval Augmented Generation)
│   │       ├── IRAGService.ts             # Interface do serviço RAG
│   │       ├── SimpleRAGService.ts        # Implementação simples de RAG
│   │       ├── knowledge/                 # Base de conhecimento
│   │       │   ├── BNCCKnowledge.ts      # Conhecimento da BNCC
│   │       │   └── MECGuidelines.ts      # Diretrizes do MEC
│   │       ├── README.md                 # Documentação do RAG
│   │       └── README.md                 # Documentação do RAG
│   │
│   ├── components/                       # Componentes React reutilizáveis (Shared)
│   │   ├── auth/                         # Componentes de autenticação
│   │   │   └── ProtectedRoute.tsx        # Rota protegida
│   │   ├── layout/                       # Componentes de layout
│   │   │   ├── Header.tsx                # Header padrão
│   │   │   ├── HeaderWithAuth.tsx        # Header com autenticação
│   │   │   └── PageContainer.tsx         # Container de página responsivo
│   │   ├── ui/                           # Componentes de UI
│   │   │   ├── Button.tsx                # Botão reutilizável
│   │   │   ├── Input.tsx                 # Input de formulário
│   │   │   ├── Textarea.tsx              # Textarea de formulário
│   │   │   ├── Select.tsx                # Select de formulário
│   │   │   ├── Loading.tsx               # Estado de carregamento
│   │   │   ├── EmptyState.tsx            # Estado vazio
│   │   │   └── StatCard.tsx              # Card de estatísticas
│   │   └── index.ts                      # Exportações centralizadas
│   │
│   ├── contexts/                         # Contextos React
│   │   └── AuthContext.tsx               # Contexto de autenticação
│   │
│   ├── hooks/                            # Custom hooks (Adapters de Apresentação)
│   │   ├── useSubjects.ts                # Hook para gerenciar disciplinas
│   │   ├── useUnits.ts                   # Hook para gerenciar unidades
│   │   ├── useFormValidation.ts          # Hook para validação de formulários
│   │   └── index.ts                      # Exportações centralizadas
│   │
│   ├── lib/                              # Composition Root e Factories
│   │   ├── service.ts                    # Factory de serviços (Injeção de Dependência)
│   │   ├── authService.ts                # Factory de autenticação
│   │   └── initAdmin.ts                  # Inicialização do admin
│   │
│   └── utils/                            # Funções auxiliares
│       ├── dateUtils.ts                  # Utilitários de data
│       └── notifications.ts              # Utilitários de notificações
│
├── package.json                          # Dependências e scripts
├── package-lock.json                     # Lock file das dependências
├── tsconfig.json                         # Configuração TypeScript
├── tailwind.config.js                   # Configuração Tailwind CSS
├── postcss.config.js                    # Configuração PostCSS
├── next.config.js                        # Configuração Next.js
├── next-env.d.ts                        # Tipos do Next.js
└── README.md                             # Este arquivo
```

---

## 📊 Organização do Git (Branches)

O desenvolvimento é segmentado por camadas para demonstrar domínio técnico sobre a solução:

| Branch | Descrição |
|--------|-----------|
| `layer/core` | Modelagem pedagógica e entidades de domínio |
| `layer/repository` | Implementação de persistência local |
| `layer/infrastructure` | Integração com IA e lógica de validação |
| `layer/application` | Lógica de fluxo, casos de uso e serviços |
| `layer/presentation` | UI e componentes visuais baseados nos wireframes |
| `main` | Versão estável integrada para deploy e avaliação |

### Estratégia de Commits

- Commits seguem o padrão **Conventional Commits**
- Cada camada desenvolvida em sua respectiva branch
- Merge para `main` apenas após validação completa

---

## 🎨 Interface do Usuário

### Páginas Implementadas

#### Páginas Públicas
- ✅ **Login** (`/login`) - Autenticação de usuários
- ✅ **Registro** (`/register`) - Cadastro de novos alunos
- ✅ **Inicialização Admin** (`/init-admin`) - Criação do primeiro administrador

#### Dashboard do Professor (`/professor`)
- ✅ **Dashboard Principal** (`/professor`) - Visão geral com estatísticas
- ✅ **Nova Disciplina** (`/professor/disciplinas/new`) - Cadastro de disciplinas
- ✅ **Detalhes da Disciplina** (`/professor/disciplinas/[id]`) - Visualização e gerenciamento
- ✅ **Nova Unidade** (`/professor/unidades/new`) - Criação manual ou via IA
- ✅ **Plano de Aula** (`/professor/unidades/[unitId]/plano`) - Visualização/geração completa
- ✅ **Meus Planos** (`/professor/planos`) - Listagem de todos os planos

#### Dashboard do Aluno (`/aluno`)
- ✅ **Dashboard Principal** (`/aluno`) - Visão geral das disciplinas
- ✅ **Detalhes da Disciplina** (`/aluno/disciplinas/[id]`) - Visualização da disciplina
- ✅ **Plano de Aula** (`/aluno/unidades/[unitId]/plano`) - Visualização do plano

#### Dashboard do Admin (`/admin`)
- ✅ **Painel Administrativo** (`/admin`) - Gerenciamento de usuários

### Componentes Reutilizáveis

#### Componentes de Layout
- **Header** - Cabeçalho padrão com navegação
- **HeaderWithAuth** - Cabeçalho com informações de autenticação
- **PageContainer** - Container responsivo para páginas

#### Componentes de UI
- **Button** - Botão com variantes (primary, secondary, success, danger)
- **Input** - Campo de entrada de texto
- **Textarea** - Campo de texto multilinha
- **Select** - Campo de seleção
- **Loading** - Indicador de carregamento
- **EmptyState** - Estado vazio com mensagens customizáveis
- **StatCard** - Card de estatísticas

#### Componentes de Autenticação
- **ProtectedRoute** - Rota protegida por autenticação

#### Componentes Locais (app/components)
- **StatsSection** - Seção de estatísticas do dashboard
- **SubjectCard** - Card de disciplina
- **SubjectsList** - Lista de disciplinas
- **UnitCard** - Card de unidade
- **UnitsList** - Lista de unidades

### Hooks Customizados

- **useSubjects** - Gerencia estado e carregamento de disciplinas
- **useUnits** - Gerencia estado e carregamento de unidades
- **useFormValidation** - Validação de formulários

### Wireframes

A interface segue os wireframes sugeridos no edital do hackathon, garantindo:
- Navegação intuitiva
- Design responsivo
- Acessibilidade
- Experiência de usuário otimizada

---

## 📊 Entidades do Domínio

### Subject (Disciplina)
```typescript
interface Subject {
  id: string;
  name: string;                    // Ex: Matemática, História, Cultura Digital
  description?: string;            // Breve descrição da disciplina
  color?: string;                  // Para usar no CSS/Tailwind (ex: 'blue-500')
  icon?: string;                  // Nome do ícone (ex: 'book', 'monitor')
  gradeYears?: SchoolYear[];      // Séries/anos associados à disciplina
  createdAt: Date;
}
```

### Unit (Unidade de Ensino)
```typescript
interface Unit {
  id: string;
  subjectId: string;              // ID da disciplina à qual pertence
  gradeYear: SchoolYear;          // Ano/série escolar
  topic: string;                 // Tema da unidade/aula
  description?: string;           // Descrição opcional da unidade
  lessonPlanId?: string;         // ID do plano de aula gerado
  activityId?: string;           // ID da atividade avaliativa gerada
  isSuggestedByAI: boolean;       // Indica se foi sugerida automaticamente
  createdAt: Date;
  updatedAt?: Date;
}
```

### LessonPlan (Plano de Aula)
```typescript
interface LessonPlan {
  id: string;
  title: string;                  // Tema da unidade
  subject: string;                // Disciplina
  gradeYear: SchoolYear;          // Ano escolar tipado
  unitId?: string;                // ID da unidade à qual pertence
  objectives: string[];           // Objetivos de aprendizagem
  methodology: string;           // Como o professor deve aplicar a aula
  duration: string;               // Tempo estimado
  bnccCompetencies: string[];     // Códigos/Descrições da BNCC
  content: string;                // Desenvolvimento do conteúdo
  quiz: QuizQuestion[];           // Atividade avaliativa estruturada
  metadata: {
    aiModel: string;              // Qual IA gerou
    promptVersion: string;         // Versão das instruções
    isFavorite: boolean;          // Campo para UI
  };
  createdAt: Date;
}
```

### User (Usuário)
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;              // Em produção seria hash
  role: UserRole;                // 'admin' | 'professor' | 'aluno'
  professorId?: string;         // Para alunos: ID do professor
  subjects?: string[];           // Para professores: IDs das disciplinas
  createdAt: Date;
  updatedAt?: Date;
}
```

### SchoolYear (Ano Escolar)
```typescript
type SchoolYear = 
  | '6º Ano' | '7º Ano' | '8º Ano' | '9º Ano' 
  | '1º Ano EM' | '2º Ano EM' | '3º Ano EM';
```

## 🎯 Casos de Uso Implementados

### Gestão de Disciplinas (RF01)
- ✅ **CreateSubjectUseCase** - Criar nova disciplina
- ✅ **GetSubjectsUseCase** - Listar todas as disciplinas
- ✅ **GetSubjectByIdUseCase** - Buscar disciplina por ID
- ✅ **DeleteSubjectUseCase** - Excluir disciplina

### Gestão de Unidades
- ✅ **CreateUnitUseCase** - Criar unidade manualmente (RF02)
- ✅ **SuggestUnitsUseCase** - Sugerir unidades via IA (RF03)
- ✅ **GetUnitsUseCase** - Listar unidades
- ✅ **GetUnitByIdUseCase** - Buscar unidade por ID
- ✅ **DeleteUnitUseCase** - Excluir unidade

### Geração de Planos de Aula (RF04/05)
- ✅ **GenerateLessonPlanUseCase** - Gerar plano de aula usando IA
- ✅ **GenerateLessonPlanForUnitUseCase** - Gerar plano para unidade específica
- ✅ **SaveLessonPlanUseCase** - Salvar ou atualizar plano
- ✅ **GetLessonPlansUseCase** - Listar planos de aula
- ✅ **GetLessonPlanByIdUseCase** - Buscar plano por ID

### Autenticação e Usuários
- ✅ **CreateUserUseCase** - Criar novo usuário
- ✅ **LoginUseCase** - Autenticar usuário
- ✅ **UpdateUserUseCase** - Atualizar dados do usuário

## 🔧 Uso da API

### Exemplo: Gerar Plano de Aula

```typescript
import { getLessonPlanService } from '@/lib/service';

const service = getLessonPlanService();

// Gerar plano de aula para uma unidade
const lessonPlan = await service.generateLessonPlanForUnit(unitId);

// Ou gerar diretamente
const plan = await service.generateLessonPlan(
  "Matemática",
  "Equações do 2º grau",
  "8º Ano"
);
```

### Exemplo: Criar Disciplina

```typescript
const subject = await service.createSubject(
  "Matemática",
  "Disciplina de matemática para ensino fundamental",
  "blue-500",
  "calculator",
  ["6º Ano", "7º Ano", "8º Ano", "9º Ano"]
);
```

### Exemplo: Sugerir Unidades via IA

```typescript
const units = await service.suggestUnits(
  subjectId,
  "8º Ano",
  5 // quantidade de sugestões
);
```

### Exemplo: Autenticação

```typescript
import { getAuthService } from '@/lib/authService';

const authService = getAuthService();

// Login
const user = authService.login('email@example.com', 'senha123');

// Registrar aluno
const aluno = authService.registerAluno(
  'João Silva',
  'joao@example.com',
  'senha123',
  professorId
);

// Registrar professor (apenas admin)
const professor = authService.registerProfessor(
  'Maria Santos',
  'maria@example.com',
  'senha123'
);
```

---

## ✅ Requisitos Funcionais Atendidos

| RF | Descrição | Status |
|----|-----------|--------|
| **RF01** | Gestão de Disciplinas | ✅ Completo |
| **RF02** | Criação Manual de Unidades | ✅ Completo |
| **RF03** | Sugestão Automática de Unidades via IA | ✅ Completo |
| **RF04** | Geração Automática de Planos de Aula | ✅ Completo |
| **RF05** | Geração Automática de Atividades Avaliativas | ✅ Completo |

---

## 🤖 Sistema RAG (Retrieval Augmented Generation)

O projeto implementa um sistema RAG para enriquecer a geração de planos de aula com contexto relevante da BNCC e diretrizes do MEC.

### Componentes RAG

1. **IRAGService** - Interface para serviços de RAG
2. **SimpleRAGService** - Implementação com busca textual
3. **BNCCKnowledge** - Base de conhecimento da BNCC (Competência 5: Cultura Digital)
4. **MECGuidelines** - Diretrizes do MEC sobre Cultura Digital
5. **GeminiServiceWithRAG** - Serviço de IA integrado com RAG

### Fluxo RAG

```
1. Usuário solicita geração de plano de aula
   ↓
2. SimpleRAGService recupera contexto relevante (BNCC/MEC)
   ↓
3. GeminiServiceWithRAG enriquece o prompt com contexto recuperado
   ↓
4. Google Gemini API gera plano de aula alinhado com BNCC/MEC
   ↓
5. Plano de aula validado e retornado
```

### Benefícios

- ✅ **Alinhamento BNCC**: Garante que os planos seguem diretrizes oficiais
- ✅ **Contexto Relevante**: Enriquece prompts com conhecimento específico
- ✅ **Qualidade Pedagógica**: Melhora qualidade do material gerado
- ✅ **Transparência**: Base de conhecimento explícita e auditável

### Melhorias Futuras

- Embeddings vetoriais para busca semântica
- Vector Store (Pinecone, Weaviate, Chroma)
- Chunking inteligente de documentos
- Re-ranking de resultados por relevância

> 📚 Para mais detalhes, consulte: [Documentação RAG](./src/infrastructure/rag/README.md)

## 🔐 Sistema de Autenticação

O sistema implementa autenticação com três tipos de usuários:

### Tipos de Usuário

- **Admin** - Gerenciamento completo do sistema
- **Professor** - Criação de disciplinas, unidades e planos de aula
- **Aluno** - Visualização de disciplinas e planos de aula

### Funcionalidades

- ✅ Login e registro
- ✅ Proteção de rotas por role
- ✅ Contexto de autenticação (AuthContext)
- ✅ Gerenciamento de usuários (apenas admin)
- ✅ Associação aluno-professor

### Inicialização

O primeiro acesso ao sistema permite criar o usuário administrador através da rota `/init-admin`.

## 🧪 Validações e Qualidade

- ✅ **TypeScript** - Tipagem estática em todo o projeto
- ✅ **Validação de Entrada** - Todos os casos de uso validam dados
- ✅ **Tratamento de Erros** - Mensagens descritivas e tratamento adequado
- ✅ **Alinhamento BNCC** - Validação de séries/anos e conteúdo pedagógico
- ✅ **Código Limpo** - Seguindo princípios SOLID e Clean Architecture
- ✅ **Separação de Responsabilidades** - Cada camada com responsabilidade única
- ✅ **Inversão de Dependência** - Interfaces e abstrações
- ✅ **Testabilidade** - Código preparado para testes unitários

---

## 📝 Licença

Este projeto foi desenvolvido para o **Hackathon de Desenvolvimento de Sistema Inteligente para Geração de Materiais Didáticos** do IFPI Campus Piripiri.

---

## 👤 Desenvolvedor

**Micael Cardoso Reis**  
Curso: **TADS - IFPI Piripiri**

---

## 🙏 Agradecimentos

- IFPI Campus Piripiri pela oportunidade
- Google Gemini pela API de IA Generativa
- Comunidade Next.js e React pelo ecossistema

---

## 📦 Constantes e Utilitários

### Constantes do Domínio

- **SchoolYears** - Lista de anos escolares válidos:
  - `'6º Ano'`, `'7º Ano'`, `'8º Ano'`, `'9º Ano'`
  - `'1º Ano EM'`, `'2º Ano EM'`, `'3º Ano EM'`
- **StorageKeys** - Chaves utilizadas no LocalStorage

### Utilitários

- **dateUtils** - Funções auxiliares para manipulação de datas
- **notifications** - Sistema de notificações padronizado:
  - `showSuccess()` - Notificação de sucesso
  - `showError()` - Notificação de erro
  - `showInfo()` - Notificação informativa

## 🔄 Injeção de Dependência

O projeto utiliza um sistema de injeção de dependência através do arquivo `src/lib/service.ts`, que atua como **Composition Root**:

- Cria instâncias únicas (Singleton) dos repositórios
- Instancia serviços de IA
- Injeta dependências nos casos de uso
- Fornece instância única do `LessonPlanService`

### Factory Pattern

```typescript
// src/lib/service.ts
export function getLessonPlanService(): LessonPlanService {
  // Singleton pattern
  // Injeção manual de dependências
  // Composition Root
}
```

## 📊 Padrões de Design Implementados

1. **Singleton** - Repositórios e serviços principais
2. **Factory** - Criação de serviços (`getLessonPlanService`, `getAuthService`)
3. **Repository** - Abstração de persistência
4. **Use Case** - Casos de uso isolados e testáveis
5. **Dependency Injection** - Inversão de dependências
6. **Strategy** - Diferentes implementações de IA (com/sem RAG)

## 🎓 Alinhamento com BNCC

O sistema garante alinhamento com a **Base Nacional Comum Curricular** através de:

- ✅ Validação de anos escolares tipados
- ✅ Base de conhecimento BNCC no sistema RAG
- ✅ Competências da BNCC incluídas nos planos de aula
- ✅ Foco na Competência 5: Cultura Digital
- ✅ Diretrizes do MEC integradas

## 📚 Documentação Adicional

### Documentação por Camada

- [📖 Documentação da Camada Application](./src/application/README.md)
  - Casos de uso implementados
  - Serviços de orquestração
  - Exemplos de uso

- [📖 Documentação da Camada Presentation](./src/app/README.md)
  - Estrutura de páginas
  - Componentes locais
  - Rotas implementadas

- [📖 Guia de Refatoração](./src/app/REFACTORING.md)
  - Melhorias implementadas
  - Componentes reutilizáveis
  - Redução de código duplicado

- [📖 Documentação do Sistema RAG](./src/infrastructure/rag/README.md)
  - Arquitetura RAG
  - Como usar
  - Melhorias futuras

### Estrutura de Arquivos Importantes

- `src/lib/service.ts` - Composition Root e Factory
- `src/lib/authService.ts` - Factory de autenticação
- `src/contexts/AuthContext.tsx` - Contexto de autenticação
- `src/core/constants/SchoolYears.ts` - Constantes de anos escolares

## 🚀 Próximos Passos

### Melhorias Sugeridas

1. **Testes**
   - Testes unitários para casos de uso
   - Testes de integração para serviços
   - Testes E2E para fluxos principais

2. **RAG Avançado**
   - Implementação com embeddings vetoriais
   - Vector database para armazenamento
   - Busca semântica mais precisa

3. **UI/UX**
   - Skeletons em vez de "Carregando..."
   - Error Boundary para tratamento global
   - Melhorias de acessibilidade

4. **Performance**
   - Cache de buscas RAG
   - Otimização de re-renderizações
   - Lazy loading de componentes

5. **Backend**
   - API REST para persistência
   - Autenticação JWT
   - Banco de dados (PostgreSQL/MongoDB)

---

**Desenvolvido com ❤️ para facilitar o trabalho dos professores brasileiros**

**Desenvolvedor:** Micael Cardoso Reis  
**Curso:** TADS - IFPI Campus Piripiri  
**Projeto:** Hackathon de Desenvolvimento de Sistema Inteligente para Geração de Materiais Didáticos
