# 📊 Análise Completa da Camada Presentation (`src/app`)

## 📋 Visão Geral

A camada `src/app` é a **Presentation Layer** do projeto, implementada com **Next.js 14** usando o **App Router**. Esta camada é responsável por toda a interface do usuário, roteamento e interação com o usuário.

---

## 🏗️ Estrutura de Diretórios

```
src/app/
├── (dashboards)/          # Rotas protegidas por autenticação
│   ├── admin/             # Dashboard do administrador
│   ├── aluno/             # Dashboard do aluno
│   └── professor/         # Dashboard do professor
├── components/            # Componentes locais da camada app
├── init-admin/            # Inicialização do primeiro admin
├── login/                 # Página de login
├── register/              # Página de registro
├── layout.tsx             # Layout raiz da aplicação
├── page.tsx               # Página inicial (redireciona por role)
├── globals.css            # Estilos globais Tailwind
├── README.md              # Documentação da camada
└── REFACTORING.md         # Guia de refatoração
```

---

## 📄 Arquivos Principais

### 1. `layout.tsx` - Layout Raiz
- **Responsabilidade**: Configuração global da aplicação
- **Funcionalidades**:
  - Configuração de metadados (title, description)
  - Provider de autenticação (`AuthProvider`)
  - Sistema de notificações (`react-hot-toast`)
  - Estilos globais

**Características**:
- ✅ Configuração de toast notifications customizada
- ✅ Idioma português (pt-BR)
- ✅ Background e cores personalizadas

### 2. `page.tsx` - Página Inicial
- **Responsabilidade**: Redirecionamento baseado no role do usuário
- **Funcionalidades**:
  - Verifica autenticação
  - Redireciona para dashboard apropriado:
    - Admin → `/admin`
    - Professor → `/professor`
    - Aluno → `/aluno`
    - Não autenticado → `/login`

**Características**:
- ✅ Client Component (`'use client'`)
- ✅ Loading state durante verificação
- ✅ Proteção de rotas implícita

### 3. `globals.css` - Estilos Globais
- **Responsabilidade**: Configuração base do Tailwind CSS
- **Funcionalidades**:
  - Variáveis CSS customizadas
  - Cores base (foreground/background)
  - Utilities customizadas (text-balance)

**Características**:
- ✅ Cores neutras para evitar problemas de contraste
- ✅ Sem dark mode (removido para evitar bugs)

---

## 🔐 Páginas de Autenticação

### 1. `/login` - Login
**Arquivo**: `login/page.tsx`

**Funcionalidades**:
- ✅ Validação de formulário (email e senha)
- ✅ Integração com `AuthContext`
- ✅ Tratamento de erros
- ✅ Link para registro
- ✅ Design moderno com gradientes

**Validações**:
- Email obrigatório e formato válido
- Senha obrigatória (mínimo 4 caracteres)

### 2. `/register` - Registro de Aluno
**Arquivo**: `register/page.tsx`

**Funcionalidades**:
- ✅ Cadastro de novos alunos
- ✅ Seleção de professor
- ✅ Validação completa de formulário
- ✅ Verificação de email duplicado
- ✅ Confirmação de senha

**Validações**:
- Nome (mínimo 3 caracteres)
- Email válido e único
- Senha (mínimo 4 caracteres)
- Confirmação de senha
- Professor obrigatório

**Características Especiais**:
- ⚠️ Alerta se não houver professores cadastrados
- ✅ Desabilita formulário se não houver professores

### 3. `/init-admin` - Inicialização do Admin
**Arquivo**: `init-admin/page.tsx`

**Funcionalidades**:
- ✅ Criação automática do primeiro administrador
- ✅ Redirecionamento para login após criação
- ✅ Exibição de credenciais padrão

**Credenciais Padrão**:
- Email: `micael@admin.com`
- Senha: `123456`

---

## 🎯 Dashboards

### 1. Dashboard do Professor (`/professor`)

#### Layout (`professor/layout.tsx`)
- **Sidebar fixa** com navegação
- **Informações do usuário** no topo
- **Menu de navegação**:
  - Dashboard
  - Nova Disciplina
  - Meus Planos
- **Botão de logout** no rodapé

