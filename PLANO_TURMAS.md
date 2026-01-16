# 📚 Plano de Implementação - Sistema de Turmas

Este documento organiza a implementação do sistema de turmas (6º ano ao 3º ano EM) por branch existente, sem criar novas branches.

---

## 🎯 Objetivo

Implementar um sistema onde:
- **Professores** se cadastram e se associam a **turmas** e **disciplinas**
- **Alunos** se cadastram e entram em uma **turma** específica
- Cada **turma** tem professores de diferentes disciplinas
- Conteúdos são específicos por **turma/série**

---

## 🏗️ Arquitetura Proposta

### Nova Estrutura de Dados

```
Turma (Class)
├── id: string
├── name: string (ex: "6º Ano A", "9º Ano B")
├── gradeYear: SchoolYear (6º Ano, 7º Ano, etc.)
├── schoolYear: string (ex: "2024")
├── students: string[] (IDs dos alunos)
├── teachers: ClassTeacher[] (professores por disciplina)
└── createdAt: Date

ClassTeacher
├── teacherId: string
├── subjectId: string
├── assignedAt: Date
└── isMainTeacher: boolean (coordenador da turma)

User (modificado)
├── ... campos existentes
├── classId?: string (para alunos - turma atual)
├── classes?: string[] (para professores - turmas que leciona)
└── subjects?: string[] (mantém - disciplinas que leciona)
```

---

## 📋 Implementação por Branch

### 🔵 **layer/core** - Entidades e Interfaces

#### 1. Nova Entidade: `Class` (Turma)
- [ ] **Criar**: `src/core/entities/Class.ts`
  ```typescript
  export interface Class {
    id: string;
    name: string; // "6º Ano A", "9º Ano B"
    gradeYear: SchoolYear; // 6º Ano, 7º Ano, etc.
    schoolYear: string; // "2024", "2025"
    students: string[]; // IDs dos alunos
    teachers: ClassTeacher[]; // Professores por disciplina
    createdAt: Date;
    updatedAt?: Date;
  }

  export interface ClassTeacher {
    teacherId: string;
    subjectId: string;
    assignedAt: Date;
    isMainTeacher?: boolean; // Coordenador da turma
  }
  ```

#### 2. Modificar Entidade: `User`
- [ ] **Modificar**: `src/core/entities/User.ts`
  - Adicionar `classId?: string` para alunos
  - Adicionar `classes?: string[]` para professores
  - Manter `subjects?: string[]` para professores
  - Manter `professorId?: string` (deprecado, mas manter para compatibilidade)

#### 3. Modificar Entidade: `Subject`
- [ ] **Modificar**: `src/core/entities/Subject.ts`
  - Manter `gradeYears?: SchoolYear[]` (já existe)
  - Adicionar validação de associação com turmas

#### 4. Modificar Entidade: `Unit`
- [ ] **Modificar**: `src/core/entities/Unit.ts`
  - Adicionar `classId?: string` (opcional, para vincular a turma específica)
  - Manter `gradeYear: SchoolYear` (já existe)

#### 5. Modificar Entidade: `LessonPlan`
- [ ] **Modificar**: `src/core/entities/LessonPlan.ts`
  - Adicionar `classId?: string` (opcional)
  - Manter `gradeYear: SchoolYear` (já existe)

#### 6. Nova Interface: `IClassRepository`
- [ ] **Criar**: `src/core/repositories/IClassRepository.ts`
  ```typescript
  export interface IClassRepository {
    save(classEntity: Class): void;
    getById(id: string): Class | undefined;
    getAll(): Class[];
    getByGradeYear(gradeYear: SchoolYear): Class[];
    getBySchoolYear(schoolYear: string): Class[];
    getByTeacherId(teacherId: string): Class[];
    getByStudentId(studentId: string): Class | undefined;
    delete(id: string): void;
  }
  ```

---

### 💾 **layer/repository** - Implementações

