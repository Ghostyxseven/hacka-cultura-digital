/**
 * Política de Arquivamento Centralizada
 * 
 * Define regras de negócio para arquivamento/desarquivamento:
 * - Validações de arquivamento
 * - Regras de bloqueio (não permitir operações em arquivados)
 * - Validações de integridade (archivedAt só se archived === true)
 * 
 * Clean Architecture: Core Layer - Políticas de Domínio
 */

export interface ArchivableEntity {
  archived?: boolean;
  archivedAt?: string;
}

/**
 * Valida se uma entidade está arquivada
 */
export function isArchived(entity: ArchivableEntity): boolean {
  return entity.archived === true;
}

/**
 * Valida se uma entidade pode ser modificada
 * Entidades arquivadas não podem ser modificadas
 */
export function canBeModified(entity: ArchivableEntity): boolean {
  return !isArchived(entity);
}

/**
 * Valida se uma operação de geração pode ser executada
 * Não permite gerar em entidades arquivadas ou relacionadas a arquivadas
 */
export function canGenerateFor(entity: ArchivableEntity): boolean {
  return !isArchived(entity);
}

/**
 * Valida a integridade dos dados de arquivamento
 * - archivedAt só pode existir se archived === true
 * - Se archived === false, archivedAt deve ser undefined
 */
export function validateArchiveIntegrity(entity: ArchivableEntity): boolean {
  if (entity.archived === true) {
    // Se arquivado, archivedAt deve existir
    return !!entity.archivedAt;
  }
  
  if (entity.archived === false || entity.archived === undefined) {
    // Se não arquivado, archivedAt deve ser undefined
    return entity.archivedAt === undefined;
  }
  
  return true;
}

/**
 * Garante integridade dos dados de arquivamento ao atualizar
 * Corrige inconsistências automaticamente
 */
export function ensureArchiveIntegrity<T extends ArchivableEntity>(entity: T): T {
  const updated = { ...entity };
  
  if (updated.archived === true) {
    // Se arquivado mas sem archivedAt, define o timestamp
    if (!updated.archivedAt) {
      updated.archivedAt = new Date().toISOString();
    }
  } else {
    // Se não arquivado, remove archivedAt
    updated.archived = false;
    updated.archivedAt = undefined;
  }
  
  return updated;
}

/**
 * Erros relacionados a políticas de arquivamento
 */
export class ArchivePolicyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ArchivePolicyError';
  }
}

/**
 * Lança erro se entidade está arquivada e não pode ser modificada
 */
export function assertCanBeModified(entity: ArchivableEntity, entityName: string = 'Entidade'): void {
  if (!canBeModified(entity)) {
    throw new ArchivePolicyError(
      `${entityName} está arquivada e não pode ser modificada. Desarquive primeiro para realizar esta operação.`
    );
  }
}

/**
 * Lança erro se não pode gerar conteúdo para entidade arquivada
 */
export function assertCanGenerateFor(entity: ArchivableEntity, entityName: string = 'Entidade'): void {
  if (!canGenerateFor(entity)) {
    throw new ArchivePolicyError(
      `Não é possível gerar conteúdo para ${entityName} arquivada. Desarquive primeiro para realizar esta operação.`
    );
  }
}

/**
 * Lança erro se integridade de arquivamento está violada
 */
export function assertArchiveIntegrity(entity: ArchivableEntity, entityName: string = 'Entidade'): void {
  if (!validateArchiveIntegrity(entity)) {
    throw new ArchivePolicyError(
      `${entityName} tem dados de arquivamento inconsistentes. archivedAt só pode existir se archived === true.`
    );
  }
}