#### Página Principal (`professor/page.tsx`)
**Funcionalidades**:
- ✅ Estatísticas (Disciplinas, Unidades, Planos)
- ✅ Listagem de disciplinas com contagem de unidades
- ✅ Listagem de unidades recentes (5 mais recentes)
- ✅ Ações de exclusão (disciplinas e unidades)
- ✅ Links para criação de nova disciplina

**Componentes Utilizados**:
- `StatsSection` - Estatísticas
- `SubjectsList` - Lista de disciplinas
- `UnitsList` - Lista de unidades
- `EmptyState` - Estado vazio

#### Páginas do Professor

**`/professor/disciplinas/new`** - Nova Disciplina
- Formulário completo de criação
- Validação com `useFormValidation`
- Seleção de séries/anos (checkboxes)
- Campos opcionais (descrição, cor, ícone)

**`/professor/disciplinas/[id]`** - Detalhes da Disciplina
- Visualização da disciplina
- Listagem de unidades da disciplina
- Criação de novas unidades (manual ou IA)

**`/professor/unidades/new`** - Nova Unidade
- Criação manual de unidade
- Sugestão automática via IA
- Seleção de disciplina e série/ano

**`/professor/unidades/[unitId]/plano`** - Plano de Aula
- Visualização do plano de aula
- Geração de plano se não existir
- Atividades avaliativas

**`/professor/planos`** - Meus Planos
- Listagem de todos os planos de aula
- Filtros e busca

### 2. Dashboard do Aluno (`/aluno`)

#### Layout (`aluno/layout.tsx`)
- **Header fixo** com informações do usuário
- **Botão de logout** no header
- **Design mais simples** (sem sidebar)

#### Página Principal (`aluno/page.tsx`)
**Funcionalidades**:
- ✅ Informações do professor associado
- ✅ Listagem de disciplinas disponíveis
- ✅ Listagem de planos de aula disponíveis
- ✅ Apenas visualização (sem edição)

**Características**:
- Filtra apenas unidades com planos de aula gerados
- Mostra contagem de unidades por disciplina
- Design focado em visualização

#### Páginas do Aluno

**`/aluno/disciplinas/[id]`** - Detalhes da Disciplina
- Visualização da disciplina
- Listagem de unidades com planos

**`/aluno/unidades/[unitId]/plano`** - Plano de Aula
- Visualização completa do plano
- Apenas leitura (sem edição)

### 3. Dashboard do Admin (`/admin`)

#### Página Principal (`admin/page.tsx`)
**Funcionalidades**:
- ✅ Estatísticas de usuários
- ✅ Cadastro de professores
- ✅ Listagem de professores e alunos
- ✅ Edição de usuários
- ✅ Exclusão de usuários (com validações)

**Validações Especiais**:
- ⚠️ Não permite excluir professor com alunos associados
- ✅ Validação de email único
- ✅ Atualização de senha opcional

**Características**:
- Formulário de cadastro expansível
- Formulário de edição inline
- Cards de usuários com ações hover
- Contagem de alunos por professor

---

## 🧩 Componentes Locais (`app/components`)

### 1. `StatsSection.tsx`
- **Propósito**: Exibe seção de estatísticas
- **Props**: Array de estatísticas (title, value)
- **Layout**: Grid responsivo (1 coluna mobile, 3 colunas desktop)

### 2. `SubjectCard.tsx`
- **Propósito**: Card de disciplina reutilizável
- **Funcionalidades**:
  - Exibição de nome, descrição
  - Contagem de unidades (opcional)
  - Ações de exclusão (opcional)
  - Link para detalhes (baseado no role)
  - Confirmação de exclusão (2 cliques)

**Características**:
- ✅ Responsivo ao tipo de usuário (aluno/professor)
- ✅ Hover effects
- ✅ Confirmação de exclusão com UI

### 3. `SubjectsList.tsx`
- **Propósito**: Lista de disciplinas
- **Funcionalidades**:
  - Grid responsivo (1/2/3 colunas)
  - Integração com `SubjectCard`
  - Estado vazio customizável
  - Contagem de unidades por disciplina

### 4. `UnitCard.tsx`
- **Propósito**: Card de unidade reutilizável
- **Funcionalidades**:
  - Exibição de tópico, série, descrição
  - Badge de origem (IA ou manual)
  - Ações: Gerar Plano, Ver Plano, Excluir
  - Link para plano de aula
  - Confirmação de exclusão

