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
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de estilização
- **Shadcn/ui** - Componentes UI reutilizáveis

### Backend & IA
- **Google Gemini API** - IA Generativa
- **TypeScript** - Linguagem principal
- **LocalStorage API** - Persistência local

### Arquitetura & Padrões
- **Clean Architecture** - Separação de responsabilidades
- **Singleton Pattern** - Repositório único
- **Dependency Inversion** - Interfaces e abstrações
- **Use Cases** - Casos de uso isolados

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

## 📁 Estrutura do Projeto

```
hacka-cultura-digital/
├── src/
│   ├── app/                    # Presentation Layer (Next.js)
│   │   ├── page.tsx            # Dashboard
│   │   ├── subjects/           # Páginas de disciplinas
│   │   └── units/              # Páginas de unidades
│   │
│   ├── application/            # Application Layer
│   │   ├── services/           # Serviços de orquestração
│   │   └── usecases/           # Casos de uso (RF01-RF05)
│   │
│   ├── core/                   # Core Layer (Domain)
│   │   └── entities/           # Entidades de domínio
│   │
│   ├── repository/             # Repository Layer
│   │   ├── ILessonRepository.ts
│   │   └── implementations/
│   │       └── LocalStorageRepository.ts
│   │
│   ├── infrastructure/         # Infrastructure Layer
│   │   └── ai/
│   │       ├── IAIService.ts
│   │       └── GeminiService.ts
│   │
│   ├── components/             # Componentes React reutilizáveis
│   ├── hooks/                  # Custom hooks
│   ├── constants/              # Constantes do sistema
│   ├── lib/                    # Utilitários e factories
│   └── utils/                  # Funções auxiliares
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
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

- ✅ **Dashboard** (`/`) - Visão geral de disciplinas e unidades
- ✅ **Nova Disciplina** (`/subjects/new`) - Cadastro de disciplinas
- ✅ **Detalhes da Disciplina** (`/subjects/[id]`) - Visualização e gerenciamento
- ✅ **Nova Unidade** (`/subjects/[id]/units/new`) - Criação manual ou via IA
- ✅ **Plano de Aula** (`/units/[id]/lesson-plan`) - Visualização completa

### Wireframes

A interface segue os wireframes sugeridos no edital do hackathon, garantindo:
- Navegação intuitiva
- Design responsivo
- Acessibilidade
- Experiência de usuário otimizada

---

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
const subject = service.createSubject(
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

## 🧪 Validações e Qualidade

- ✅ **TypeScript** - Tipagem estática em todo o projeto
- ✅ **Validação de Entrada** - Todos os casos de uso validam dados
- ✅ **Tratamento de Erros** - Mensagens descritivas e tratamento adequado
- ✅ **Alinhamento BNCC** - Validação de séries/anos e conteúdo pedagógico
- ✅ **Código Limpo** - Seguindo princípios SOLID e Clean Architecture

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

## 📚 Documentação Adicional

- [Documentação da Camada Application](./src/application/README.md)
- [Documentação da Camada Presentation](./src/app/README.md)
- [Guia de Refatoração](./src/app/REFACTORING.md)

---

**Desenvolvido com ❤️ para facilitar o trabalho dos professores brasileiros**
