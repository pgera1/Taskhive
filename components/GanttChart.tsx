
import React from 'react';
import { Task, TaskStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface GanttChartProps {
  tasks: Task[];
}

export const GanttChart: React.FC<GanttChartProps> = ({ tasks }) => {
  const now = new Date();
  const startDates = tasks.map(t => t.createdAt).filter(Boolean);
  const dueDates = tasks.map(t => t.dueDate ? new Date(t.dueDate).getTime() : 0).filter(d => d > 0);
  
  const minTime = startDates.length ? Math.min(...startDates) : now.getTime() - 1209600000;
  const maxTime = dueDates.length ? Math.max(...dueDates) : now.getTime() + 1209600000;
  
  const startRange = new Date(minTime - 86400000 * 3); 
  const endRange = new Date(maxTime + 86400000 * 7); 
  const totalDuration = endRange.getTime() - startRange.getTime();
  
  const days: Date[] = [];
  let current = new Date(startRange);
  while (current <= endRange) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
  }

  const getPosition = (date: number) => {
      return ((date - startRange.getTime()) / totalDuration) * 100;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
        <div className="flex-1 overflow-x-auto overflow-y-auto relative custom-scrollbar">
            <div className="min-w-[1200px] relative">
                <div className="flex border-b border-slate-200 sticky top-0 bg-white z-20 h-10">
                    <div className="w-64 flex-shrink-0 border-r border-slate-200 p-2 font-bold text-slate-600 text-xs bg-slate-50 flex items-center sticky left-0 z-30 shadow-sm">
                        Task Name
                    </div>
                    <div className="flex-1 relative flex">
                        {days.map((day, i) => (
                            <div key={i} className="flex-1 min-w-[40px] border-r border-slate-100 text-[10px] text-center text-slate-400 py-2 flex flex-col justify-center bg-slate-50/50">
                                <span className="font-semibold text-slate-600">{day.getDate()}</span>
                                <span className="uppercase">{day.toLocaleDateString(undefined, {weekday: 'narrow'})}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex pl-64 pointer-events-none">
                        {days.map((_, i) => (
                             <div key={i} className="flex-1 min-w-[40px] border-r border-slate-50 h-full"></div>
                        ))}
                    </div>
                    
                    <div 
                        className="absolute top-0 bottom-0 border-l-2 border-red-500 z-10 opacity-50 pointer-events-none ml-64"
                        style={{ left: `${getPosition(Date.now())}%` }}
                    >
                        <div className="text-[10px] text-red-600 font-bold -ml-3 -mt-4 bg-white px-1">Today</div>
                    </div>

                    {tasks.map((task) => {
                        const taskStart = task.createdAt;
                        const taskEnd = task.dueDate ? new Date(task.dueDate).getTime() : task.createdAt + 86400000; 
                        
                        const left = getPosition(taskStart);
                        const width = Math.max(getPosition(taskEnd) - left, 1); 

                        const statusColor = STATUS_COLORS[task.status].split(' ')[0];

                        return (
                            <div key={task.id} className="flex border-b border-slate-100 h-12 hover:bg-slate-50 transition-colors group">
                                <div className="w-64 flex-shrink-0 border-r border-slate-200 p-3 text-sm text-slate-700 truncate font-medium flex items-center sticky left-0 bg-white z-10 group-hover:bg-slate-50">
                                    <div className={`w-2 h-2 rounded-full mr-2 ${statusColor}`}></div>
                                    {task.title}
                                </div>
                                <div className="flex-1 relative p-2">
                                    <div 
                                        className={`absolute top-3 h-6 rounded-md shadow-sm border border-white/50 cursor-pointer hover:shadow-md transition-shadow text-[10px] text-slate-700 flex items-center px-2 truncate overflow-hidden ${statusColor.replace('bg-', 'bg-opacity-20 bg-')}`}
                                        style={{ left: `${left}%`, width: `${width}%` }}
                                        title={`${task.title} (${new Date(taskStart).toLocaleDateString()} - ${task.dueDate || '?'})`}
                                    >
                                        <div className={`absolute inset-0 opacity-20 ${statusColor}`}></div>
                                        <span className="relative z-10 font-medium">{task.title}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    </div>
  );
};
