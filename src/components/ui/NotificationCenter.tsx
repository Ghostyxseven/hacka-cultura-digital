// src/components/ui/NotificationCenter.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationCenterProps {
  notifications?: Notification[];
  maxVisible?: number;
  className?: string;
}

/**
 * Componente de centro de notificações
 * Gerencia e exibe notificações do sistema
 */
export function NotificationCenter({
  notifications: externalNotifications,
  maxVisible = 5,
  className = '',
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(
    externalNotifications || []
  );

  useEffect(() => {
    if (externalNotifications) {
      setNotifications(externalNotifications);
    }
  }, [externalNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const typeIcons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  const typeColors = {
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
  };

  const visibleNotifications = notifications.slice(0, maxVisible);

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="secondary"
        size="sm"
        className="relative"
        aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ''}`}
        aria-expanded={isOpen}
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-bold text-lg">Notificações</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                >
                  Marcar todas como lidas
                </Button>
              )}
              <Button
                onClick={() => setIsOpen(false)}
                variant="secondary"
                size="sm"
                aria-label="Fechar notificações"
              >
                ✕
              </Button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {visibleNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {visibleNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`
                      p-4 hover:bg-gray-50 transition-colors
                      ${!notification.read ? 'bg-blue-50' : ''}
                      ${typeColors[notification.type]}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{typeIcons[notification.type]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(notification.timestamp).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>

                        {notification.action && (
                          <Button
                            onClick={() => {
                              notification.action?.onClick();
                              markAsRead(notification.id);
                            }}
                            variant="secondary"
                            size="sm"
                            className="mt-2"
                          >
                            {notification.action.label}
                          </Button>
                        )}
                      </div>
                      <Button
                        onClick={() => removeNotification(notification.id)}
                        variant="secondary"
                        size="sm"
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Remover notificação"
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
