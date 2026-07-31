import React, { useState } from 'react';
import { Droplet, Users, HeartPulse, LogIn, LogOut, Lock, Menu, X, LayoutDashboard, Sun, Moon } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentUser, onOpenAuth, onLogout, theme, onToggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b theme-border px-4 lg:px-8 py-3.5 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleTabClick('dashboard')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blood-800 via-blood-600 to-blood-500 p-0.5 shadow-xl shadow-blood-900/30 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full theme-card rounded-[14px] flex items-center justify-center">
              <Droplet className="w-6 h-6 text-blood-500 fill-blood-500/20 group-hover:animate-pulse" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-gradient-blood">HemoVerse</span>
            <span className="text-[10px] block font-extrabold text-blood-500 uppercase tracking-widest -mt-1">Blood Bank System</span>
          </div>
        </div>

        {/* Desktop Navigation Tabs (Visible to all users) */}
        <nav className="hidden md:flex items-center gap-1.5 glass-panel p-1.5 rounded-2xl border theme-border">
          <button
            onClick={() => handleTabClick('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-blood-700 to-blood-600 text-white shadow-lg shadow-blood-900/40 scale-[1.02]'
                : 'theme-text-muted hover:theme-text-primary hover:bg-blood-500/10'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => handleTabClick('donors')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 ${
              activeTab === 'donors'
                ? 'bg-gradient-to-r from-blood-700 to-blood-600 text-white shadow-lg shadow-blood-900/40 scale-[1.02]'
                : 'theme-text-muted hover:theme-text-primary hover:bg-blood-500/10'
            }`}
          >
            <Users className="w-4 h-4" />
            Donors Directory
          </button>

          <button
            onClick={() => handleTabClick('requests')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 ${
              activeTab === 'requests'
                ? 'bg-gradient-to-r from-blood-700 to-blood-600 text-white shadow-lg shadow-blood-900/40 scale-[1.02]'
                : 'theme-text-muted hover:theme-text-primary hover:bg-blood-500/10'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            Blood Requests
          </button>
        </nav>

        {/* Desktop Auth / User Actions & Theme Toggle */}
        <div className="flex items-center gap-2.5">
          
          {/* Theme Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2.5 rounded-xl glass-panel theme-text-primary hover:scale-105 active:scale-90 transition-all duration-300 shadow-sm flex items-center justify-center"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {currentUser ? (
            <div className="hidden sm:flex items-center gap-3 pl-3 glass-panel border theme-border rounded-full py-1 pr-1.5 shadow-sm">
              <div className="flex items-center gap-2">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.firstName}
                    className="w-8 h-8 rounded-full object-cover border border-blood-500/60 shadow-md"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blood-700 text-white flex items-center justify-center text-xs font-black">
                    {currentUser.firstName?.[0] || 'U'}
                  </div>
                )}
                <span className="text-xs sm:text-sm font-extrabold theme-text-primary">
                  {currentUser.firstName}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                className="p-1.5 theme-text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleTabClick('auth')}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-blood-900/40 transition-all hover-lift active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl glass-panel theme-text-primary hover:bg-blood-500/10"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 pb-2 border-t theme-border mt-3 space-y-2 animate-fade-in-up">
          <button
            onClick={() => handleTabClick('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-extrabold ${
              activeTab === 'dashboard' ? 'bg-blood-600 text-white' : 'theme-text-secondary hover:bg-blood-500/10'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => handleTabClick('donors')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-extrabold ${
              activeTab === 'donors' ? 'bg-blood-600 text-white' : 'theme-text-secondary hover:bg-blood-500/10'
            }`}
          >
            <Users className="w-4 h-4" />
            Donors Directory
          </button>

          <button
            onClick={() => handleTabClick('requests')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-extrabold ${
              activeTab === 'requests' ? 'bg-blood-600 text-white' : 'theme-text-secondary hover:bg-blood-500/10'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            Blood Requests
          </button>

          {currentUser ? (
            <div className="pt-2 border-t theme-border flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.firstName} className="w-7 h-7 rounded-full object-cover border border-blood-500" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blood-800 text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.firstName?.[0] || 'U'}
                  </div>
                )}
                <span className="text-sm font-bold theme-text-primary">{currentUser.firstName}</span>
              </div>
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-500 text-xs font-bold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleTabClick('auth')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blood-600 to-blood-500 text-white font-black text-sm shadow-lg"
            >
              <LogIn className="w-4 h-4" />
              Sign In / Register
            </button>
          )}
        </div>
      )}
    </header>
  );
}
