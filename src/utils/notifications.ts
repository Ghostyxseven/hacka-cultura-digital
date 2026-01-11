// src/utils/notifications.ts
// Utilitário simples para notificações (pode ser substituído por toast library depois)

export function showSuccess(message: string) {
  // Por enquanto usa alert, mas pode ser substituído por react-hot-toast ou similar
  alert(`✅ ${message}`);
}

export function showError(message: string) {
  alert(`❌ ${message}`);
}

export function showInfo(message: string) {
  alert(`ℹ️ ${message}`);
}