#### 1. Implementação: `LocalStorageClassRepository`
- [ ] **Criar**: `src/repository/implementations/LocalStorageClassRepository.ts`
  - Implementar `IClassRepository`
  - Usar `StorageKeys.CLASSES`
  - Singleton pattern

#### 2. Modificar: `LocalStorageUserRepository`
- [ ] **Modificar**: `src/repository/implementations/LocalStorageUserRepository.ts`
  - Suportar novos campos `classId` e `classes`
  - Métodos para buscar alunos por turma
  - Métodos para buscar professores por turma

#### 3. Atualizar: `StorageKeys`
- [ ] **Modificar**: `src/core/constants/StorageKeys.ts`
  - Adicionar `CLASSES = 'classes'`

---

### 🧠 **layer/application** - Use Cases

#### 1. Gestão de Turmas
- [ ] **Criar**: `src/application/usecases/CreateClassUseCase.ts`
  - Criar nova turma
  - Validar nome único por ano/série
  - Inicializar com arrays vazios

- [ ] **Criar**: `src/application/usecases/GetClassesUseCase.ts`
  - Listar todas as turmas
  - Filtrar por série, ano letivo

- [ ] **Criar**: `src/application/usecases/GetClassByIdUseCase.ts`
  - Buscar turma por ID
  - Incluir dados de alunos e professores

- [ ] **Criar**: `src/application/usecases/AssignTeacherToClassUseCase.ts`
  - Associar professor a turma por disciplina
  - Validar se professor leciona a disciplina
  - Validar se turma existe

- [ ] **Criar**: `src/application/usecases/AssignStudentToClassUseCase.ts`
  - Associar aluno a turma
  - Validar se aluno já está em outra turma
  - Validar série do aluno vs série da turma

- [ ] **Criar**: `src/application/usecases/RemoveTeacherFromClassUseCase.ts`
  - Remover professor de turma
  - Validar se há alunos dependentes

- [ ] **Criar**: `src/application/usecases/RemoveStudentFromClassUseCase.ts`
  - Remover aluno de turma
  - Limpar referências

- [ ] **Criar**: `src/application/usecases/DeleteClassUseCase.ts`
  - Excluir turma
  - Validar se há alunos/professores associados

#### 2. Modificar Use Cases Existentes

- [ ] **Modificar**: `src/application/usecases/CreateUserUseCase.ts`
  - Para alunos: aceitar `classId` opcional
  - Para professores: aceitar `classes` e `subjects`
  - Validar associações

- [ ] **Modificar**: `src/application/usecases/UpdateUserUseCase.ts`
  - Permitir atualizar `classId` (alunos)
  - Permitir atualizar `classes` (professores)
  - Validar mudanças

- [ ] **Criar**: `src/application/usecases/GetClassTeachersUseCase.ts`
  - Listar professores de uma turma
  - Agrupar por disciplina

- [ ] **Criar**: `src/application/usecases/GetClassStudentsUseCase.ts`
  - Listar alunos de uma turma
  - Incluir dados do perfil

- [ ] **Criar**: `src/application/usecases/GetTeacherClassesUseCase.ts`
  - Listar turmas de um professor
  - Filtrar por disciplina

#### 3. Modificar Use Cases de Conteúdo

- [ ] **Modificar**: `src/application/usecases/CreateUnitUseCase.ts`
  - Aceitar `classId` opcional
  - Validar se turma existe e série corresponde

- [ ] **Modificar**: `src/application/usecases/GetUnitsUseCase.ts`
  - Filtrar por `classId` se fornecido
  - Filtrar por `gradeYear` (já existe)

- [ ] **Modificar**: `src/application/usecases/GenerateLessonPlanUseCase.ts`
  - Aceitar `classId` opcional
  - Vincular plano à turma

---

### 🎨 **layer/presentation** - Interface do Usuário

#### 1. Páginas de Administração

