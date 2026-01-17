# 🔍 Análise de Melhorias por Camada - Hackathon Cultura Digital

**Data:** 2026-01-07  
**Status:** ✅ Merge com main concluído | ⚠️ Análise de melhorias por camada

---

## 📊 Resumo Executivo

Após merge com `main`, foram identificadas **mudanças importantes**:
- ✅ **Novos erros personalizados** em `src/application/errors/index.ts`
- ✅ **DTOs melhorados** com validação (`CreateSubjectDTO`, `CreateUnitDTO`)

Agora precisamos **integrar esses novos padrões** em todo o código e aplicar melhorias modernas e organizadas por camada.

---

## 🎯 Melhorias por Camada (Código Limpo e Moderno)

### 1. **Core Layer** (`src/core/`)

**Status Atual:** ✅ **Perfeito** - Nenhuma dependência externa

#### Melhorias Sugeridas:

##### 1.1 Usar Erros Personalizados da Application Layer ⚠️ **PRIORIDADE ALTA**

**Problema:**
- `BNCCCompetency.ts` não possui tratamento de erros específicos
- Entidades usam apenas validações booleanas

**Solução Moderna:**
```typescript
// src/core/entities/Subject.ts
import { ValidationError } from '@/application/errors';

export function createSubject(data: Omit<Subject, 'id' | 'createdAt'>): Subject {
  if (!validateSubject(data)) {
    throw new ValidationError('Dados da disciplina inválidos', 'name');
  }
  // ... resto da lógica
}
```

**Impacto:** Melhor rastreamento de erros e mensagens mais específicas

**Estimativa:** 2-3 horas

---

##### 1.2 Adicionar JSDoc Completo ⚠️ **PRIORIDADE MÉDIA**

**Problema:**
- Algumas funções não têm JSDoc completo
- Falta documentação de exemplos de uso

**Solução:**
```typescript
/**
 * Cria uma nova disciplina com validação automática
 * 
 * @param data - Dados da disciplina (sem `id` e `createdAt`)
 * @returns Disciplina criada com ID único e timestamp
 * @throws {ValidationError} Se os dados forem inválidos
 * 
 * @example
 * ```typescript
 * const subject = createSubject({
 *   name: 'Matemática',
 *   description: 'Disciplina de Matemática',
 *   schoolYears: ['6º ano', '7º ano']
 * });
 * ```
 */
export function createSubject(...)
```

**Impacto:** Melhor documentação e autocomplete

**Estimativa:** 1-2 horas

---

### 2. **Repository Layer** (`src/repository/`)

**Status Atual:** ✅ **Bom** - Usa interfaces corretamente

#### Melhorias Sugeridas:

##### 2.1 Usar Erros Personalizados Consistentemente ⚠️ **PRIORIDADE ALTA**

**Problema:**
- Repositories usam `Error` genérico em vez de erros personalizados
- `NotFoundError` e `ValidationError` devem ser usados

**Solução Moderna:**
```typescript
// src/repository/implementations/LocalStorageSubjectRepository.ts
import { NotFoundError, ValidationError } from '@/application/errors';

async findById(id: string): Promise<Subject | null> {
  const subjects = await this.getAllFromStorage();
  const subject = subjects.find((s) => s.id === id);
  
  if (!subject) {
    return null; // ou throw new NotFoundError('Subject', id);
  }
  
  return subject;
}
```

**Impacto:** Melhor tratamento de erros e consistência

**Estimativa:** 2-3 horas

---

##### 2.2 Validação de DTOs Antes de Persistir ⚠️ **PRIORIDADE MÉDIA**

**Problema:**
- Validação de DTOs existe mas não está sendo usada consistentemente

**Solução:**
```typescript
import { validateCreateSubjectDTO } from '@/application/dto/CreateSubjectDTO';

async create(subjectData: Omit<Subject, 'id' | 'createdAt'>): Promise<Subject> {
  // Validar DTO antes de converter para entidade
  if (!validateCreateSubjectDTO(subjectData)) {
    throw new ValidationError('Dados da disciplina inválidos');
  }
  // ... resto
}
```

**Impacto:** Validação mais robusta e reutilizável

**Estimativa:** 1-2 horas

---

### 3. **Infrastructure Layer** (`src/infrastructure/`)

**Status Atual:** ✅ **Bom** - Serviços bem isolados

#### Melhorias Sugeridas:

##### 3.1 Usar ServiceUnavailableError para Falhas de IA ⚠️ **PRIORIDADE ALTA**

**Problema:**
- `AIService.ts` lança `Error` genérico em vez de `ServiceUnavailableError`
- Erros de API não são categorizados adequadamente

