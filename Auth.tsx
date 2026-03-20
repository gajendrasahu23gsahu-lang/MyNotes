
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (email: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email);
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-indigo-600/20">
            <span className="material-icons-round text-3xl">edit_note</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">MyNote</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 transition-all mt-4"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