- [ ] **Criar**: `src/app/(dashboards)/admin/turmas/page.tsx`
  - Listar todas as turmas
  - Criar nova turma
  - Gerenciar alunos e professores por turma
  - Filtros por série e ano letivo

- [ ] **Criar**: `src/app/(dashboards)/admin/turmas/[id]/page.tsx`
  - Detalhes da turma
  - Lista de alunos
  - Lista de professores por disciplina
  - Adicionar/remover alunos e professores

#### 2. Páginas do Professor

- [ ] **Modificar**: `src/app/(dashboards)/professor/page.tsx`
  - Mostrar "Minhas Turmas" em vez de apenas disciplinas
  - Cards por turma com disciplinas lecionadas
  - Acesso rápido aos conteúdos por turma

- [ ] **Criar**: `src/app/(dashboards)/professor/turmas/page.tsx`
  - Lista de turmas do professor
  - Filtrar por disciplina
  - Estatísticas por turma

- [ ] **Criar**: `src/app/(dashboards)/professor/turmas/[id]/page.tsx`
  - Detalhes da turma
  - Lista de alunos
  - Conteúdos criados para esta turma
  - Criar novo conteúdo para a turma

- [ ] **Modificar**: `src/app/(dashboards)/professor/disciplinas/[id]/page.tsx`
  - Mostrar turmas associadas à disciplina
  - Filtrar unidades por turma

- [ ] **Modificar**: `src/app/(dashboards)/professor/unidades/new/page.tsx`
  - Selecionar turma ao criar unidade
  - Validar série da turma

#### 3. Páginas do Aluno

- [ ] **Modificar**: `src/app/(dashboards)/aluno/page.tsx`
  - Mostrar "Minha Turma" (nome da turma)
  - Lista de professores da turma por disciplina
  - Acesso aos conteúdos da turma

- [ ] **Criar**: `src/app/(dashboards)/aluno/turma/page.tsx`
  - Detalhes da turma
  - Lista de colegas (opcional, com permissão)
  - Professores por disciplina
  - Mural da turma

- [ ] **Modificar**: `src/app/(dashboards)/aluno/disciplinas/[id]/page.tsx`
  - Mostrar apenas conteúdos da turma do aluno
  - Filtrar por turma

#### 4. Páginas de Cadastro

- [ ] **Modificar**: `src/app/register/page.tsx`
  - Para alunos: selecionar turma em vez de professor
  - Validar se turma existe e tem vaga
  - Mostrar série da turma

- [ ] **Criar**: `src/app/register/professor/page.tsx`
  - Cadastro de professor
  - Selecionar disciplinas que leciona
  - Associar a turmas (opcional no cadastro, pode fazer depois)

#### 5. Componentes

- [ ] **Criar**: `src/app/components/ClassCard.tsx`
  - Card de turma com informações
  - Número de alunos e professores
  - Ações rápidas

- [ ] **Criar**: `src/app/components/ClassTeacherList.tsx`
  - Lista de professores por disciplina
  - Mostrar disciplinas lecionadas

- [ ] **Criar**: `src/app/components/ClassStudentList.tsx`
  - Lista de alunos da turma
  - Filtros e busca

- [ ] **Criar**: `src/app/components/ClassSelector.tsx`
  - Seletor de turma (dropdown/select)
  - Filtrar por série
  - Mostrar vagas disponíveis

- [ ] **Criar**: `src/app/components/AssignTeacherForm.tsx`
  - Formulário para associar professor a turma
  - Selecionar disciplina
  - Validar associações

- [ ] **Criar**: `src/app/components/AssignStudentForm.tsx`
  - Formulário para associar aluno a turma
  - Validar série e vagas

---

### 🔧 **layer/infrastructure** - Serviços

#### 1. Serviço de Turmas
- [ ] **Criar**: `src/application/services/ClassService.ts`
  - Orquestrar Use Cases de turmas
  - Validações de negócio
  - Métodos auxiliares

- [ ] **Criar**: `src/lib/classService.ts`
  - Singleton do `ClassService`
  - Facilita acesso global

