
import React from 'react';
import { Hexagon, ArrowRight, Layout, Zap, CheckCircle } from 'lucide-react';
import { Button } from './Button';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden font-sans text-slate-900">
      
      <nav className="flex justify-between items-center px-6 md:px-8 py-6 max-w-7xl mx-auto w-full z-10">
        <div className="flex items-center space-x-2 text-indigo-600 font-bold text-2xl">
           <Hexagon className="w-8 h-8 fill-indigo-100 stroke-indigo-600 stroke-2" />
           <span className="tracking-tight">TaskHive</span>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center relative z-10 mt-[-40px]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative">
            <div className="inline-flex items-center space-x-2 bg-white border border-indigo-100 rounded-full px-4 py-1.5 text-indigo-700 text-sm font-medium mb-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span>v2.0 Now Available</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight max-w-4xl leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Manage your projects <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">with hive-mind efficiency</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            TaskHive brings your team together in a focused, collaborative environment. 
            Track tasks, set priorities, and hit deadlines without the buzz of distraction.
            </p>
            
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 flex flex-col items-center">
                <Button 
                    onClick={onEnter} 
                    size="lg" 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 h-auto text-lg rounded-full shadow-xl shadow-indigo-200 transition-all hover:scale-105 group"
                >
                    Launch Workspace <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
                <p className="mt-4 text-sm text-slate-400">No credit card required · Free for small teams</p>
            </div>
        </div>
      </main>

      <div className="grid grid-cols-1 md:grid-cols-3 border-t border-slate-200 bg-white relative z-10">
          <div className="p-8 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col items-center text-center group hover:bg-slate-50 transition-colors">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Layout size={24} />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Kanban Boards</h3>
              <p className="text-slate-500 text-sm">Visualize workflow with intuitive drag-and-drop boards.</p>
          </div>
          <div className="p-8 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col items-center text-center group hover:bg-slate-50 transition-colors">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap size={24} />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Instant Updates</h3>
              <p className="text-slate-500 text-sm">Real-time status tracking and priority management.</p>
          </div>
          <div className="p-8 flex flex-col items-center text-center group hover:bg-slate-50 transition-colors">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle size={24} />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Progress Analytics</h3>
              <p className="text-slate-500 text-sm">Visual insights into your team's productivity and velocity.</p>
          </div>
      </div>
    </div>
  );
};
