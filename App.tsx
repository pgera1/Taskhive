
import React, { useState, useEffect } from 'react';
import { Project, TaskStatus, Priority, User, Notification } from './types';
import { PROJECT_COLORS, MOCK_USERS } from './constants';
import { ProjectDetail } from './components/ProjectDetail';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { Button } from './components/Button';
import { NotificationCenter } from './components/NotificationCenter';
import { ProfileSettings } from './components/ProfileSettings';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Layout, Zap, CheckCircle, Clock, Hexagon, LogOut, Settings } from 'lucide-react';

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    description: 'Overhaul the corporate website with new branding.',
    createdAt: Date.now(),
    color: 'bg-indigo-500',
    members: ['u1', 'u2', 'u3'], 
    tasks: [
      { id: 't1', title: 'Design System', description: 'Create color palette and typography', status: TaskStatus.DONE, priority: Priority.HIGH, createdAt: Date.now(), assigneeId: 'u1', tags: [], comments: [], attachments: [] },
      { id: 't2', title: 'Homepage Mockup', description: 'Draft initial layout for homepage', status: TaskStatus.IN_PROGRESS, priority: Priority.HIGH, createdAt: Date.now(), assigneeId: 'u2', tags: [], comments: [], attachments: [] },
      { id: 't3', title: 'Mobile Responsiveness', description: 'Ensure all pages work on mobile', status: TaskStatus.TODO, priority: Priority.MEDIUM, createdAt: Date.now(), tags: [], comments: [], attachments: [] },
    ]
  },
  {
    id: 'p2',
    name: 'Q3 Marketing Campaign',
    description: 'Plan and execute the summer marketing push.',
    createdAt: Date.now(),
    color: 'bg-emerald-500',
    members: ['u1', 'u4'],
    tasks: [
      { id: 't4', title: 'Social Media Assets', description: 'Create banners for Twitter/LinkedIn', status: TaskStatus.TODO, priority: Priority.MEDIUM, createdAt: Date.now(), tags: [], comments: [], attachments: [] },
    ]
  }
];

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('nexus_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });
  
  const [users, setUsers] = useState<User[]>(MOCK_USERS); 
  const [showLanding, setShowLanding] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile'>('dashboard');
  
  const [isCreating, setIsCreating] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('taskhive_user');
    const token = localStorage.getItem('auth_token');
    
    if (savedUser && token) {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        if (!users.find(u => u.id === parsedUser.id)) {
            setUsers(prev => [...prev, parsedUser]);
        }
        setShowLanding(false);
    }
    localStorage.setItem('nexus_projects', JSON.stringify(projects));
  }, [projects]); 

  useEffect(() => {
    if (!currentUser || showLanding) return;

    const interval = setInterval(() => {
        const randomProjectIndex = Math.floor(Math.random() * projects.length);
        const project = projects[randomProjectIndex];
        
        if (project && project.tasks.length > 0) {
            const randomTask = project.tasks[Math.floor(Math.random() * project.tasks.length)];
            const actions = ['commented on', 'updated status of', 'attached file to'];
            const action = actions[Math.floor(Math.random() * actions.length)];
            const fakeUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
            
            if (fakeUser.id !== currentUser.id) {
                addNotification(
                    'Update from ' + fakeUser.name, 
                    `${fakeUser.name} ${action} "${randomTask.title}" in ${project.name}`,
                    'info'
                );
            }
        }
    }, 45000); 

    return () => clearInterval(interval);
  }, [currentUser, showLanding, projects]);

  const addNotification = (title: string, message: string, type: Notification['type'] = 'info') => {
      if (!currentUser) return;
      const newNotif: Notification = {
          id: uuidv4(),
          userId: currentUser.id,
          title,
          message,
          type,
          isRead: false,
          createdAt: Date.now()
      };
      setNotifications(prev => [newNotif, ...prev]);
  };

  const handleLogin = (user: User, token: string) => {
      setCurrentUser(user);
      localStorage.setItem('taskhive_user', JSON.stringify(user));
      localStorage.setItem('auth_token', token);
      
      if (!users.find(u => u.id === user.id)) {
          setUsers(prev => [...prev, user]);
      }
      
      setShowLanding(false);
      addNotification('Welcome to TaskHive!', `Glad to have you back, ${user.name.split(' ')[0]}.`, 'success');
  };

  const handleLogout = () => {
      setCurrentUser(null);
      localStorage.removeItem('taskhive_user');
      localStorage.removeItem('auth_token');
      setShowLanding(true);
      setActiveProjectId(null);
      setCurrentView('dashboard');
  };
  
  const handleUpdateProfile = (updatedUser: User) => {
      setCurrentUser(updatedUser);
      localStorage.setItem('taskhive_user', JSON.stringify(updatedUser));
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      addNotification('Profile Updated', 'Your account details have been saved.', 'success');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !currentUser) return;

    const newProject: Project = {
      id: uuidv4(),
      name: newProjectName,
      description: newProjectDescription || 'No description provided',
      tasks: [],
      createdAt: Date.now(),
      color: PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)],
      members: [currentUser.id] 
    };

    setProjects([newProject, ...projects]);
    setIsCreating(false);
    setNewProjectName('');
    setNewProjectDescription('');
    setActiveProjectId(newProject.id); 
    addNotification('Project Created', `"${newProjectName}" is ready for tasks.`, 'success');
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const deleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm("Are you sure you want to delete this project?")) {
        setProjects(projects.filter(p => p.id !== id));
        addNotification('Project Deleted', 'The project has been permanently removed.', 'info');
    }
  };

  const activeProject = projects.find(p => p.id === activeProjectId);

  const userProjects = projects; 
  const totalTasks = userProjects.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = userProjects.reduce((acc, p) => acc + p.tasks.filter(t => t.status === TaskStatus.DONE).length, 0);
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  if (!currentUser) {
      return <LoginPage onLogin={handleLogin} />;
  }

  if (activeProject) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
             <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xl cursor-pointer hover:text-indigo-700 transition-colors" onClick={() => setActiveProjectId(null)}>
                <Hexagon className="w-8 h-8 fill-indigo-100 stroke-indigo-600 stroke-2" />
                <span className="tracking-tight">TaskHive</span>
             </div>
             
             <div className="flex items-center space-x-4">
                 <NotificationCenter 
                    notifications={notifications} 
                    onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))}
                    onClearAll={() => setNotifications([])}
                 />
                 <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { setActiveProjectId(null); setCurrentView('profile'); }}>
                     <img src={currentUser.avatar} alt="User" className="w-8 h-8 rounded-full border border-slate-200" />
                     <span className="text-sm font-medium text-slate-700 hidden md:block">{currentUser.name}</span>
                 </div>
                 <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-600">
                    <LogOut size={18} />
                 </Button>
             </div>
        </header>
        <main className="flex-1 p-6 overflow-hidden">
             <ProjectDetail 
                project={activeProject} 
                users={users}
                currentUser={currentUser}
                onBack={() => setActiveProjectId(null)}
                onUpdateProject={handleUpdateProject}
             />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20 hidden md:flex">
        <div className="p-6 flex items-center space-x-3 font-bold text-2xl tracking-tight text-white cursor-pointer" onClick={() => { setActiveProjectId(null); setCurrentView('dashboard'); }}>
          <Hexagon className="w-8 h-8 text-indigo-500 fill-indigo-500/20" />
          <span>TaskHive</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <div 
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm cursor-pointer transition-colors ${currentView === 'dashboard' ? 'bg-slate-800 text-indigo-200 border border-slate-700/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
             <Layout size={16} className="mr-3" />
             Dashboard
          </div>
          <div 
            onClick={() => setCurrentView('profile')}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm cursor-pointer transition-colors ${currentView === 'profile' ? 'bg-slate-800 text-indigo-200 border border-slate-700/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
             <Settings size={16} className="mr-3" />
             Settings
          </div>
          <div className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium flex items-center cursor-not-allowed opacity-50" title="Coming Soon">
             <CheckCircle size={16} className="mr-3" />
             My Tasks
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
            <div className="flex items-center space-x-3 mb-6 px-2 cursor-pointer" onClick={() => setCurrentView('profile')}>
                <img src={currentUser.avatar} alt="User" className="w-9 h-9 rounded-full border border-slate-600" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-400 truncate">{currentUser.email || 'User'}</p>
                </div>
            </div>
            
            <button onClick={handleLogout} className="w-full flex items-center justify-center p-2 rounded-md bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors mb-4 text-sm font-medium">
                <LogOut size={16} className="mr-2"/> Sign Out
            </button>

           <div className="bg-slate-800 rounded-lg p-4 border border-slate-700/50">
              <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">Overall Progress</p>
              <div className="flex items-end justify-between mb-2">
                 <span className="text-2xl font-bold text-white">{progress}%</span>
                 <span className="text-xs text-indigo-400 mb-1 font-mono">{completedTasks}/{totalTasks}</span>
              </div>
              <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
              </div>
           </div>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="md:hidden flex justify-between items-center mb-8">
             <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xl">
                <Hexagon className="w-8 h-8 fill-indigo-100 stroke-indigo-600 stroke-2" />
                <span className="tracking-tight">TaskHive</span>
             </div>
             <div className="flex items-center space-x-3">
                 <NotificationCenter 
                    notifications={notifications} 
                    onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))}
                    onClearAll={() => setNotifications([])}
                 />
                 <button onClick={handleLogout}>
                     <LogOut size={20} className="text-slate-500" />
                 </button>
             </div>
          </div>
          
          {currentView === 'profile' ? (
              <ProfileSettings user={currentUser} onUpdate={handleUpdateProfile} />
          ) : (
            <>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 space-y-4 md:space-y-0">
                    <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Welcome back, {currentUser.name}! You have {userProjects.length} active projects.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:block">
                             <NotificationCenter 
                                notifications={notifications} 
                                onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))}
                                onClearAll={() => setNotifications([])}
                            />
                        </div>
                        <Button onClick={() => setIsCreating(true)} icon={<Plus size={20} />}>
                        New Project
                        </Button>
                    </div>
                </div>

                {isCreating && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-slate-100 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                            <Hexagon size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Create New Project</h2>
                            <p className="text-sm text-slate-500">Start managing your tasks</p>
                        </div>
                        </div>
                        
                        <form onSubmit={handleCreateProject}>
                        <div className="space-y-5">
                            <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Project Name</label>
                            <input 
                                type="text" 
                                value={newProjectName}
                                onChange={e => setNewProjectName(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="e.g. Q4 Mobile App Launch"
                                required
                                autoFocus
                            />
                            </div>
                            
                            <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                            <textarea 
                                value={newProjectDescription}
                                onChange={e => setNewProjectDescription(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                placeholder="Briefly describe what this project is about..."
                                rows={3}
                            />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 mt-6">
                            <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                            <Button type="submit" disabled={!newProjectName.trim()}>
                                Create Project
                            </Button>
                            </div>
                        </div>
                        </form>
                    </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:border-indigo-200 transition-colors">
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Tasks</h3>
                        <div className="flex items-end justify-between mt-2">
                            <span className="text-4xl font-bold text-slate-800">{totalTasks}</span>
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <Layout size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:border-emerald-200 transition-colors">
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Completion Rate</h3>
                        <div className="flex items-end justify-between mt-2">
                            <span className="text-4xl font-bold text-slate-800">{progress}%</span>
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                <CheckCircle size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:border-indigo-200 transition-colors">
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Projects</h3>
                        <div className="flex items-end justify-between mt-2">
                            <span className="text-4xl font-bold text-slate-800">{userProjects.length}</span>
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Zap size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                    Your Projects
                    <span className="ml-3 bg-slate-200 text-slate-600 text-xs font-bold py-1 px-2.5 rounded-full">{userProjects.length}</span>
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {userProjects.map(project => {
                    const pTotal = project.tasks.length;
                    const pDone = project.tasks.filter(t => t.status === TaskStatus.DONE).length;
                    const pProgress = pTotal === 0 ? 0 : Math.round((pDone / pTotal) * 100);

                    return (
                        <div 
                        key={project.id} 
                        onClick={() => setActiveProjectId(project.id)}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                        >
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${project.color}`}></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl ${project.color} bg-opacity-10 flex items-center justify-center text-xl font-bold ${project.color.replace('bg-', 'text-')}`}>
                            {project.name.charAt(0)}
                            </div>
                            <button 
                                onClick={(e) => deleteProject(project.id, e)}
                                className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-slate-50"
                            >
                                <span className="sr-only">Delete</span>
                                &times;
                            </button>
                        </div>
                        
                        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors truncate">{project.name}</h3>
                        <p className="text-sm text-slate-500 mb-6 line-clamp-2 h-10 leading-relaxed">{project.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 uppercase font-bold tracking-wide">
                            <span>Progress</span>
                            <span>{pProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
                            <div 
                            className={`h-2 rounded-full transition-all duration-700 ease-out ${project.color}`} 
                            style={{ width: `${pProgress}%` }}
                            ></div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex -space-x-2">
                                {project.tasks.slice(0,3).map((t, i) => (
                                    <div key={t.id} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] text-slate-500 font-bold z-10 shadow-sm" style={{zIndex: 3-i}}>
                                        {t.assigneeId ? (
                                            <img src={`https://ui-avatars.com/api/?name=${users.find(u => u.id === t.assigneeId)?.name || '?'}&background=random`} className="w-full h-full rounded-full" alt="User" />
                                        ) : (
                                            '?'
                                        )}
                                    </div>
                                ))}
                                {project.tasks.length > 3 && (
                                    <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] text-slate-500 font-bold z-0 shadow-sm">
                                        +{project.tasks.length - 3}
                                    </div>
                                )}
                            </div>
                            <div className="text-xs text-slate-400 font-medium">
                                {pTotal} Tasks
                            </div>
                        </div>
                        </div>
                    );
                    })}
                    
                    <button 
                        onClick={() => setIsCreating(true)}
                        className="rounded-xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all h-[260px] group"
                    >
                        <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-indigo-100 group-hover:scale-110 transition-all duration-300">
                            <Plus size={28} />
                        </div>
                        <span className="font-semibold text-lg">Create New Project</span>
                        <span className="text-xs text-slate-400 mt-1">Start tracking your hive</span>
                    </button>
                </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
