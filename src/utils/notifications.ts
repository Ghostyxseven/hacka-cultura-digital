// src/utils/notifications.ts
// Utilitário para notificações usando react-hot-toast

import toast from 'react-hot-toast';

/**
 * Exibe uma notificação de sucesso
 * @param message - Mensagem a ser exibida
 */
export function showSuccess(message: string) {
  toast.success(message, {
    duration: 4000,
  });
}

/**
 * Exibe uma notificação de erro
 * @param message - Mensagem a ser exibida
 */
export function showError(message: string) {
  toast.error(message, {
    duration: 5000,
  });
}

/**
 * Exibe uma notificação informativa
 * @param message - Mensagem a ser exibida
 */
export function showInfo(message: string) {
  toast(message, {
    duration: 4000,
    icon: 'ℹ️',
  });
}

/**
 * Exibe uma notificação de loading
 * @param message - Mensagem a ser exibida
 * @returns Função para remover o toast
 */
export function showLoading(message: string) {
  return toast.loading(message);
}

/**
 * Remove um toast de loading e substitui por sucesso ou erro
 * @param toastId - ID do toast retornado por showLoading
 * @param type - Tipo de notificação ('success' | 'error')
 * @param message - Mensagem final
 */
export function dismissLoading(toastId: string, type: 'success' | 'error', message: string) {
  toast.dismiss(toastId);
  if (type === 'success') {
    showSuccess(message);
  } else {
    showError(message);
  }
}
