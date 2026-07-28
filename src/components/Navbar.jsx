import React from 'react';
import { Droplet, Users, HeartPulse, LogIn, LogOut, Lock } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentUser, onOpenAuth, onLogout }) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab(currentUser ? 'dashboard' : 'auth')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blood-800 to-blood-500 p-0.5 shadow-lg shadow-blood-900/50 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
              <Droplet className="w-6 h-6 text-blood-500 fill-blood-500/20 group-hover:animate-pulse" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-gradient-blood">HemoVerse</span>
            <span className="text-[10px] block font-semibold text-blood-500 uppercase tracking-widest -mt-1">3D Blood Bank</span>
          </div>
        </div>

        {/* Navigation Tabs (Only enabled when authenticated) */}
        {currentUser ? (
          <nav className="hidden md:flex items-center gap-1 bg-dark-800/80 p-1.5 rounded-2xl border border-white/5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-blood-700 to-blood-600 text-white shadow-md shadow-blood-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Droplet className="w-4 h-4" />
              3D Dashboard
            </button>

            <button
              onClick={() => setActiveTab('donors')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'donors'
                  ? 'bg-gradient-to-r from-blood-700 to-blood-600 text-white shadow-md shadow-blood-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              Donors Directory
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'requests'
                  ? 'bg-gradient-to-r from-blood-700 to-blood-600 text-white shadow-md shadow-blood-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              Blood Requests
            </button>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-blood-950/60 border border-blood-500/30 text-blood-400 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Please Sign In to Access Platform Telemetry</span>
          </div>
        )}

        {/* Auth / User Actions */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3 pl-3 bg-dark-800/70 border border-white/10 rounded-full py-1 pr-1.5">
              <div className="flex items-center gap-2">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.firstName}
                    className="w-8 h-8 rounded-full object-cover border border-blood-500/50"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blood-800 flex items-center justify-center text-xs font-bold">
                    {currentUser.firstName?.[0] || 'U'}
                  </div>
                )}
                <span className="text-sm font-semibold text-slate-200 hidden sm:inline">
                  {currentUser.firstName}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('auth')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 hover:to-blood-400 text-white text-sm font-semibold shadow-lg shadow-blood-950/60 transition-all transform active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              Sign In / Register
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
