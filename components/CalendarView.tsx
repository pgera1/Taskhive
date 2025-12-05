
import React from 'react';
import { Task, TaskStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onTaskClick }) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getTasksForDay = (day: number) => {
    return tasks.filter(t => {
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate);
        return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">
                {now.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex space-x-2 text-sm text-slate-500">
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-200 mr-1"></span> TODO</div>
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-200 mr-1"></span> IN PROGRESS</div>
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-200 mr-1"></span> DONE</div>
            </div>
        </div>

        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wide">
                    {d}
                </div>
            ))}
        </div>

        <div className="grid grid-cols-7 flex-1 auto-rows-fr">
            {blanks.map(i => (
                <div key={`blank-${i}`} className="bg-slate-50/30 border-b border-r border-slate-100"></div>
            ))}
            {days.map(day => {
                const dayTasks = getTasksForDay(day);
                const isToday = day === now.getDate();
                
                return (
                    <div key={day} className={`border-b border-r border-slate-100 p-2 min-h-[100px] hover:bg-slate-50 transition-colors ${isToday ? 'bg-indigo-50/20' : ''}`}>
                        <div className={`text-sm font-medium mb-1 ${isToday ? 'text-indigo-600 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center' : 'text-slate-700'}`}>
                            {day}
                        </div>
                        <div className="space-y-1">
                            {dayTasks.map(task => {
                                const baseColor = STATUS_COLORS[task.status].split(' ')[0].replace('bg-', '');
                                const colorClass = `bg-${baseColor}`; 
                                
                                return (
                                    <button 
                                        key={task.id}
                                        onClick={() => onTaskClick(task)}
                                        className={`w-full text-left text-[10px] px-1.5 py-1 rounded border border-black/5 truncate font-medium ${colorClass} bg-opacity-20 hover:bg-opacity-30 transition-all`}
                                    >
                                        {task.title}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};