**Solução Moderna:**
```typescript
// src/infrastructure/services/AIService.ts
import { ServiceUnavailableError } from '@/application/errors';

async generate(request: AIGenerationRequest): Promise<string> {
  try {
    // ... lógica de geração
  } catch (error) {
    if (error instanceof AIError) {
      if (error.type === AIErrorType.NETWORK || error.type === AIErrorType.SERVER_ERROR) {
        throw new ServiceUnavailableError('IA', error.message);
      }
      throw error;
    }
    throw new ServiceUnavailableError('IA', 'Erro desconhecido ao gerar conteúdo');
  }
}
```

**Impacto:** Melhor tratamento de erros e mensagens mais claras

**Estimativa:** 2-3 horas

---

##### 3.2 Cache de RAG para Performance ⚠️ **PRIORIDADE MÉDIA**

**Problema:**
- `BNCCService.buildBNCCContext()` recalcula contexto toda vez
- Pode ser custoso para muitos materiais gerados

**Solução:**
```typescript
// src/infrastructure/services/BNCCService.ts
private cache = new Map<string, string>();

buildBNCCContext(subject: Subject, year?: string): string {
  const cacheKey = `${subject.name}-${year || 'all'}`;
  
  if (this.cache.has(cacheKey)) {
    return this.cache.get(cacheKey)!;
  }
  
  const context = /* ... lógica de construção ... */;
  this.cache.set(cacheKey, context);
  
  return context;
}
```

**Impacto:** Performance melhorada em operações repetidas

**Estimativa:** 1-2 horas

---

### 4. **Application Layer** (`src/application/`)

**Status Atual:** ✅ **Excelente** - Erros e DTOs adicionados recentemente

#### Melhorias Sugeridas:

##### 4.1 Usar Erros Personalizados em Todos os Use Cases ⚠️ **PRIORIDADE ALTA**

**Problema:**
- `GenerateLessonPlanUseCase` e `GenerateActivityUseCase` usam `Error` genérico
- Devem usar `NotFoundError` e `ValidationError`

**Solução Moderna:**
```typescript
// src/application/usecases/GenerateLessonPlanUseCase.ts
import { NotFoundError, ValidationError, ServiceUnavailableError } from '@/application/errors';

async execute(dto: GenerateLessonPlanDTO): Promise<LessonPlan> {
  const unit = await this.unitRepository.findById(dto.unitId);
  if (!unit) {
    throw new NotFoundError('Unidade', dto.unitId);
  }

  const existingPlan = await this.lessonPlanRepository.findByUnitId(dto.unitId);
  if (existingPlan) {
    throw new ValidationError('Já existe um plano de aula para esta unidade');
  }

  const subject = await this.subjectRepository.findById(unit.subjectId);
  if (!subject) {
    throw new NotFoundError('Disciplina', unit.subjectId);
  }

  try {
    const generatedPlan = await this.lessonPlanGenerator.generate({...});
    return await this.lessonPlanRepository.create(generatedPlan);
  } catch (error) {
    if (error instanceof ServiceUnavailableError) {
      throw error;
    }
    throw new ServiceUnavailableError('Gerador de Plano de Aula', error.message);
  }
}
```

**Aplicar em:**
- ✅ `GenerateLessonPlanUseCase.ts`
- ✅ `GenerateActivityUseCase.ts`
- ✅ `GenerateSlidesUseCase.ts`
- ✅ `CreateSubjectUseCase.ts`
- ✅ `CreateUnitUseCase.ts`
- ✅ `DeleteSubjectUseCase.ts`

**Impacto:** Tratamento de erros consistente e rastreável

**Estimativa:** 3-4 horas

---

##### 4.2 Validação de DTOs nos Use Cases ⚠️ **PRIORIDADE MÉDIA**

**Problema:**
- DTOs têm funções de validação mas não estão sendo usadas nos Use Cases

**Solução:**
```typescript
// src/application/usecases/CreateSubjectUseCase.ts
import { validateCreateSubjectDTO } from '@/application/dto/CreateSubjectDTO';
import { ValidationError } from '@/application/errors';

async execute(dto: CreateSubjectDTO): Promise<Subject> {
  if (!validateCreateSubjectDTO(dto)) {
    throw new ValidationError('Dados da disciplina inválidos');
  }
  // ... resto
}
```

**Impacto:** Validação consistente e reutilizável

**Estimativa:** 1-2 horas

---

##### 4.3 Refatorar Services para Usar Erros Personalizados ⚠️ **PRIORIDADE MÉDIA**

**Problema:**
- Services podem lançar erros genéricos