**Características**:
- ✅ Badge visual para unidades sugeridas por IA
- ✅ Botão condicional (Gerar/Ver Plano)
- ✅ Responsivo ao tipo de usuário

### 5. `UnitsList.tsx`
- **Propósito**: Lista de unidades
- **Funcionalidades**:
  - Lista vertical de unidades
  - Integração com `UnitCard`
  - Estado vazio customizável
  - Suporte a ações de geração e exclusão

### 6. `index.ts` - Exportações Centralizadas
- Exporta todos os componentes locais
- Facilita imports: `import { SubjectCard } from '@/app/components'`

---

## 🎨 Design e UX

### Padrões de Design

1. **Cores e Gradientes**:
   - Gradientes suaves (primary-50, blue-50)
   - Hover effects com transições
   - Bordas e sombras consistentes

2. **Componentes Visuais**:
   - Cards com bordas arredondadas (`rounded-xl`)
   - Sombras suaves (`shadow-lg`, `hover:shadow-xl`)
   - Transições suaves (`transition-all duration-200`)

3. **Responsividade**:
   - Grid adaptativo (1/2/3 colunas)
   - Mobile-first approach
   - Breakpoints Tailwind (md, lg)

4. **Feedback Visual**:
   - Estados de loading
   - Estados vazios com mensagens
   - Notificações toast
   - Confirmações de ações destrutivas

### Acessibilidade

- ✅ Labels descritivos
- ✅ Placeholders informativos
- ✅ Mensagens de erro claras
- ✅ Contraste adequado
- ✅ Navegação por teclado

---

## 🔄 Integração com Outras Camadas

### 1. Application Layer
- **Serviços**: `getLessonPlanService()`, `getAuthService()`
- **ViewModels**: `SubjectViewModel`, `UnitViewModel`
- **Mappers**: `PresentationMapper`

### 2. Core Layer
- **Entidades**: `Subject`, `Unit`, `LessonPlan`, `User`
- **Constantes**: `SCHOOL_YEARS`
- **Tipos**: `SchoolYear`, `UserRole`

### 3. Shared Components
- **UI Components**: `Button`, `Input`, `Select`, `Textarea`, `Loading`, `EmptyState`, `StatCard`
- **Layout Components**: `PageContainer`, `Header`, `HeaderWithAuth`
- **Auth Components**: `ProtectedRoute`

### 4. Hooks Customizados
- `useSubjects` - Gerenciamento de disciplinas
- `useUnits` - Gerenciamento de unidades
- `useFormValidation` - Validação de formulários
- `useAuth` - Contexto de autenticação

### 5. Utilitários
- `notifications` - `showSuccess`, `showError`
- `dateUtils` - Manipulação de datas

---

## ✅ Boas Práticas Implementadas

### 1. Organização
- ✅ Separação clara de responsabilidades
- ✅ Componentes reutilizáveis
- ✅ Exportações centralizadas
- ✅ Estrutura de pastas lógica

### 2. Código Limpo
- ✅ TypeScript com tipagem forte
- ✅ Validação de formulários
- ✅ Tratamento de erros
- ✅ Loading states

### 3. UX/UI
- ✅ Feedback visual adequado
- ✅ Estados vazios informativos
- ✅ Confirmações para ações destrutivas
- ✅ Design responsivo

### 4. Segurança
- ✅ Proteção de rotas por role
- ✅ Validação de entrada
- ✅ Sanitização de dados

---

## 📊 Estatísticas da Camada

### Arquivos
- **Total de páginas**: ~15 páginas
- **Componentes locais**: 5 componentes
- **Layouts**: 3 layouts (root, professor, aluno)

### Funcionalidades
- ✅ Autenticação completa
- ✅ 3 dashboards (admin, professor, aluno)
- ✅ CRUD de disciplinas
- ✅ CRUD de unidades
- ✅ Geração de planos de aula
- ✅ Gerenciamento de usuários (admin)

---

## 🚀 Melhorias Futuras Sugeridas

### 1. Performance
- [ ] Lazy loading de componentes
- [ ] Code splitting por rota
- [ ] Otimização de re-renderizações

### 2. UX
- [ ] Skeletons em vez de "Carregando..."
- [ ] Animações de transição entre páginas
- [ ] Breadcrumbs para navegação