---

## 📝 Ordem de Implementação

### Fase 1: Fundação (Core + Repository) - **layer/core** + **layer/repository**
1. ✅ Criar entidade `Class` e `ClassTeacher`
2. ✅ Modificar entidade `User` (adicionar `classId`, `classes`)
3. ✅ Criar interface `IClassRepository`
4. ✅ Implementar `LocalStorageClassRepository`
5. ✅ Modificar `LocalStorageUserRepository`
6. ✅ Atualizar `StorageKeys`

### Fase 2: Lógica de Negócio (Application) - **layer/application**
1. ✅ Use Cases de CRUD de turmas
2. ✅ Use Cases de associação (professor ↔ turma, aluno ↔ turma)
3. ✅ Modificar Use Cases existentes (CreateUser, UpdateUser, etc.)
4. ✅ Use Cases de consulta (GetClassTeachers, GetClassStudents, etc.)
5. ✅ Modificar Use Cases de conteúdo (CreateUnit, GenerateLessonPlan)

### Fase 3: Interface (Presentation) - **layer/presentation**
1. ✅ Páginas de administração (CRUD de turmas)
2. ✅ Modificar dashboard do professor (mostrar turmas)
3. ✅ Páginas de turmas do professor
4. ✅ Modificar dashboard do aluno (mostrar turma)
5. ✅ Páginas de turma do aluno
6. ✅ Modificar páginas de cadastro
7. ✅ Componentes reutilizáveis (ClassCard, ClassSelector, etc.)

### Fase 4: Integração e Testes
1. ✅ Integrar com fluxos existentes
2. ✅ Testar associações
3. ✅ Validar filtros por turma
4. ✅ Ajustar navegação

---

## 🔄 Migração de Dados Existentes

### Estratégia de Migração

1. **Para Alunos Existentes**:
   - Criar turmas padrão por série (ex: "6º Ano A", "7º Ano A", etc.)
   - Associar alunos às turmas baseado em `professorId` (se existir) ou criar turmas genéricas
   - Manter `professorId` para compatibilidade durante transição

2. **Para Professores Existentes**:
   - Criar associações com turmas baseado em `subjects` e `gradeYears`
   - Permitir que professor associe-se manualmente a turmas

3. **Para Conteúdos Existentes**:
   - Manter `gradeYear` existente
   - Opcionalmente criar `classId` baseado em `gradeYear` e professor criador

---

## 📌 Notas Importantes

1. **Não criar novas branches**: Usar apenas branches existentes
2. **Manter Clean Architecture**: Respeitar separação de camadas
3. **TypeScript**: Tipagem forte em todas as implementações
4. **Compatibilidade**: Manter campos antigos (`professorId`) durante transição
5. **Validações**: Validar série do aluno vs série da turma
6. **Performance**: Lazy loading de listas grandes de alunos/professores

---

## ✅ Checklist de Implementação

### Core/Repository
- [ ] Entidade `Class` criada
- [ ] Entidade `User` modificada
- [ ] Interface `IClassRepository` criada
- [ ] `LocalStorageClassRepository` implementado
- [ ] `LocalStorageUserRepository` modificado
- [ ] `StorageKeys` atualizado

### Application
- [ ] Use Cases de CRUD de turmas
- [ ] Use Cases de associação
- [ ] Use Cases existentes modificados
- [ ] `ClassService` criado

### Presentation
- [ ] Páginas de admin (turmas)
- [ ] Dashboard professor modificado
- [ ] Páginas de turmas do professor
- [ ] Dashboard aluno modificado
- [ ] Páginas de turma do aluno
- [ ] Páginas de cadastro modificadas
- [ ] Componentes reutilizáveis

### Integração
- [ ] Migração de dados existentes
- [ ] Testes de fluxo completo
- [ ] Validações funcionando
- [ ] Navegação ajustada

---

**Última atualização**: 2026-01-16