**Solução:**
```typescript
// src/application/services/SubjectService.ts
import { NotFoundError, ValidationError } from '@/application/errors';

async findById(id: string): Promise<Subject> {
  const subject = await this.subjectRepository.findById(id);
  if (!subject) {
    throw new NotFoundError('Disciplina', id);
  }
  return subject;
}
```

**Impacto:** Consistência na camada Application

**Estimativa:** 2-3 horas

---

### 5. **Presentation Layer** (`src/app/`)

**Status Atual:** ✅ **Bom** - Componentes funcionais

#### Melhorias Sugeridas:

##### 5.1 Tratamento de Erros Personalizados nos Hooks ⚠️ **PRIORIDADE ALTA**

**Problema:**
- Hooks não tratam erros personalizados adequadamente
- Mensagens de erro genéricas para o usuário

**Solução Moderna:**
```typescript
// src/app/hooks/useSubjectDetail.ts
import { NotFoundError, ValidationError, ServiceUnavailableError } from '@/application/errors';

const loadData = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    
    const subjectService = ApplicationServiceFactory.createSubjectService();
    const subject = await subjectService.findById(subjectId);
    
    // ...
  } catch (err: any) {
    if (err instanceof NotFoundError) {
      setError(`Disciplina não encontrada: ${err.message}`);
    } else if (err instanceof ServiceUnavailableError) {
      setError(`Serviço temporariamente indisponível: ${err.message}`);
    } else {
      setError(err.message || 'Erro ao carregar dados');
    }
  } finally {
    setLoading(false);
  }
}, [subjectId]);
```

**Aplicar em:**
- ✅ `useSubjectDetail.ts`
- ✅ `useDashboard.ts`
- ✅ `useMaterialGeneration.ts`
- ✅ `useSubjectForm.ts`
- ✅ `useUnitForm.ts`

**Impacto:** Melhor UX com mensagens de erro específicas

**Estimativa:** 3-4 horas

---

##### 5.2 Componentes com Tratamento de Erros Personalizado ⚠️ **PRIORIDADE MÉDIA**

**Problema:**
- Componentes não exibem mensagens específicas baseadas no tipo de erro

**Solução:**
```typescript
// src/app/components/AIAgent.tsx
import { ServiceUnavailableError, ValidationError } from '@/application/errors';

const handleError = (error: Error) => {
  if (error instanceof ServiceUnavailableError) {
    showToast('Serviço de IA temporariamente indisponível. Tente novamente em alguns instantes.', 'error');
  } else if (error instanceof ValidationError) {
    showToast(`Erro de validação: ${error.message}`, 'error');
  } else {
    showToast('Erro inesperado. Tente novamente.', 'error');
  }
};
```

**Impacto:** Mensagens mais úteis para o usuário

**Estimativa:** 2-3 horas

---

##### 5.3 Remover Código Duplicado em Handlers ⚠️ **PRIORIDADE MÉDIA**

**Problema:**
- Padrão de tratamento de erro repetido em vários componentes

**Solução:**
```typescript
// src/app/utils/errorHandler.ts (novo arquivo)
import { 
  NotFoundError, 
  ValidationError, 
  ServiceUnavailableError,
  ApplicationError 
} from '@/application/errors';

export function getErrorMessage(error: Error): string {
  if (error instanceof NotFoundError) {
    return `Não encontrado: ${error.message}`;
  }
  if (error instanceof ValidationError) {
    return `Validação: ${error.message}`;
  }
  if (error instanceof ServiceUnavailableError) {
    return `Serviço indisponível: ${error.message}`;
  }
  return error.message || 'Erro desconhecido';
}

export function getErrorToastType(error: Error): 'error' | 'warning' | 'info' {
  if (error instanceof NotFoundError) return 'warning';
  if (error instanceof ValidationError) return 'error';
  if (error instanceof ServiceUnavailableError) return 'warning';
  return 'error';
}
```

**Impacto:** Código mais limpo e reutilizável

**Estimativa:** 1-2 horas

---

## 🎯 Plano de Implementação por Prioridade

### 🔴 **PRIORIDADE ALTA (Implementar Primeiro)**

1. **Usar Erros Personalizados em Use Cases** (3-4h)
   - `GenerateLessonPlanUseCase.ts`
   - `GenerateActivityUseCase.ts`
   - `GenerateSlidesUseCase.ts`
   - `CreateSubjectUseCase.ts`
   - `CreateUnitUseCase.ts`
   - `DeleteSubjectUseCase.ts`

2. **Tratamento de Erros Personalizados nos Hooks** (3-4h)
   - `useSubjectDetail.ts`
   - `useDashboard.ts`
   - `useMaterialGeneration.ts`
   - `useSubjectForm.ts`
   - `useUnitForm.ts`

