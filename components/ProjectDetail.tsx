
import React, { useState, useMemo } from 'react';
import { Project, TaskStatus, Task, Priority, Tag, User, Comment, Attachment } from '../types';
import { TaskCard } from './TaskCard';
import { STATUS_COLORS } from '../constants';
import { Button } from './Button';
import { Plus, ArrowLeft, BarChart2, Search, Filter, X, Share2, Copy, Check, Mail, Users, Trash2, Layout, Calendar as CalendarIcon, List } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { v4 as uuidv4 } from 'uuid';
import { GanttChart } from './GanttChart';
import { CalendarView } from './CalendarView';

interface ProjectDetailProps {
  project: Project;
  users: User[];
  currentUser: User;
  onBack: () => void;
  onUpdateProject: (project: Project) => void;
}

type ViewType = 'BOARD' | 'GANTT' | 'CALENDAR';

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, users, currentUser, onBack, onUpdateProject }) => {
  const [currentView, setCurrentView] = useState<ViewType>('BOARD');
  
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [showStats, setShowStats] = useState(false);
  
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'ALL'>('ALL');

  const projectMembers = users.filter(u => project.members?.includes(u.id));

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const updatedTasks = project.tasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    onUpdateProject({ ...project, tasks: updatedTasks });
  };

  const handleAssign = (taskId: string, userId: string) => {
    const updatedTasks = project.tasks.map(t => 
      t.id === taskId ? { ...t, assigneeId: userId } : t
    );
    onUpdateProject({ ...project, tasks: updatedTasks });
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = project.tasks.filter(t => t.id !== taskId);
    onUpdateProject({ ...project, tasks: updatedTasks });
  };

  const handleDateChange = (taskId: string, date: string) => {
    const updatedTasks = project.tasks.map(t => 
      t.id === taskId ? { ...t, dueDate: date } : t
    );
    onUpdateProject({ ...project, tasks: updatedTasks });
  };

  const handlePriorityChange = (taskId: string, priority: Priority) => {
    const updatedTasks = project.tasks.map(t => 
      t.id === taskId ? { ...t, priority } : t
    );
    onUpdateProject({ ...project, tasks: updatedTasks });
  };
  
  const handleTagsChange = (taskId: string, tags: Tag[]) => {
    const updatedTasks = project.tasks.map(t => 
      t.id === taskId ? { ...t, tags } : t
    );
    onUpdateProject({ ...project, tasks: updatedTasks });
  };
  
  const handleAddComment = (taskId: string, comment: Comment) => {
      const updatedTasks = project.tasks.map(t => {
          if (t.id === taskId) {
              return { ...t, comments: [...(t.comments || []), comment] };
          }
          return t;
      });
      onUpdateProject({ ...project, tasks: updatedTasks });
  };

  const handleAddAttachment = (taskId: string, attachment: Attachment) => {
      const updatedTasks = project.tasks.map(t => {
          if (t.id === taskId) {
              return { ...t, attachments: [...(t.attachments || []), attachment] };
          }
          return t;
      });
      onUpdateProject({ ...project, tasks: updatedTasks });
  };

  const handleRemoveAttachment = (taskId: string, attachmentId: string) => {
      const updatedTasks = project.tasks.map(t => {
          if (t.id === taskId) {
              return { ...t, attachments: (t.attachments || []).filter(a => a.id !== attachmentId) };
          }
          return t;
      });
      onUpdateProject({ ...project, tasks: updatedTasks });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: uuidv4(),
      title: newTaskTitle,
      description: newTaskDesc,
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      createdAt: Date.now(),
      dueDate: newTaskDueDate || undefined,
      tags: [],
      comments: [],
      attachments: []
    };

    onUpdateProject({ ...project, tasks: [...project.tasks, newTask] });
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskDueDate('');
    setShowNewTask(false);
  };
  
  const handleRemoveMember = (userId: string) => {
      if (project.members.length <= 1) return;
      onUpdateProject({
          ...project,
          members: project.members.filter(id => id !== userId)
      });
  };

  const handleInvite = () => {
      if (!inviteEmail) return;
      alert(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://taskhive.app/p/${project.id}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const filteredTasks = useMemo(() => {
    return project.tasks.filter(task => {
      const matchesSearch = 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [project.tasks, searchQuery, priorityFilter]);

  const statsData = Object.values(TaskStatus).map(status => ({
    name: status.replace('_', ' '),
    value: project.tasks.filter(t => t.status === status).length
  })).filter(d => d.value > 0);

  const STATS_COLORS = ['#94a3b8', '#3b82f6', '#f59e0b', '#10b981'];

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} icon={<ArrowLeft size={16} />}>
                Back
            </Button>
            <div>
                <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
                <p className="text-sm text-slate-500">{project.description}</p>
            </div>
            </div>
            <div className="flex space-x-2">
                <Button variant="secondary" onClick={() => setShowShareModal(true)} icon={<Users size={16}/>}>
                    Team
                </Button>
                <Button variant="secondary" onClick={() => setShowStats(!showStats)} icon={<BarChart2 size={16}/>}>
                    Stats
                </Button>
                <Button onClick={() => setShowNewTask(true)} icon={<Plus size={16} />}>
                    New Task
                </Button>
            </div>
        </div>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                    onClick={() => setCurrentView('BOARD')}
                    className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all ${currentView === 'BOARD' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Layout size={16} className="mr-2" />
                    Board
                </button>
                <button 
                    onClick={() => setCurrentView('GANTT')}
                    className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all ${currentView === 'GANTT' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <List size={16} className="mr-2" />
                    Gantt
                </button>
                <button 
                    onClick={() => setCurrentView('CALENDAR')}
                    className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all ${currentView === 'CALENDAR' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <CalendarIcon size={16} className="mr-2" />
                    Calendar
                </button>
            </div>

            <div className="flex items-center space-x-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Filter tasks..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-3 py-1.5 text-sm border-none focus:ring-0 text-slate-700 placeholder-slate-400 w-32 md:w-64"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
                <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
                <div className="items-center space-x-2 px-2 hidden sm:flex">
                    <Filter size={16} className="text-slate-400" />
                    <select 
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value as Priority | 'ALL')}
                        className="text-sm border-none focus:ring-0 text-slate-600 font-medium bg-transparent cursor-pointer hover:text-indigo-600"
                    >
                        <option value="ALL">All Priorities</option>
                        <option value={Priority.HIGH}>High Priority</option>
                        <option value={Priority.MEDIUM}>Medium Priority</option>
                        <option value={Priority.LOW}>Low Priority</option>
                    </select>
                </div>
            </div>
        </div>
      </div>

      {showStats && (
        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-slate-200 h-64 flex items-center justify-center animate-in fade-in slide-in-from-top-4 duration-300">
             <div className="w-full h-full max-w-md">
                 {project.tasks.length === 0 ? (
                     <p className="text-center text-slate-400">No tasks to visualize</p>
                 ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statsData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={STATS_COLORS[index % STATS_COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                 )}
             </div>
        </div>
      )}

      {showNewTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold mb-4 text-slate-800">Add New Task</h3>
            <form onSubmit={handleAddTask}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    placeholder="e.g. Design Homepage"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea 
                    value={newTaskDesc}
                    onChange={e => setNewTaskDesc(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    placeholder="Details about this task..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    value={newTaskDueDate}
                    onChange={e => setNewTaskDueDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-slate-700"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setShowNewTask(false)}>Cancel</Button>
                  <Button type="submit">Create Task</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowShareModal(false)}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center">
                        <Users size={18} className="mr-2 text-indigo-500" />
                        Team Management
                    </h3>
                    <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-md transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Project Members</label>
                        <div className="space-y-3 mb-4">
                            {projectMembers.map(member => (
                                <div key={member.id} className="flex items-center justify-between group">
                                    <div className="flex items-center space-x-3">
                                        <img src={member.avatar} className="w-8 h-8 rounded-full border border-slate-200" alt={member.name}/>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">{member.name}</p>
                                            <p className="text-xs text-slate-400">{member.email}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Remove member"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Invite Team Members</label>
                        <div className="flex space-x-2">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="email" 
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="colleague@example.com"
                                    className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>
                            <Button onClick={handleInvite} disabled={!inviteEmail}>Invite</Button>
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100">
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Project Link</label>
                         <div className="flex space-x-2">
                            <input 
                                readOnly 
                                value={`https://taskhive.app/p/${project.id}`}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none"
                                onClick={(e) => e.currentTarget.select()}
                            />
                            <Button variant="secondary" onClick={copyToClipboard} title="Copy link">
                                {isCopied ? <Check size={16} className="text-emerald-600"/> : <Copy size={16} />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      <div className="flex-1 overflow-x-auto min-h-0">
          {currentView === 'BOARD' && (
              <div className="flex h-full min-w-[1000px] space-x-4 pb-4">
                {Object.values(TaskStatus).map((status) => {
                   const tasksInColumn = filteredTasks.filter(t => t.status === status);
                   
                   return (
                      <div key={status} className="flex-1 min-w-[280px] flex flex-col bg-slate-100/50 rounded-xl border border-slate-200/60 p-3">
                        <div className={`flex items-center justify-between mb-3 px-1`}>
                           <div className="flex items-center space-x-2">
                              <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[status].split(' ')[0].replace('bg-', 'bg-')}`}></span>
                              <h3 className="text-sm font-semibold text-slate-700">{status.replace('_', ' ')}</h3>
                           </div>
                          <span className="bg-slate-200 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full">
                            {tasksInColumn.length}
                          </span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                          {tasksInColumn.map(task => (
                            <TaskCard 
                              key={task.id} 
                              task={task} 
                              users={projectMembers}
                              currentUser={currentUser}
                              onStatusChange={handleStatusChange}
                              onAssign={handleAssign}
                              onDelete={handleDeleteTask}
                              onDateChange={handleDateChange}
                              onPriorityChange={handlePriorityChange}
                              onTagsChange={handleTagsChange}
                              onAddComment={handleAddComment}
                              onAddAttachment={handleAddAttachment}
                              onRemoveAttachment={handleRemoveAttachment}
                            />
                          ))}
                          {tasksInColumn.length === 0 && (
                              <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xs flex-col">
                                  {searchQuery || priorityFilter !== 'ALL' ? (
                                      <>
                                          <span>No matches found</span>
                                          <button 
                                              onClick={() => {setSearchQuery(''); setPriorityFilter('ALL');}}
                                              className="text-indigo-500 hover:underline mt-1"
                                          >
                                              Clear filters
                                          </button>
                                      </>
                                  ) : (
                                      <span>Empty</span>
                                  )}
                              </div>
                          )}
                        </div>
                      </div>
                   );
                })}
              </div>
          )}

          {currentView === 'GANTT' && (
              <div className="h-full">
                  <GanttChart tasks={filteredTasks} />
              </div>
          )}

          {currentView === 'CALENDAR' && (
              <div className="h-full">
                  <CalendarView tasks={filteredTasks} onTaskClick={(task) => console.log('Click', task)} />
              </div>
          )}
      </div>
    </div>
  );
};