### 3. Funcionalidades
- [ ] Busca e filtros avançados
- [ ] Paginação de listas
- [ ] Exportação de planos (PDF)

### 4. Acessibilidade
- [ ] ARIA labels completos
- [ ] Navegação por teclado melhorada
- [ ] Suporte a leitores de tela

---

## 📝 Conclusão

A camada `src/app` está bem estruturada e organizada, seguindo as melhores práticas do Next.js 14 e React. A separação de responsabilidades é clara, os componentes são reutilizáveis e a experiência do usuário é polida.

**Pontos Fortes**:
- ✅ Arquitetura limpa e organizada
- ✅ Componentes reutilizáveis
- ✅ Validação robusta
- ✅ Design moderno e responsivo
- ✅ Integração adequada com outras camadas

**Áreas de Melhoria**:

### 1. Componentes Mais Granulares

#### Problemas Identificados:

**a) `SubjectCard.tsx` - Múltiplas Responsabilidades**
- ❌ Mistura lógica de exibição com lógica de exclusão
- ❌ Estado de confirmação de exclusão dentro do card
- ❌ Lógica de roteamento baseada em role

**Sugestão de Refatoração**:
```typescript
// Separar em componentes menores:
- SubjectCardContent (apenas exibição)
- DeleteButton (com lógica de confirmação)
- SubjectCardActions (wrapper para ações)
- useSubjectNavigation (hook para roteamento)
```

**b) `admin/page.tsx` - Formulários Grandes**
- ❌ Formulário de edição inline (70+ linhas)
- ❌ Formulário de cadastro inline (50+ linhas)
- ❌ Lógica de validação duplicada
- ❌ Estados de formulário misturados

**Sugestão de Refatoração**:
```typescript
// Extrair para componentes:
- UserEditForm (formulário de edição)
- UserCreateForm (formulário de cadastro)
- UserFormFields (campos reutilizáveis)
- useUserForm (hook para lógica de formulário)
```

**c) Cards com Lógica de Ações**
- ❌ `UnitCard.tsx` e `SubjectCard.tsx` têm lógica similar de exclusão
- ❌ Confirmação de exclusão duplicada em ambos

**Sugestão de Refatoração**:
```typescript
// Criar componente reutilizável:
- ConfirmDeleteButton (componente genérico)
- useConfirmDelete (hook para lógica de confirmação)
```

### 2. Extração de Lógica para Hooks

#### Problemas Identificados:

**a) `professor/page.tsx` - Lógica de Ordenação**
```typescript
// ❌ Lógica inline na página (linhas 25-31)
const recentUnits = [...allUnits]
  .sort((a, b) => {
    const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
    const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
    return dateB - dateA;
  })
  .slice(0, 5);
```

**Sugestão**:
```typescript
// ✅ Criar hook: useRecentUnits(units, limit = 5)
// Centraliza lógica de ordenação e formatação de datas
```

**b) `admin/page.tsx` - Lógica de Gerenciamento de Usuários**
- ❌ Validação de formulários duplicada (linhas 57-97)
- ❌ Lógica de carregamento de usuários
- ❌ Lógica de edição/criação/exclusão misturada

**Sugestão**:
```typescript
// ✅ Criar hooks:
- useUserManagement() // Carregamento e CRUD
- useUserFormValidation() // Validação reutilizável
- useUserForm() // Estado e handlers de formulário
```

**c) `aluno/page.tsx` - Lógica de Filtragem**
```typescript
// ❌ Lógica inline (linha 42)
setUnits(allUnits.filter(u => u.lessonPlanId));
```

**Sugestão**:
```typescript
// ✅ Criar hook: useUnitsWithPlans(units)
// Filtra e formata unidades com planos
```

**d) Páginas de Formulário - Validação Repetida**
- ❌ `login/page.tsx` - Validação de email/senha
- ❌ `register/page.tsx` - Validação similar
- ❌ `professor/disciplinas/new/page.tsx` - Validação de disciplina

**Sugestão**:
```typescript
// ✅ Criar hooks especializados:
- useEmailValidation()
- usePasswordValidation()
- useSubjectFormValidation()
- useUserFormValidation()
```

### 3. Exemplos Concretos de Refatoração

