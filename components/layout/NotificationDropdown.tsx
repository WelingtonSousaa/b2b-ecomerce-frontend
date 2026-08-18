'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  AlertCircle,
  Truck,
  RotateCcw,
  Tag,
  DollarSign,
  FileText,
  Check
} from 'lucide-react';
import { notificationsService } from '@/services/notifications.service';
import { B2BNotification, NotificationType } from '@/types/b2b';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<B2BNotification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    notificationsService.getNotifications()
      .then((res) => {
        if (res.data) {
          setNotifications(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'ORDER_STATUS':
        return <Truck className="w-4 h-4 text-emerald-600" />;
      case 'RMA_UPDATE':
        return <RotateCcw className="w-4 h-4 text-amber-600" />;
      case 'PRICE_BOOK_UPDATE':
        return <Tag className="w-4 h-4 text-blue-600" />;
      case 'INVOICE_DUE':
        return <DollarSign className="w-4 h-4 text-purple-600" />;
      case 'CREDIT_LIMIT':
        return <FileText className="w-4 h-4 text-indigo-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-[#004e38] transition-colors cursor-pointer"
        title="Central de Notificações B2B"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white font-black text-[9px] rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden text-xs font-sans animate-in fade-in duration-150">
          
          {/* Header */}
          <div className="bg-[#004e38] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-300" />
              <span className="font-extrabold text-sm">Notificações Corporativas</span>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] text-emerald-200 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Marcar lidas</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <span>Nenhuma notificação no momento.</span>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-3.5 hover:bg-[#f8fafc] transition-colors flex gap-3 ${
                    !notif.isRead ? 'bg-emerald-50/40 font-medium' : 'text-gray-600'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-2xs">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-gray-900 text-xs">{notif.title}</span>
                      <span className="text-[10px] text-gray-400">{notif.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">{notif.message}</p>
                    {notif.actionUrl && (
                      <Link
                        href={notif.actionUrl}
                        onClick={() => setIsOpen(false)}
                        className="inline-block text-[10px] font-bold text-[#004e38] hover:underline pt-0.5"
                      >
                        Ver Detalhes →
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-2.5 text-center border-t border-gray-100">
            <Link
              href="/conta"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-gray-600 hover:text-[#004e38]"
            >
              Ir para o Painel da Empresa
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}
