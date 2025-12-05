
import React, { useState } from 'react';
import { Bell, Check, Trash2, Info } from 'lucide-react';
import { Notification } from '../types';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onMarkRead, onClearAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative z-40">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
             <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                 {notifications.length > 0 && (
                     <button onClick={onClearAll} className="text-xs text-slate-400 hover:text-red-500 flex items-center">
                         <Trash2 size={12} className="mr-1" /> Clear
                     </button>
                 )}
             </div>
             
             <div className="max-h-80 overflow-y-auto">
                 {notifications.length === 0 ? (
                     <div className="p-8 text-center text-slate-400">
                         <Bell size={24} className="mx-auto mb-2 opacity-20" />
                         <p className="text-sm">No notifications yet</p>
                     </div>
                 ) : (
                     <div className="divide-y divide-slate-50">
                         {notifications.map(notification => (
                             <div 
                                key={notification.id} 
                                className={`p-4 hover:bg-slate-50 transition-colors ${!notification.isRead ? 'bg-indigo-50/30' : ''}`}
                                onClick={() => onMarkRead(notification.id)}
                             >
                                 <div className="flex items-start space-x-3">
                                     <div className={`mt-0.5 p-1 rounded-full flex-shrink-0 ${
                                         notification.type === 'info' ? 'bg-blue-100 text-blue-600' :
                                         notification.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                         'bg-slate-100 text-slate-600'
                                     }`}>
                                         {notification.type === 'success' ? <Check size={12} /> : <Info size={12} />}
                                     </div>
                                     <div className="flex-1 min-w-0">
                                         <p className={`text-sm ${!notification.isRead ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
                                             {notification.title}
                                         </p>
                                         <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notification.message}</p>
                                         <p className="text-[10px] text-slate-400 mt-2">
                                             {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                         </p>
                                     </div>
                                     {!notification.isRead && (
                                         <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                                     )}
                                 </div>
                             </div>
                         ))}
                     </div>
                 )}
             </div>
          </div>
        </>
      )}
    </div>
  );
};