#### Exemplo 1: Extrair Lógica de Ordenação

**Antes** (`professor/page.tsx`):
```typescript
const recentUnits = [...allUnits]
  .sort((a, b) => {
    const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
    const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
    return dateB - dateA;
  })
  .slice(0, 5);
```

**Depois** (hook `useRecentUnits.ts`):
```typescript
export function useRecentUnits<T extends { createdAt: Date | string }>(
  items: T[],
  limit: number = 5
): T[] {
  return useMemo(() => {
    return [...items]
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Date 
          ? a.createdAt.getTime() 
          : new Date(a.createdAt).getTime();
        const dateB = b.createdAt instanceof Date 
          ? b.createdAt.getTime() 
          : new Date(b.createdAt).getTime();
        return dateB - dateA;
      })
      .slice(0, limit);
  }, [items, limit]);
}
```

**Uso**:
```typescript
const recentUnits = useRecentUnits(allUnits, 5);
```

#### Exemplo 2: Componente de Confirmação de Exclusão

**Antes** (duplicado em `SubjectCard` e `UnitCard`):
```typescript
const [showConfirm, setShowConfirm] = useState(false);
const handleDelete = (e: React.MouseEvent) => { /* ... */ };
const handleCancelDelete = (e: React.MouseEvent) => { /* ... */ };
// JSX com botões de confirmação...
```

**Depois** (componente `ConfirmDeleteButton.tsx`):
```typescript
export function ConfirmDeleteButton({ 
  onConfirm, 
  itemName 
}: { 
  onConfirm: () => void; 
  itemName?: string;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  // Lógica centralizada...
  return (/* JSX reutilizável */);
}
```

#### Exemplo 3: Hook de Gerenciamento de Usuários

**Antes** (`admin/page.tsx` - 200+ linhas):
```typescript
// Toda lógica misturada na página
const [professores, setProfessores] = useState<User[]>([]);
const [alunos, setAlunos] = useState<User[]>([]);
const loadUsers = () => { /* ... */ };
const handleSubmit = (e: React.FormEvent) => { /* ... */ };
const handleEdit = (user: User) => { /* ... */ };
const handleDelete = (user: User) => { /* ... */ };
```

**Depois** (hook `useUserManagement.ts`):
```typescript
export function useUserManagement() {
  const [professores, setProfessores] = useState<User[]>([]);
  const [alunos, setAlunos] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const loadUsers = useCallback(() => { /* ... */ }, []);
  const createProfessor = useCallback((data) => { /* ... */ }, []);
  const updateUser = useCallback((id, data) => { /* ... */ }, []);
  const deleteUser = useCallback((id) => { /* ... */ }, []);
  
  useEffect(() => { loadUsers(); }, [loadUsers]);
  
  return { professores, alunos, loading, createProfessor, updateUser, deleteUser };
}
```

### 4. Benefícios das Melhorias

#### Componentes Granulares:
- ✅ **Reutilização**: Componentes específicos podem ser reutilizados
- ✅ **Manutenibilidade**: Mudanças isoladas em um componente
- ✅ **Legibilidade**: Código mais fácil de entender
- ✅ **Separação de Responsabilidades**: Cada componente tem uma função clara

#### Hooks Customizados:
- ✅ **Reutilização**: Lógica compartilhada entre páginas
- ✅ **Separação de Responsabilidades**: Lógica separada da apresentação
- ✅ **Performance**: Memoização e otimizações centralizadas
- ✅ **Manutenibilidade**: Lógica centralizada facilita manutenção

### 5. Priorização das Melhorias

**Alta Prioridade**:
1. ✅ Extrair `useRecentUnits` (usado em múltiplas páginas)
2. ✅ Criar `ConfirmDeleteButton` (duplicado em 2 componentes)
3. ✅ Extrair `useUserManagement` (página admin muito grande)

**Média Prioridade**:
4. ✅ Separar formulários do `admin/page.tsx`
5. ✅ Criar hooks de validação reutilizáveis
6. ✅ Extrair lógica de filtragem para hooks

**Baixa Prioridade**:
7. ✅ Refatorar `SubjectCard` e `UnitCard` em componentes menores
8. ✅ Criar hooks para lógica de navegação

---

**Última atualização**: 2024
**Autor**: Análise automática da estrutura do projeto
