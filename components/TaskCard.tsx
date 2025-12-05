
import React, { useState } from 'react';
import { Task, TaskStatus, Priority, Tag, User, Comment, Attachment } from '../types';
import { PRIORITY_COLORS, STATUS_COLORS, TAG_COLORS } from '../constants';
import { Calendar, User as UserIcon, MoreHorizontal, X, Trash2, Clock, AlignLeft, Share2, Tag as TagIcon, Plus, MessageSquare, Send, Paperclip, FileIcon, Download, CloudUpload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface TaskCardProps {
  task: Task;
  users: User[];
  currentUser: User;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onAssign: (taskId: string, userId: string) => void;
  onDelete: (taskId: string) => void;
  onDateChange: (taskId: string, date: string) => void;
  onPriorityChange: (taskId: string, priority: Priority) => void;
  onTagsChange: (taskId: string, tags: Tag[]) => void;
  onAddComment: (taskId: string, comment: Comment) => void;
  onAddAttachment?: (taskId: string, attachment: Attachment) => void;
  onRemoveAttachment?: (taskId: string, attachmentId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
    task, users, currentUser, 
    onStatusChange, onAssign, onDelete, onDateChange, onPriorityChange, onTagsChange, onAddComment,
    onAddAttachment, onRemoveAttachment
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  const [newTagName, setNewTagName] = useState('');
  const [selectedTagColor, setSelectedTagColor] = useState(TAG_COLORS[0]);

  const [newComment, setNewComment] = useState('');

  const assignee = users.find(u => u.id === task.assigneeId);
  const tags = task.tags || []; 

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  
  const formatDateFull = (dateString: string) => {
     if (!dateString) return '';
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
  }
  
  const formatTimeAgo = (timestamp: number) => {
      const seconds = Math.floor((Date.now() - timestamp) / 1000);
      if (seconds < 60) return 'Just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      return new Date(timestamp).toLocaleDateString();
  };

  const isOverdue = task.dueDate 
    ? new Date(task.dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0) && task.status !== TaskStatus.DONE
    : false;

  const handleShare = (type: 'link' | 'email') => {
    if (type === 'link') {
        navigator.clipboard.writeText(`https://taskhive.app/task/${task.id}`);
        alert('Task link copied to clipboard!');
    } else {
        const subject = `Task: ${task.title}`;
        const body = `Check out this task: ${task.title}\n\nDescription: ${task.description}\n\nLink: https://taskhive.app/task/${task.id}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
    setShowShareMenu(false);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    const newTag: Tag = {
        id: uuidv4(),
        name: newTagName.trim(),
        color: selectedTagColor,
    };
    onTagsChange(task.id, [...tags, newTag]);
    setNewTagName('');
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(task.id, tags.filter(t => t.id !== tagId));
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newComment.trim()) return;
      
      const comment: Comment = {
          id: uuidv4(),
          userId: currentUser.id,
          text: newComment.trim(),
          createdAt: Date.now()
      };
      
      onAddComment(task.id, comment);
      setNewComment('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onAddAttachment) {
          const attachment: Attachment = {
              id: uuidv4(),
              name: file.name,
              url: URL.createObjectURL(file),
              type: file.type,
              size: file.size,
              createdAt: Date.now()
          };
          onAddAttachment(task.id, attachment);
      }
  };

  if (isConfirmingDelete) {
    return (
      <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-200 h-full flex flex-col justify-center items-center text-center animate-in fade-in duration-200">
        <h4 className="text-sm font-bold text-red-700 mb-1">Delete this task?</h4>
        <p className="text-xs text-red-600/70 mb-3">This action cannot be undone.</p>
        <div className="flex space-x-2 w-full justify-center">
          <button 
            onClick={() => setIsConfirmingDelete(false)}
            className="flex items-center justify-center px-3 py-1.5 rounded-md bg-white text-slate-600 border border-slate-200 text-xs font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="flex items-center justify-center px-3 py-1.5 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors shadow-sm"
          >
            <Trash2 size={12} className="mr-1" /> Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all group relative">
      <div className="flex justify-between items-start mb-2">
        <div className="relative z-10">
            <select
              value={task.priority}
              onChange={(e) => {
                e.stopPropagation();
                onPriorityChange(task.id, e.target.value as Priority);
              }}
              onClick={(e) => e.stopPropagation()}
              className={`appearance-none text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${PRIORITY_COLORS[task.priority]} border-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 cursor-pointer text-center outline-none`}
            >
              {Object.values(Priority).map(p => (
                <option key={p} value={p} className="bg-white text-slate-700">{p}</option>
              ))}
            </select>
        </div>
        <div className="flex items-center space-x-1">
             <div className="relative">
                <button 
                    onClick={(e) => { e.stopPropagation(); setShowShareMenu(!showShareMenu); }}
                    className="text-slate-400 hover:text-indigo-600 p-1 rounded-md hover:bg-indigo-50 transition-colors"
                >
                    <Share2 size={14} />
                </button>
                {showShareMenu && (
                    <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-md shadow-lg border border-slate-100 py-1 z-20">
                        <button onClick={() => handleShare('link')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">Copy Link</button>
                        <button onClick={() => handleShare('email')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">Share via Email</button>
                    </div>
                )}
             </div>
             
             <div className="relative group/menu">
                <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-50 transition-colors">
                    <MoreHorizontal size={16} />
                </button>
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-md shadow-lg border border-slate-100 py-1 hidden group-hover/menu:block z-20">
                    <button 
                        onClick={(e) => {
                        e.stopPropagation();
                        setIsConfirmingDelete(true);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center"
                    >
                    <Trash2 size={12} className="mr-2" />
                    Delete Task
                    </button>
                </div>
            </div>
        </div>
      </div>
      
      <div 
        onClick={() => setShowDetails(true)}
        className="cursor-pointer group/content"
      >
          <h4 className="text-sm font-semibold text-slate-800 mb-1 leading-snug group-hover/content:text-indigo-600 transition-colors">{task.title}</h4>
          
          {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                  {tags.map(tag => (
                      <span key={tag.id} className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${tag.color}`}>
                          {tag.name}
                      </span>
                  ))}
              </div>
          )}

          <p className="text-xs text-slate-500 mb-4 line-clamp-2">{task.description}</p>
          
          <div className="flex items-center space-x-3 mb-2">
              {(task.comments?.length || 0) > 0 && (
                  <div className="flex items-center text-xs text-slate-400" title={`${task.comments.length} comments`}>
                      <MessageSquare size={12} className="mr-1" />
                      {task.comments.length}
                  </div>
              )}
              {(task.attachments?.length || 0) > 0 && (
                  <div className="flex items-center text-xs text-slate-400" title={`${task.attachments?.length} attachments`}>
                      <Paperclip size={12} className="mr-1" />
                      {task.attachments?.length}
                  </div>
              )}
          </div>
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
        <div className="flex items-center space-x-2">
          {assignee ? (
            <img 
              src={assignee.avatar} 
              alt={assignee.name} 
              className="w-6 h-6 rounded-full border border-white shadow-sm"
              title={assignee.name}
            />
          ) : (
            <button 
              onClick={() => onAssign(task.id, users[0].id)}
              className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200"
            >
              <UserIcon size={12} />
            </button>
          )}

          <div className="relative group/date">
              <input
                 type="date"
                 className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                 onChange={(e) => onDateChange(task.id, e.target.value)}
                 value={task.dueDate || ''}
                 title="Set due date"
              />
              <div className={`flex items-center text-xs ${isOverdue ? 'text-red-500 font-medium' : (task.dueDate ? 'text-slate-500' : 'text-slate-300')} group-hover/date:text-indigo-600 transition-colors px-1 py-0.5 rounded hover:bg-slate-100`}>
                 <Calendar size={12} className="mr-1" />
                 <span>{task.dueDate ? formatDate(task.dueDate) : 'Date'}</span>
              </div>
          </div>
        </div>
        
        <select 
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          className="text-xs border-none bg-transparent text-slate-500 focus:ring-0 cursor-pointer hover:text-indigo-600 font-medium text-right max-w-[80px]"
        >
          {Object.values(TaskStatus).map(s => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>
    </div>

    {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDetails(false)}>
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 h-[85vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                    <div className="pr-4 flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                             <select
                                value={task.priority}
                                onChange={(e) => onPriorityChange(task.id, e.target.value as Priority)}
                                className={`appearance-none text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${PRIORITY_COLORS[task.priority]} border-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 cursor-pointer outline-none`}
                                >
                                {Object.values(Priority).map(p => (
                                    <option key={p} value={p} className="bg-white text-slate-700">{p}</option>
                                ))}
                            </select>
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[task.status]}`}>
                                {task.status.replace('_', ' ')}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 leading-snug">{task.title}</h3>
                    </div>
                    <button 
                        onClick={() => setShowDetails(false)} 
                        className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-md transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex flex-1 overflow-hidden">
                    <div className="w-2/3 p-6 overflow-y-auto custom-scrollbar border-r border-slate-100">
                         <div className="mb-6">
                             <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                <TagIcon size={14} className="mr-2" />
                                Tags
                             </div>
                             <div className="flex flex-wrap gap-2 mb-3">
                                {tags.map(tag => (
                                    <span key={tag.id} className={`text-xs px-2 py-1 rounded-full font-medium ${tag.color} flex items-center group`}>
                                        {tag.name}
                                        <button 
                                            onClick={() => handleRemoveTag(tag.id)}
                                            className="ml-1 opacity-50 group-hover:opacity-100 hover:text-red-600"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                                {tags.length === 0 && <span className="text-sm text-slate-400 italic">No tags</span>}
                             </div>
                             
                             <form onSubmit={handleAddTag} className="flex items-center space-x-2">
                                 <input 
                                    type="text" 
                                    value={newTagName}
                                    onChange={e => setNewTagName(e.target.value)}
                                    placeholder="Add tag..." 
                                    className="flex-1 text-sm border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:border-indigo-400"
                                 />
                                 <div className="flex space-x-1">
                                    {TAG_COLORS.slice(0, 5).map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setSelectedTagColor(color)}
                                            className={`w-4 h-4 rounded-full ${color.split(' ')[0]} ${selectedTagColor === color ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`}
                                        />
                                    ))}
                                 </div>
                                 <button 
                                    type="submit"
                                    disabled={!newTagName.trim()}
                                    className="p-1 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 disabled:opacity-50"
                                 >
                                     <Plus size={16} />
                                 </button>
                             </form>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                <AlignLeft size={14} className="mr-2" />
                                Description
                            </div>
                            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100">
                                {task.description || <span className="text-slate-400 italic">No description provided.</span>}
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                <div className="flex items-center">
                                    <Paperclip size={14} className="mr-2" />
                                    Attachments
                                </div>
                                <label className="cursor-pointer text-indigo-600 hover:text-indigo-700 flex items-center hover:bg-indigo-50 px-2 py-1 rounded transition-colors">
                                    <CloudUpload size={14} className="mr-1" />
                                    <span className="capitalize">Upload</span>
                                    <input type="file" className="hidden" onChange={handleFileUpload} />
                                </label>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {task.attachments?.map(att => (
                                    <div key={att.id} className="flex items-center p-3 border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors bg-white group">
                                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 mr-3 flex-shrink-0">
                                            <FileIcon size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-700 truncate">{att.name}</p>
                                            <p className="text-xs text-slate-400">{(att.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a 
                                                href={att.url} 
                                                download={att.name}
                                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                                            >
                                                <Download size={14} />
                                            </a>
                                            {onRemoveAttachment && (
                                                <button 
                                                    onClick={() => onRemoveAttachment(task.id, att.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {(!task.attachments || task.attachments.length === 0) && (
                                    <div className="col-span-full border-2 border-dashed border-slate-200 rounded-lg p-4 text-center text-slate-400 text-sm">
                                        No attachments yet
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                                <MessageSquare size={14} className="mr-2" />
                                Comments ({task.comments?.length || 0})
                            </div>
                            
                            <div className="space-y-4 mb-4">
                                {task.comments && task.comments.map(comment => {
                                    const commentUser = users.find(u => u.id === comment.userId);
                                    return (
                                        <div key={comment.id} className="flex space-x-3">
                                            <img 
                                                src={commentUser?.avatar || 'https://via.placeholder.com/32'} 
                                                className="w-8 h-8 rounded-full border border-slate-100" 
                                                alt="User" 
                                            />
                                            <div className="bg-slate-50 p-3 rounded-lg rounded-tl-none border border-slate-100 flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-bold text-slate-700">{commentUser?.name || 'Unknown'}</span>
                                                    <span className="text-[10px] text-slate-400">{formatTimeAgo(comment.createdAt)}</span>
                                                </div>
                                                <p className="text-sm text-slate-600">{comment.text}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                {(!task.comments || task.comments.length === 0) && (
                                    <p className="text-sm text-slate-400 italic text-center py-4">No comments yet.</p>
                                )}
                            </div>
                            
                            <form onSubmit={handleSubmitComment} className="flex space-x-2">
                                <img src={currentUser.avatar} className="w-8 h-8 rounded-full" alt="Me" />
                                <div className="flex-1 relative">
                                    <input 
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="w-full border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Write a comment..."
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!newComment.trim()}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md disabled:opacity-50"
                                    >
                                        <Send size={14} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="w-1/3 p-6 bg-slate-50/50">
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                <Clock size={14} className="mr-2" />
                                Due Date
                                </div>
                                <div className={`flex items-center text-sm font-medium p-2 rounded-lg border bg-white ${isOverdue ? 'text-red-700 border-red-200' : 'text-slate-700 border-slate-200'}`}>
                                <Calendar size={16} className={`mr-2 ${isOverdue ? 'text-red-500' : 'text-slate-400'}`} />
                                {task.dueDate ? formatDateFull(task.dueDate) : 'Not set'}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                <UserIcon size={14} className="mr-2" />
                                Assignee
                                </div>
                                <div className="flex items-center p-2 rounded-lg border border-slate-200 bg-white">
                                {assignee ? (
                                    <>
                                        <img src={assignee.avatar} className="w-6 h-6 rounded-full mr-2" alt={assignee.name} />
                                        <span className="text-sm font-medium text-slate-700">{assignee.name}</span>
                                    </>
                                ) : (
                                    <span className="text-sm text-slate-400 italic">Unassigned</span>
                                )}
                                </div>
                                <div className="mt-2 text-xs text-slate-500">
                                    <p className="mb-1 font-semibold">Change Assignee:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {users.map(u => (
                                            <button 
                                                key={u.id}
                                                onClick={() => onAssign(task.id, u.id)}
                                                className={`w-6 h-6 rounded-full border border-white shadow-sm transition-transform hover:scale-110 ${task.assigneeId === u.id ? 'ring-2 ring-indigo-500' : 'opacity-70 hover:opacity-100'}`}
                                                title={u.name}
                                            >
                                                <img src={u.avatar} className="w-full h-full rounded-full" alt={u.name} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-xs text-slate-400 pt-6 mt-6 border-t border-slate-200">
                                <p className="mb-1">Task ID: <span className="font-mono">{task.id.substring(0,8)}</span></p>
                                <p>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )}
    </>
  );
};