3. **Usar ServiceUnavailableError no AIService** (2-3h)
   - `AIService.ts` - GoogleAIProvider
   - `AIService.ts` - OpenAIProvider

**Total:** ~9-11 horas

---

### 🟡 **PRIORIDADE MÉDIA (Implementar em Segunda Fase)**

4. **Usar Erros Personalizados em Repositories** (2-3h)
   - `LocalStorageSubjectRepository.ts`
   - `LocalStorageUnitRepository.ts`
   - `LocalStorageLessonPlanRepository.ts`
   - `LocalStorageActivityRepository.ts`

5. **Validação de DTOs nos Use Cases** (1-2h)
   - Aplicar `validateCreateSubjectDTO` e `validateCreateUnitDTO`

6. **Componentes com Tratamento de Erros Personalizado** (2-3h)
   - `AIAgent.tsx`
   - Componentes de formulário

7. **Utilitário de Tratamento de Erros** (1-2h)
   - Criar `src/app/utils/errorHandler.ts`

8. **Cache de RAG no BNCCService** (1-2h)

9. **JSDoc Completo no Core** (1-2h)

**Total:** ~8-14 horas

---

## 📝 Notas Técnicas

### Padrões a Seguir:

1. **Erros Personalizados:**
   ```typescript
   // ✅ CORRETO
   throw new NotFoundError('Subject', id);
   throw new ValidationError('Dados inválidos', 'field');
   throw new ServiceUnavailableError('IA', 'Serviço offline');
   
   // ❌ EVITAR
   throw new Error('Subject not found');
   ```

2. **Validação de DTOs:**
   ```typescript
   // ✅ CORRETO
   if (!validateCreateSubjectDTO(dto)) {
     throw new ValidationError('Dados inválidos');
   }
   ```

3. **Tratamento de Erros em Hooks:**
   ```typescript
   // ✅ CORRETO
   try {
     // ...
   } catch (err: any) {
     if (err instanceof NotFoundError) {
       setError(`Não encontrado: ${err.message}`);
     } else if (err instanceof ServiceUnavailableError) {
       setError(`Serviço indisponível: ${err.message}`);
     } else {
       setError(err.message || 'Erro desconhecido');
     }
   }
   ```

---

## ✅ Checklist de Implementação

### Application Layer
- [ ] `GenerateLessonPlanUseCase.ts` - Usar erros personalizados
- [ ] `GenerateActivityUseCase.ts` - Usar erros personalizados
- [ ] `GenerateSlidesUseCase.ts` - Usar erros personalizados
- [ ] `CreateSubjectUseCase.ts` - Usar erros personalizados + validação DTO
- [ ] `CreateUnitUseCase.ts` - Usar erros personalizados + validação DTO
- [ ] `DeleteSubjectUseCase.ts` - Usar erros personalizados
- [ ] `SubjectService.ts` - Usar erros personalizados
- [ ] `UnitService.ts` - Usar erros personalizados

### Infrastructure Layer
- [ ] `AIService.ts` - Usar `ServiceUnavailableError`
- [ ] `BNCCService.ts` - Adicionar cache

### Repository Layer
- [ ] `LocalStorageSubjectRepository.ts` - Usar erros personalizados
- [ ] `LocalStorageUnitRepository.ts` - Usar erros personalizados
- [ ] `LocalStorageLessonPlanRepository.ts` - Usar erros personalizados
- [ ] `LocalStorageActivityRepository.ts` - Usar erros personalizados

### Presentation Layer
- [ ] `useSubjectDetail.ts` - Tratamento de erros personalizados
- [ ] `useDashboard.ts` - Tratamento de erros personalizados
- [ ] `useMaterialGeneration.ts` - Tratamento de erros personalizados
- [ ] `useSubjectForm.ts` - Tratamento de erros personalizados
- [ ] `useUnitForm.ts` - Tratamento de erros personalizados
- [ ] `AIAgent.tsx` - Mensagens de erro específicas
- [ ] Criar `src/app/utils/errorHandler.ts`

### Core Layer
- [ ] `Subject.ts` - JSDoc completo
- [ ] `Unit.ts` - JSDoc completo
- [ ] `LessonPlan.ts` - JSDoc completo
- [ ] `Activity.ts` - JSDoc completo

---

**Total Estimado:** ~17-25 horas de desenvolvimento

**Recomendação:** Começar pela Prioridade Alta para garantir tratamento de erros robusto e consistente em todo o código.

---

**Última atualização:** 2026-01-07  
**Próxima revisão:** Após implementação das melhorias de Prioridade Alta
