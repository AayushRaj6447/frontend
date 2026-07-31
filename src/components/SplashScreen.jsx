import React from 'react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center theme-bg select-none transition-opacity duration-700 pointer-events-none">
      
      {/* Subtle Background Glow */}
      <div className="absolute w-[80vw] h-[80vw] max-w-[500px] max-h-[500px] rounded-full bg-blood-600/15 blur-[130px] pointer-events-none" />

      {/* Pure Animated Text - HemoVerse */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] animate-splash-text theme-text-primary">
          <span className="text-gradient-blood">HemoVerse</span>
        </h1>
        <p className="mt-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] theme-text-muted opacity-75">
          Emergency Blood Logistics Platform
        </p>
      </div>

    </div>
  );
}
