# 📋 Guia de Integração - Logs de Auditoria

Este documento explica como integrar o sistema de logs de auditoria em novos Use Cases.

## 📦 Importação

```typescript
import { getAuditService } from '@/lib/auditService';
```

## 🔧 Uso Básico

### Exemplo 1: Criar Disciplina

```typescript
// src/application/usecases/CreateSubjectUseCase.ts
import { getAuditService } from '@/lib/auditService';

export class CreateSubjectUseCase {
  constructor(private repository: ILessonRepository) {}

  async execute(name: string, ...): Promise<Subject> {
    // ... lógica de criação ...
    
    const subject: Subject = {
      id: `subject-${Date.now()}`,
      name: trimmedName,
      // ...
    };

    this.repository.saveSubject(subject);

    // Registrar log de auditoria
    const auditService = getAuditService();
    auditService.logSubjectCreated(userId, subject.id, subject.name);

    return subject;
  }
}
```

### Exemplo 2: Excluir Disciplina

```typescript
// src/application/usecases/DeleteSubjectUseCase.ts
import { getAuditService } from '@/lib/auditService';

export class DeleteSubjectUseCase {
  constructor(private repository: ILessonRepository) {}

  execute(id: string, userId: string): void {
    const subject = this.repository.getSubjectById(id);
    
    // ... validações ...
    
    this.repository.deleteSubject(id);

    // Registrar log de auditoria
    const auditService = getAuditService();
    auditService.logSubjectDeleted(userId, id, subject.name);
  }
}
```

### Exemplo 3: Atualizar Nota

```typescript
// src/application/usecases/UpdateGradeUseCase.ts
import { getAuditService } from '@/lib/auditService';

export class UpdateGradeUseCase {
  execute(quizResultId: string, userId: string, oldScore: number, newScore: number): void {
    // ... lógica de atualização ...
    
    // Registrar log de auditoria
    const auditService = getAuditService();
    auditService.logGradeUpdated(userId, quizResultId, oldScore, newScore);
  }
}
```

## 🎯 Métodos Disponíveis

O `AuditService` possui métodos auxiliares para ações comuns:

- `logLessonPlanCreated(userId, lessonPlanId, title)`
- `logLessonPlanUpdated(userId, lessonPlanId, title)`
- `logLessonPlanDeleted(userId, lessonPlanId, title)`
- `logSubjectCreated(userId, subjectId, name)`
- `logSubjectDeleted(userId, subjectId, name)`
- `logGradeUpdated(userId, quizResultId, oldScore, newScore)`
- `logUserCreated(adminId, newUserId, email)`
- `logUserDeleted(adminId, deletedUserId, email)`

## 🔨 Uso Avançado

Para ações customizadas, use o método `log()`:

```typescript
const auditService = getAuditService();

auditService.log(
  'material_uploaded',
  userId,
  `Material enviado: ${materialName}`,
  {
    severity: 'info',
    resourceType: 'Material',
    resourceId: materialId,
    details: {
      fileName: materialName,
      fileSize: fileSize,
      fileType: fileType,
    },
  }
);
```

## 📊 Tipos de Ações

Os tipos de ações disponíveis estão definidos em `AuditActionType`:

- `lesson_plan_created`
- `lesson_plan_updated`
- `lesson_plan_deleted`
- `lesson_plan_shared`
- `lesson_plan_refined`
- `subject_created`
- `subject_updated`
- `subject_deleted`
- `unit_created`
- `unit_updated`
- `unit_deleted`
- `quiz_result_updated`
- `grade_updated`
- `user_created`
- `user_updated`
- `user_deleted`
- `announcement_created`
- `announcement_deleted`
- `material_uploaded`
- `material_deleted`
- `system_config_changed`

## ⚠️ Severidades

- `info` - Ações normais do sistema
- `warning` - Ações que requerem atenção (ex: exclusões)
- `error` - Erros que não quebram o sistema
- `critical` - Ações críticas (ex: exclusão de usuários)

## 📍 Onde Integrar

Integre logs de auditoria em:

1. ✅ Criação de recursos (planos, disciplinas, unidades)
2. ✅ Atualização de recursos importantes
3. ✅ Exclusão de recursos
4. ✅ Alteração de notas/avaliações
5. ✅ Criação/exclusão de usuários
6. ✅ Ações administrativas
7. ✅ Compartilhamento de recursos
8. ✅ Upload/exclusão de materiais

## 🎨 Interface Admin

Os logs podem ser visualizados em `/admin/auditoria` com:

- Filtros por ação, severidade, data, usuário
- Visualização detalhada de cada log
- Marcação de logs como revisados
- Exportação (futuro)
