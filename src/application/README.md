# Camada Application

Esta camada contém a lógica de aplicação e orquestra os casos de uso do sistema, seguindo os princípios da Clean Architecture.

## 📁 Estrutura

```
src/application/
├── usecases/          # Casos de uso (regras de negócio)
├── services/          # Serviços de aplicação (orquestração)
├── index.ts           # Exportações públicas
└── README.md          # Esta documentação
```

## 🎯 Casos de Uso Implementados

### Planos de Aula

- **GenerateLessonPlanUseCase** (RF04/05)
  - Gera planos de aula usando IA
  - Valida parâmetros de entrada
  - Retorna plano completo e validado

- **SaveLessonPlanUseCase** (RF04/05)
  - Salva ou atualiza planos de aula
  - Valida dados antes de persistir

- **GetLessonPlansUseCase** (RF04/05)
  - Lista planos de aula
  - Suporta filtros por disciplina, ano, etc.

- **GetLessonPlanByIdUseCase** (RF04/05)
  - Busca plano específico por ID

### Disciplinas

- **CreateSubjectUseCase** (RF01)
  - Cria novas disciplinas
  - Valida duplicatas
  - Gera IDs únicos

- **GetSubjectsUseCase** (RF01)
  - Lista todas as disciplinas
  - Ordena por data de criação

- **DeleteSubjectUseCase** (RF01)
  - Remove disciplinas do sistema

## 🔧 Serviço Principal

### LessonPlanService

Orquestra todos os casos de uso e fornece uma interface unificada para a camada de apresentação.

**Exemplo de uso:**

```typescript
import { LessonPlanService } from './application';
import { LocalStorageRepository } from './repository/implementations/LocalStorageRepository';
import { GeminiService } from './infrastructure/ai/GeminiService';

// Inicialização
const repository = LocalStorageRepository.getInstance();
const aiService = new GeminiService();
const lessonPlanService = new LessonPlanService(repository, aiService);

// Gerar plano de aula
const plan = await lessonPlanService.generateLessonPlan(
  "Matemática",
  "Equações do 2º grau",
  "8º Ano"
);

// Listar planos
const allPlans = lessonPlanService.getLessonPlans();

// Criar disciplina
const subject = lessonPlanService.createSubject(
  "Matemática",
  "Disciplina de matemática",
  "blue-500",
  "calculator"
);
```

## 🏗️ Arquitetura

Esta camada depende de:
- **Core**: Entidades e tipos (`LessonPlan`, `Subject`, `SchoolYear`)
- **Repository**: Interface `ILessonRepository`
- **Infrastructure**: Interface `IAIService`

Esta camada é independente de:
- Implementações concretas de repositório
- Implementações concretas de IA
- Camada de apresentação (UI)

## ✅ Requisitos Funcionais Atendidos

- ✅ **RF01**: Gestão de Disciplinas (Create, Get, Delete)
- ✅ **RF04/05**: Geração de Planos de Aula e Atividades Avaliativas

## 📝 Notas

- Todos os casos de uso incluem validação de entrada
- Erros são lançados com mensagens descritivas
- A camada segue o princípio de responsabilidade única
- Cada caso de uso é testável independentemente
