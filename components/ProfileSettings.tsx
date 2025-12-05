
import React, { useState } from 'react';
import { User } from '../types';
import { Button } from './Button';
import { User as UserIcon, Mail, Camera, Save, Lock } from 'lucide-react';

interface ProfileSettingsProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
        onUpdate({
            ...user,
            name,
            email,
            avatar
        });
        setIsSaving(false);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Profile Settings</h1>
        <p className="text-slate-500 mb-8">Manage your account information and preferences.</p>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 space-y-8">
                <div className="flex items-center space-x-6">
                    <div className="relative group">
                        <img 
                            src={avatar} 
                            alt={name} 
                            className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-sm object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="text-white" size={24} />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">Profile Photo</h3>
                        <p className="text-sm text-slate-500 mb-3">Accepts .jpg, .png, or valid URL.</p>
                        <div className="flex space-x-2">
                             <input 
                                type="text" 
                                value={avatar}
                                onChange={(e) => setAvatar(e.target.value)}
                                className="text-xs border border-slate-300 rounded px-2 py-1 w-64 focus:outline-none focus:border-indigo-500"
                                placeholder="https://..."
                             />
                        </div>
                    </div>
                </div>
                
                <hr className="border-slate-100" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
                
                <div>
                     <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                     <button type="button" className="flex items-center text-sm text-indigo-600 font-medium border border-indigo-200 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors">
                        <Lock size={16} className="mr-2" />
                        Change Password
                     </button>
                </div>
            </div>
            
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 flex justify-end">
                <Button type="submit" isLoading={isSaving} icon={<Save size={18} />}>
                    Save Changes
                </Button>
            </div>
        </form>
    </div>
  );
};
